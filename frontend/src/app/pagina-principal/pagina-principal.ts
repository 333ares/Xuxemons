import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterLink, Nav],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.css'],
})
export class PaginaPrincipal implements OnInit {
  // ── Datos del usuario autenticado ──────────────────────────────────────────
  usuario: any = null;

  // ── Fecha formateada en castellano ─────────────────────────────────────────
  fechaHoy: string = '';

  // ── KPIs de colección (se calculan a partir de GET /xuxemons) ─────────────
  coleccion = {
    total: 0,
    enfermos: 0,
    evoluciones: 0, // Xuxemons de tamaño 'g' (grande = evolucionados)
    agua: 0,
    tierra: 0,
    aire: 0,
    progresoPct: 0,
  };

  // ── Estadísticas de batalla (pendiente de endpoint; se inicializan a 0) ───
  estadisticas = {
    ganadas: 0,
    jugadas: 0,
    racha: 0,
  };

  // ── Recompensas diarias (configuración procedente del backend) ─────────────
  recompensasDiarias = {
    xuxes: {
      cantidad: 0,
      hora: '--:--',
    },
    xuxemon: {
      hora: '--:--',
    },
  };

  // ── Solicitudes de amistad pendientes ─────────────────────────────────────
  solicitudesAmistad: { id: number; nombre: string; public_id: string }[] = [];

  // Peticiones de batalla (pendiente de endpoint; array vacío por defecto)
  solicitudesBatalla: { nombre: string }[] = [];

  // ── Xuxemon destacado para la sección "Listo para luchar" ─────────────────
  // Se usa el primero de la colección que no esté enfermo
  xuxemon: { nombre: string; tipo: string; tamano: string } | null = null;

  // ── Mochila ────────────────────────────────────────────────────────────────
  mochila = {
    ocupados: 0,
    total: 20, // El backend fija el límite en 20
  };

  // Slots visuales para la cuadrícula de la mochila
  mochilaSlots: { ocupado: boolean; tipo: string; emoji: string }[] = [];

  // ── Lista de amigos ────────────────────────────────────────────────────────
  // El campo "online" no viene del backend actual; se muestra siempre como false
  amigos: { nombre: string; online: boolean }[] = [];

