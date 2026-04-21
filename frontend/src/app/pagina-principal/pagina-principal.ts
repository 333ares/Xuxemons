import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Nav } from '../shared/nav/nav';

// Tipado interno para solicitudes de amistad
interface SolicitudAmistad {
  id: number;
  nombre: string;
  public_id: string;
}

// Tipado interno para solicitudes de batalla
interface SolicitudBatalla {
  id: number;
  nombre: string;
  public_id: string;
}

// Tipado interno para amigos — incluye user_id para poder retar desde aquí
interface Amigo {
  id: number; // id de la friendship (para eliminar)
  user_id: number; // id real del usuario (para retar)
  nombre: string;
  public_id: string;
  online: boolean; // el backend actual no lo expone; siempre false
}

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterLink, Nav],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.css'],
})
export class PaginaPrincipal implements OnInit {
  // Datos del usuario autenticado
  usuario: any = null;

  // Fecha formateada en castellano
  fechaHoy: string = '';

  // KPIs de colección (calculados a partir de GET /xuxemons)
  coleccion = {
    total: 0,
    enfermos: 0,
    evoluciones: 0,
    agua: 0,
    tierra: 0,
    aire: 0,
    progresoPct: 0,
  };

  // Estadísticas de batalla (pendiente de endpoint; valores a 0)
  estadisticas = {
    ganadas: 0,
    jugadas: 0,
    racha: 0,
  };

  // Recompensas diarias (solo admin; usuarios normales ven '--:--')
  recompensasDiarias = {
    xuxes: { cantidad: 0, hora: '--:--' },
    xuxemon: { hora: '--:--' },
  };

  // Solicitudes de amistad pendientes
  solicitudesAmistad: SolicitudAmistad[] = [];

  // Peticiones de batalla recibidas y pendientes
  solicitudesBatalla: SolicitudBatalla[] = [];

  // Xuxemon destacado (primer xuxemon sano del usuario)
  xuxemon: { nombre: string; tipo: string; tamano: string } | null = null;

  // Mochila
  mochila = { ocupados: 0, total: 20 };
  mochilaSlots: { ocupado: boolean; tipo: string; emoji: string }[] = [];

  // Lista de amigos
  amigos: Amigo[] = [];