  // ── Estado de carga ────────────────────────────────────────────────────────
  cargando = true;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.calcularFechaHoy();
    // Cargamos todos los datos en paralelo
    this.cargarUsuario();
    this.cargarXuxemons();
    this.cargarMochila();
    this.cargarSolicitudesPendientes();
    this.cargarAmigos();
    this.cargarConfigDiaria();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private calcularFechaHoy(): void {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Devuelve el emoji correspondiente al tipo y nombre de un objeto de la mochila
  private emojiObjeto(tipo: string, nombre: string): string {
    if (tipo === 'vacuna') return '💉';
    // Xuxes: distintos emojis según el nombre
    const mapaXuxe: Record<string, string> = {
      xocolatina: '🍫',
      piruleta: '🍭',
      gominola: '🍬',
      caramel: '🍡',
    };
    return mapaXuxe[nombre] ?? '🍬';
  }

  // ── Carga de datos desde el backend ───────────────────────────────────────

  private cargarUsuario(): void {
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario ?? res;
      },
      error: (err) => {
        console.error('Error al cargar el usuario:', err);
      },
    });
  }

  private cargarXuxemons(): void {
    // Pedimos la primera página (9 por página) para calcular los KPIs con los datos
    // disponibles. Si el usuario tiene más de 9 xuxemons hacemos más peticiones.
    this.authService.obtenerXuxemons(1).subscribe({
      next: (res) => {
        if (res.message !== 'success') return;

        const paginacion = res.xuxemons;
        const items: any[] = paginacion.data ?? [];
        const totalRegistros: number = paginacion.total ?? items.length;
        const totalPaginas: number = paginacion.last_page ?? 1;

        // Acumulamos los items de la primera página
        this.procesarXuxemons(items, totalRegistros);

        // Si hay más páginas, las pedimos todas
        for (let pagina = 2; pagina <= totalPaginas; pagina++) {
          this.authService.obtenerXuxemons(pagina).subscribe({
            next: (r2) => {
              if (r2.message === 'success') {
                this.procesarXuxemons(r2.xuxemons.data ?? [], totalRegistros);
              }
            },
            error: () => {},
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar xuxemons:', err);
      },
    });
  }

  private procesarXuxemons(items: any[], totalRegistros: number): void {
    for (const x of items) {
      this.coleccion.total = totalRegistros; // El total real lo da la paginación

      if (x.sickness) this.coleccion.enfermos++;
      if (x.size === 'g') this.coleccion.evoluciones++;

      if (x.type === 'agua') this.coleccion.agua++;
      if (x.type === 'tierra') this.coleccion.tierra++;
      if (x.type === 'aire') this.coleccion.aire++;

      // El primer xuxemon sano se usa como "destacado para luchar"
      if (!this.xuxemon && !x.sickness) {
        this.xuxemon = {
          nombre: x.name,
          tipo: this.capitalizarPrimeraLetra(x.type),
          tamano: this.tamanoCastellano(x.size),
        };
      }
    }

    // Progreso de colección: total xuxemons del usuario sobre 48 posibles
    this.coleccion.progresoPct = Math.min(Math.round((this.coleccion.total / 48) * 100), 100);
  }

  private cargarMochila(): void {
    this.authService.obtenerMochila(1).subscribe({
      next: (res) => {
        if (res.message !== 'success') return;

        const objetos: any[] = res.objetos?.data ?? [];
        const totalObjetos: number = res.total ?? 0;

        this.mochila.ocupados = totalObjetos;

        // Construimos los slots visuales (máximo 20)
        this.mochilaSlots = [];

        for (const obj of objetos) {
          const cantidad = obj.stackable ? obj.amount : 1;
          for (let i = 0; i < cantidad && this.mochilaSlots.length < 20; i++) {
            this.mochilaSlots.push({
              ocupado: true,
              tipo: obj.stackable ? 'apilable' : 'no-apilable',
              emoji: this.emojiObjeto(obj.type, obj.name),
            });
          }
        }

        // Rellenamos el resto con slots vacíos hasta 20
        while (this.mochilaSlots.length < 20) {
          this.mochilaSlots.push({ ocupado: false, tipo: '', emoji: '' });
        }
      },
      error: (err) => {
        // Si la mochila está vacía el backend devuelve 404; es un estado válido
        if (err.status === 404) {
          this.mochilaSlots = Array.from({ length: 20 }, () => ({
            ocupado: false,
            tipo: '',
            emoji: '',
          }));
        } else {
          console.error('Error al cargar la mochila:', err);
        }
      },
    });
  }

  private cargarSolicitudesPendientes(): void {
    this.authService.obtenerSolicitudesPendientes().subscribe({
      next: (res) => {
        if (res.message !== 'success') return;
        this.solicitudesAmistad = (res.solicitudes ?? []).map((s: any) => ({
          id: s.id,
          nombre: s.name,
          public_id: s.public_id,
        }));
      },
      error: (err) => {
        console.error('Error al cargar solicitudes de amistad:', err);
      },
    });
  }

  private cargarAmigos(): void {
    this.authService.obtenerAmigos().subscribe({
      next: (res) => {
        if (res.message !== 'success') return;
        this.amigos = (res.amigos ?? []).map((a: any) => ({
          nombre: a.name,
          online: false, // El backend actual no expone estado online
        }));
      },
      error: (err) => {
        console.error('Error al cargar amigos:', err);
      },
    });
  }

  private cargarConfigDiaria(): void {
    // La ruta GET /config-diaria solo está disponible para el admin (id 1).
    // Para usuarios normales, se captura el error silenciosamente y se mantienen
    // los valores por defecto (--:--) ya inicializados.
    this.authService.obtenerConfigDiaria().subscribe({
      next: (res) => {
        this.recompensasDiarias.xuxes.cantidad = res.xuxes?.cantidad ?? 0;
        this.recompensasDiarias.xuxes.hora = res.xuxes?.hora ?? '--:--';
        this.recompensasDiarias.xuxemon.hora = res.xuxemons?.hora ?? '--:--';
      },
      error: () => {
        // Usuario sin permisos de admin: se mantienen los valores por defecto
      },
    });
  }

  // ── Acciones de solicitudes de amistad ────────────────────────────────────

  aceptarSolicitud(solicitud: { id: number; nombre: string }): void {
    this.authService.aceptarSolicitud(solicitud.id).subscribe({
      next: (res) => {
        // Eliminamos la solicitud de la lista y añadimos al amigo aceptado
        this.solicitudesAmistad = this.solicitudesAmistad.filter((s) => s.id !== solicitud.id);
        if (res.amigo) {
          this.amigos.unshift({ nombre: res.amigo.name, online: false });
        }
      },
      error: (err) => {
        console.error('Error al aceptar la solicitud:', err);
      },
    });
  }

  rechazarSolicitud(solicitud: { id: number }): void {
    this.authService.rechazarSolicitud(solicitud.id).subscribe({
      next: () => {
        this.solicitudesAmistad = this.solicitudesAmistad.filter((s) => s.id !== solicitud.id);
      },
      error: (err) => {
        console.error('Error al rechazar la solicitud:', err);
      },
    });
  }

  // ── Utilidades de formato ──────────────────────────────────────────────────

  private capitalizarPrimeraLetra(texto: string): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  private tamanoCastellano(size: string): string {
    const mapa: Record<string, string> = {
      s: 'Pequeño',
      m: 'Mediano',
      g: 'Grande',
    };
    return mapa[size] ?? size;
  }
}