  // Estado de carga
  cargando = true;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.calcularFechaHoy();
    this.cargarUsuario();
    this.cargarXuxemons();
    this.cargarMochila();
    this.cargarSolicitudesAmistad();
    this.cargarSolicitudesBatalla();
    this.cargarAmigos();
    this.cargarConfigDiaria();
  }

  // Helpers

  private calcularFechaHoy(): void {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private emojiObjeto(tipo: string, nombre: string): string {
    if (tipo === 'vacuna') return '💉';
    const mapaXuxe: Record<string, string> = {
      xocolatina: '🍫',
      piruleta: '🍭',
      gominola: '🍬',
      caramel: '🍡',
    };
    return mapaXuxe[nombre] ?? '🍬';
  }

  // Carga de datos

  private cargarUsuario(): void {
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario ?? res;
      },
      error: (err) => console.error('Error al cargar el usuario:', err),
    });
  }

  private cargarXuxemons(): void {
    this.authService.obtenerXuxemons(1).subscribe({
      next: (res) => {
        if (res.message !== 'success') return;

        const paginacion = res.xuxemons;
        const items: any[] = paginacion.data ?? [];
        const totalRegistros: number = paginacion.total ?? items.length;
        const totalPaginas: number = paginacion.last_page ?? 1;

        this.procesarXuxemons(items, totalRegistros);

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
      error: (err) => console.error('Error al cargar xuxemons:', err),
    });
  }

  private procesarXuxemons(items: any[], totalRegistros: number): void {
    for (const x of items) {
      this.coleccion.total = totalRegistros;

      if (x.sickness) this.coleccion.enfermos++;
      if (x.size === 'g') this.coleccion.evoluciones++;
      if (x.type === 'agua') this.coleccion.agua++;
      if (x.type === 'tierra') this.coleccion.tierra++;
      if (x.type === 'aire') this.coleccion.aire++;

      if (!this.xuxemon && !x.sickness) {
        this.xuxemon = {
          nombre: x.name,
          tipo: this.capitalizarPrimeraLetra(x.type),
          tamano: this.tamanoCastellano(x.size),
        };
      }
    }

    this.coleccion.progresoPct = Math.min(Math.round((this.coleccion.total / 48) * 100), 100);
  }

  private cargarMochila(): void {
    this.authService.obtenerMochila(1).subscribe({
      next: (res) => {
        if (res.message !== 'success') return;

        const objetos: any[] = res.objetos?.data ?? [];
        const totalObjetos: number = res.total ?? 0;

        this.mochila.ocupados = totalObjetos;
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

        while (this.mochilaSlots.length < 20) {
          this.mochilaSlots.push({ ocupado: false, tipo: '', emoji: '' });
        }
      },
      error: (err) => {
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

  private cargarSolicitudesAmistad(): void {
    this.authService.obtenerSolicitudesPendientes().subscribe({
      next: (res) => {
        if (res.message !== 'success') return;
        this.solicitudesAmistad = (res.solicitudes ?? []).map((s: any) => ({
          id: s.id,
          nombre: s.name,
          public_id: s.public_id,
        }));
      },
      error: (err) => console.error('Error al cargar solicitudes de amistad:', err),
    });
  }

  private cargarSolicitudesBatalla(): void {
    this.authService.obtenerRetosBatalla().subscribe({
      next: (res) => {
        if (res.message !== 'success') return;
        this.solicitudesBatalla = (res.retos ?? []).map((r: any) => ({
          id: r.id,
          nombre: r.nombre,
          public_id: r.public_id,
        }));
      },
      error: () => {
        // Si el endpoint aún no existe o falla, se muestra vacío silenciosamente
        this.solicitudesBatalla = [];
      },
    });
  }

  private cargarAmigos(): void {
    this.authService.obtenerAmigos().subscribe({
      next: (res) => {
        if (res.message !== 'success') return;
        this.amigos = (res.amigos ?? []).map((a: any) => ({
          id: a.id,
          user_id: a.user_id,
          nombre: a.name,
          public_id: a.public_id,
          online: false,
        }));
      },
      error: (err) => console.error('Error al cargar amigos:', err),
    });
  }

  private cargarConfigDiaria(): void {
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

  // Acciones de solicitudes de amistad

  aceptarSolicitud(solicitud: SolicitudAmistad): void {
    this.authService.aceptarSolicitud(solicitud.id).subscribe({
      next: (res) => {
        this.solicitudesAmistad = this.solicitudesAmistad.filter((s) => s.id !== solicitud.id);
        if (res.amigo) {
          this.amigos.unshift({
            id: res.amigo.id,
            user_id: res.amigo.id,
            nombre: res.amigo.name,
            public_id: res.amigo.public_id,
            online: false,
          });
        }
      },
      error: (err) => console.error('Error al aceptar la solicitud:', err),
    });
  }

  rechazarSolicitud(solicitud: SolicitudAmistad): void {
    this.authService.rechazarSolicitud(solicitud.id).subscribe({
      next: () => {
        this.solicitudesAmistad = this.solicitudesAmistad.filter((s) => s.id !== solicitud.id);
      },
      error: (err) => console.error('Error al rechazar la solicitud:', err),
    });
  }

  // Acciones de solicitudes de batalla

  aceptarBatalla(reto: SolicitudBatalla): void {
    this.authService.aceptarRetoBatalla(reto.id).subscribe({
      next: () => {
        this.solicitudesBatalla = this.solicitudesBatalla.filter((r) => r.id !== reto.id);
        // TODO: redirigir a la pantalla de batalla cuando esté implementada
      },
      error: (err) => console.error('Error al aceptar el reto:', err),
    });
  }

  rechazarBatalla(reto: SolicitudBatalla): void {
    this.authService.rechazarRetoBatalla(reto.id).subscribe({
      next: () => {
        this.solicitudesBatalla = this.solicitudesBatalla.filter((r) => r.id !== reto.id);
      },
      error: (err) => console.error('Error al rechazar el reto:', err),
    });
  }

  // Utilidades de formato

  private capitalizarPrimeraLetra(texto: string): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  private tamanoCastellano(size: string): string {
    const mapa: Record<string, string> = { s: 'Pequeño', m: 'Mediano', g: 'Grande' };
    return mapa[size] ?? size;
  }
}
