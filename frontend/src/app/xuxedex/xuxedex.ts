import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ICONS } from '../shared/icons';
import { Nav } from '../shared/nav/nav';
import { Auth } from '../services/auth';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface Xuxemon {
  id: number;
  name: string;
  type: 'agua' | 'tierra' | 'aire';
  size: 's' | 'm' | 'g';
  sickness: string | number | null;
  xuxes_count: number; // Contador de xuxes consumidas (para la barra de nivel)
  user_id: number;
  created_at?: string;
}

export interface Xuxemons {
  name: string;
  type: 'agua' | 'tierra' | 'aire';
  xuxemons: Xuxemon[];
}

@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [CommonModule, Nav, ReactiveFormsModule],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css',
})
export class Xuxedex implements OnInit {
  // Datos del usuario autenticado
  usuario: any = null;

  icons: Record<string, SafeHtml> = {};
  cargando = true;
  error = '';
  xuxemons: Xuxemon[] = [];
  xuxemonSeleccionado: Xuxemon | null = null;
  paginaActual = 1;
  ultimaPagina = 1;

  // Añadimos un flag para controlar resultados de búsqueda
  sinResultados = false;

  // Panel de notificaciones
  mostrarNotificaciones = false;
  notificacionesNuevas = false;

  // Barra de level-up
  // Las xuxes necesarias para subir de nivel dependen del tamaño del Xuxemon:
  // s → 3 | m → 5 | g → ya está en el nivel máximo
  get xuxesActuales(): number {
    return this.xuxemonSeleccionado?.xuxes_count ?? 0;
  }

  get xuxesNecesarias(): number {
    return this.calcularXuxesNecesarias(this.xuxemonSeleccionado);
  }

  // Feedback de alimentación
  feedbackMensaje = '';
  feedbackTipo: 'ok' | 'error' | 'infeccion' | '' = '';
  cargandoFeed = false;

  // Modal de vacuna (se abre desde el panel derecho)
  mostrarModalVacuna = false;
  vacunasEnMochila: any[] = [];
  cargandoVacunas = false;
  errorVacunas = '';

  constructor(
    private sanitizer: DomSanitizer,
    private auth: Auth,
    private router: Router,
  ) {
    Object.keys(ICONS).forEach((key) => {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(ICONS[key]);
    });
  }

  buscador = new FormControl<string>('');

  ngOnInit(): void {
    this.cargarUsuario();
    this.listarXuxemons();
    this.comprobarNotificacionesDiarias();

    // Mejora en el buscador con tipado y manejo de vacíos
    this.buscador.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((termino) => {
        const valor = termino?.trim() || '';
        if (valor === '') {
          this.listarXuxemons();
        } else {
          this.buscarXuxemons(valor);
        }
      });
  }

  // Carga los datos del usuario autenticado desde el backend
  private cargarUsuario(): void {
    this.auth.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario ?? res;
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
      },
    });
  }

  // Comprueba si las recompensas diarias son nuevas (no vistas hoy)
  private comprobarNotificacionesDiarias(): void {
    const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const ultimaVista = localStorage.getItem('xuxemons_notif_vista');
    this.notificacionesNuevas = ultimaVista !== hoy;
  }

  // Abre o cierra el panel de notificaciones y marca como vistas
  toggleNotificaciones(): void {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
    if (this.mostrarNotificaciones && this.notificacionesNuevas) {
      const hoy = new Date().toISOString().split('T')[0];
      localStorage.setItem('xuxemons_notif_vista', hoy);
      this.notificacionesNuevas = false;
    }
  }

  cerrarNotificaciones(): void {
    this.mostrarNotificaciones = false;
  }

  // Cierra el panel si el usuario hace clic fuera de él
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.mostrarNotificaciones = false;
    this.mostrarConfirmacionAlimentar = false;
    this.mostrarModalVacuna = false;
    this.mostrarDialogoBorrar = false;
  }

  // Mostrar lista de xuxemons
  listarXuxemons(pagina: number = 1): void {
    this.cargando = true;
    this.auth.obtenerXuxemons(pagina).subscribe({
      next: (res) => {
        this.xuxemons = res.xuxemons.data;
        this.paginaActual = res.xuxemons.current_page;
        this.ultimaPagina = res.xuxemons.last_page;
        if (this.xuxemons.length > 0) this.xuxemonSeleccionado = this.xuxemons[0];
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.errors ?? 'Error al cargar los xuxemons.';
        this.cargando = false;
      },
    });
  }

  // Modal de confirmación antes de alimentar
  mostrarConfirmacionAlimentar = false;

  abrirConfirmacionAlimentar(): void {
    if (this.cargandoFeed) return;
    this.mostrarConfirmacionAlimentar = true;
  }

  cerrarConfirmacionAlimentar(): void {
    this.mostrarConfirmacionAlimentar = false;
  }

  confirmarAlimentar(): void {
    this.mostrarConfirmacionAlimentar = false;
    if (this.xuxemonSeleccionado) {
      this.alimentarXuxemon(this.xuxemonSeleccionado);
    }
  }

  // Alimentar Xuxemon
  // Llama al endpoint de alimentación y actualiza el estado local del Xuxemon.
  // Si el servidor devuelve una enfermedad nueva, activa el feedback de infección.
  alimentarXuxemon(xuxemon: Xuxemon): void {
    if (this.cargandoFeed) return;
    this.cargandoFeed = true;
    this.feedbackMensaje = '';
    this.feedbackTipo = '';

    const sicknessAntes = xuxemon.sickness;

    this.auth.alimentarXuxemon(xuxemon.id).subscribe({
      next: (res) => {
        const actualizado: Xuxemon = res.xuxemon;

        // Actualizamos el Xuxemon tanto en la lista como en la selección
        this.aplicarActualizacion(actualizado);

        // Detectamos si ha aparecido una enfermedad nueva tras alimentarle
        const seInfecto =
          !this.estaEnfermo({ ...xuxemon, sickness: sicknessAntes } as Xuxemon) &&
          this.estaEnfermo(actualizado);

        if (seInfecto) {
          this.feedbackTipo = 'infeccion';
          this.feedbackMensaje = `¡${actualizado.name} ha caído enfermo: ${this.getNombreEnfermedad(actualizado.sickness)}!`;
        } else {
          this.feedbackTipo = 'ok';
          this.feedbackMensaje = `¡${actualizado.name} ha comido una xuxe!`;
        }

        this.cargandoFeed = false;
        setTimeout(() => {
          this.feedbackMensaje = '';
          this.feedbackTipo = '';
        }, 3000);
      },
      error: (err) => {
        this.feedbackTipo = 'error';
        // Intentamos extraer el mensaje real del backend en cualquier formato que lo mande
        this.feedbackMensaje =
          err.error?.errors ??
          err.error?.message ??
          (typeof err.error === 'string' ? err.error : null) ??
          'No se ha podido alimentar al Xuxemon.';
        this.cargandoFeed = false;
        setTimeout(() => {
          this.feedbackMensaje = '';
          this.feedbackTipo = '';
        }, 3500);
      },
    });
  }

  // Subir de nivel
  // Solicita al backend que suba de nivel al Xuxemon y actualiza el size localmente.
  // NOTA: la ruta /xuxemon/subirNivel está pendiente de implementación en el backend.
  subirNivel(xuxemon: Xuxemon): void {
    this.auth.subirNivel(xuxemon.id).subscribe({
      next: (res) => {
        const actualizado: Xuxemon = res.xuxemon;
        this.aplicarActualizacion(actualizado);
        this.feedbackTipo = 'ok';
        this.feedbackMensaje = `¡${actualizado.name} ha subido de nivel!`;
        setTimeout(() => {
          this.feedbackMensaje = '';
          this.feedbackTipo = '';
        }, 3000);
      },
      error: (err) => {
        this.feedbackTipo = 'error';
        this.feedbackMensaje = err.error?.errors ?? 'No se ha podido subir de nivel.';
        setTimeout(() => {
          this.feedbackMensaje = '';
          this.feedbackTipo = '';
        }, 3500);
      },
    });
  }

  // Aplica los datos del Xuxemon actualizado tanto en la lista como en la selección
  private aplicarActualizacion(actualizado: Xuxemon): void {
    const idx = this.xuxemons.findIndex((x) => x.id === actualizado.id);
    if (idx !== -1) {
      this.xuxemons[idx] = { ...this.xuxemons[idx], ...actualizado };
    }
    if (this.xuxemonSeleccionado?.id === actualizado.id) {
      this.xuxemonSeleccionado = { ...this.xuxemonSeleccionado, ...actualizado };
    }
  }

  // Devuelve el número de xuxes necesarias para subir de nivel según el tamaño.
  // Si el Xuxemon tiene bajón de azúcar, se necesitan 2 xuxes extra (lógica del backend).
  calcularXuxesNecesarias(xuxemon: Xuxemon | null): number {
    if (!xuxemon) return 3;
    const base: Record<string, number> = { s: 3, m: 5 };
    const xuxesBase = base[xuxemon.size] ?? 0; // 0 → nivel máximo (g)
    const sickness = xuxemon.sickness ? String(xuxemon.sickness).toLowerCase().trim() : '';
    const extra =
      sickness === 'bajon de azucar' || sickness === 'bajón de azúcar' || sickness === 'bajon'
        ? 2
        : 0;
    return xuxesBase + extra;
  }

  get porcentajeNivel(): number {
    const necesarias = this.xuxesNecesarias;
    if (necesarias === 0) return 100;
    return Math.min(100, Math.round((this.xuxesActuales / necesarias) * 100));
  }

  get puedeSubirNivel(): boolean {
    return (
      !!this.xuxemonSeleccionado &&
      this.xuxemonSeleccionado.size !== 'g' &&
      this.xuxesActuales >= this.xuxesNecesarias
    );
  }

  // Filtrado de xuxemons por tipo
  sinResultadosFiltroTipo = false;
  tipoActivo = '';
  cargandoFiltro = false;

  filtrarPorTipo(type: string): void {
    if (type === '') {
      this.listarXuxemons();
      return;
    }

    this.cargando = false;
    this.tipoActivo = type;
    this.paginaActual = 1;
    this.cargandoFiltro = true;
    this.sinResultadosFiltroTipo = false;

    this.auth.getXuxemonsPorTipo(type).subscribe({
      next: (res) => {
        this.xuxemons = res.xuxemons.data;
        this.paginaActual = res.xuxemons.current_page;
        this.ultimaPagina = res.xuxemons.last_page;
        if (this.xuxemons.length === 0) {
          this.sinResultadosFiltroTipo = true;
        } else {
          this.xuxemonSeleccionado = this.xuxemons[0];
        }
        this.cargando = false;
      },
      error: () => {
        this.sinResultadosFiltroTipo = true;
        this.xuxemons = [];
        this.cargando = false;
      },
    });
  }

  // Filtrado de xuxemons por tamaño
  sinResultadosFiltroTamano = false;
  tamanoActivo = '';

  filtrarPorTamano(size: string): void {
    if (size === '') {
      this.tamanoActivo = '';
      this.listarXuxemons();
      return;
    }

    this.tamanoActivo = size;
    this.paginaActual = 1;
    this.cargandoFiltro = true;
    this.cargando = false;
    this.sinResultadosFiltroTamano = false;

    this.auth.getXuxemonsPorTamano(size).subscribe({
      next: (res) => {
        this.xuxemons = res.xuxemons.data;
        this.paginaActual = res.xuxemons.current_page;
        this.ultimaPagina = res.xuxemons.last_page;
        if (this.xuxemons.length === 0) {
          this.sinResultadosFiltroTamano = true;
        } else {
          this.xuxemonSeleccionado = this.xuxemons[0];
        }
        this.cargandoFiltro = false;
      },
      error: () => {
        this.sinResultadosFiltroTamano = true;
        this.xuxemons = [];
        this.cargandoFiltro = false;
      },
    });
  }

  // Paginación
  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.ultimaPagina) return;
    this.listarXuxemons(pagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.ultimaPagina }, (_, i) => i + 1);
  }

  // Búsqueda
  busqueda = '';

  buscarXuxemons(termino: string): void {
    this.sinResultados = false;
    this.busqueda = termino;

    if (termino.trim() === '') {
      this.xuxemons = [];
      this.listarXuxemons();
      return;
    }

    this.cargando = true;
    this.auth.navXuxemons(termino).subscribe({
      next: (res) => {
        this.xuxemons = res.xuxemons;
        this.ultimaPagina = 1;
        this.paginaActual = 1;
        if (this.xuxemons.length > 0) this.xuxemonSeleccionado = this.xuxemons[0];
        this.cargando = false;
      },
      error: () => {
        this.sinResultados = true;
        this.xuxemons = [];
        this.cargando = false;
      },
    });
  }

  // Helpers de visualización

  getImagenXuxemon(nombre: string): string {
    const slug = nombre.toLowerCase().replace(/[\s\-_]+/g, '');
    return `/animales/${slug}.png`;
  }

  getNombreTipo(type: string): string {
    const mapa: Record<string, string> = { agua: 'Agua', tierra: 'Tierra', aire: 'Aire' };
    return mapa[type] ?? type;
  }

  getNombreTamano(size: string): string {
    const mapa: Record<string, string> = { s: 'Pequeño', m: 'Mediano', g: 'Grande' };
    return mapa[size] ?? size;
  }

  // FIX: sickness puede llegar como null, '0', 0 o '' cuando el Xuxemon está sano.
  // Antes solo se filtraban '0', 0 y '', pero no null, lo que hacía que
  // el badge apareciera mostrando el texto "null".
  estaEnfermo(xuxemon: Xuxemon): boolean {
    const s = xuxemon.sickness;
    return s !== null && s !== undefined && s !== '0' && s !== 0 && s !== '';
  }

  // FIX: getNombreEnfermedad ahora acepta null además de string|number,
  // aunque con estaEnfermo corregido nunca debería llamarse con null.
  getNombreEnfermedad(sickness: string | number | null | undefined): string {
    if (
      sickness === null ||
      sickness === undefined ||
      sickness === '' ||
      sickness === '0' ||
      sickness === 0
    ) {
      return '';
    }
    const mapa: Record<string, string> = {
      bajon: 'Bajón de azúcar',
      bajón: 'Bajón de azúcar',
      'bajón de azúcar': 'Bajón de azúcar',
      'bajon de azucar': 'Bajón de azúcar',
      atracón: 'Atracón',
      atracon: 'Atracón',
      'sobredosis de azúcar': 'Sobredosis de azúcar',
      'sobredosis de azucar': 'Sobredosis de azúcar',
    };
    return mapa[String(sickness).toLowerCase().trim()] ?? String(sickness);
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '—';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  }

  estaSeleccionado(grupo: Xuxemons): boolean {
    return this.xuxemonSeleccionado?.name === grupo.name;
  }

  // Diálogo de borrado
  mostrarDialogoBorrar = false;

  abrirDialogoBorrar(): void {
    this.mostrarDialogoBorrar = true;
  }

  cerrarDialogoBorrar(): void {
    this.mostrarDialogoBorrar = false;
  }

  confirmarBorrar(): void {
    if (!this.xuxemonSeleccionado) return;

    this.auth.borrarXuxemon(this.xuxemonSeleccionado.id).subscribe({
      next: () => {
        this.xuxemons = this.xuxemons.filter((x) => x.id !== this.xuxemonSeleccionado?.id);
        this.xuxemonSeleccionado = this.xuxemons[0] ?? null;
        this.cerrarDialogoBorrar();
      },
      error: (err) => {
        console.error('Error al borrar xuxemon', err);
      },
    });
  }

  // Modal de vacuna

  // Abre el modal y carga las vacunas disponibles en la mochila del usuario.
  abrirModalVacuna(): void {
    if (!this.xuxemonSeleccionado || !this.estaEnfermo(this.xuxemonSeleccionado)) return;
    this.mostrarModalVacuna = true;
    this.cargandoVacunas = true;
    this.errorVacunas = '';
    this.vacunasEnMochila = [];

    // Cargamos todos los objetos de la mochila y filtramos los de tipo vacuna
    this.auth.obtenerMochila(1).subscribe({
      next: (res) => {
        const todos = res.objetos?.data ?? res.objetos ?? [];
        this.vacunasEnMochila = todos.filter((item: any) => item.type === 'vacuna');
        this.cargandoVacunas = false;
      },
      error: (err) => {
        this.errorVacunas = err.error?.errors ?? 'No se pudieron cargar las vacunas.';
        this.cargandoVacunas = false;
      },
    });
  }

  cerrarModalVacuna(): void {
    this.mostrarModalVacuna = false;
    this.vacunasEnMochila = [];
    this.errorVacunas = '';
  }

  // Aplica la vacuna seleccionada al Xuxemon actual.
  // Llama a POST /xuxemon/curar (ruta existente en backend).
  confirmarAplicarVacuna(vacunaId: number): void {
    if (!this.xuxemonSeleccionado) return;

    this.auth.curarXuxemon(vacunaId, this.xuxemonSeleccionado.id).subscribe({
      next: (res) => {
        // El backend devuelve el Xuxemon actualizado o simplemente éxito
        const actualizado = res.xuxemon;
        if (actualizado) {
          this.aplicarActualizacion(actualizado);
        } else {
          // Si el backend no devuelve el xuxemon, limpiamos el sickness localmente
          if (this.xuxemonSeleccionado) {
            const idx = this.xuxemons.findIndex((x) => x.id === this.xuxemonSeleccionado!.id);
            if (idx !== -1) this.xuxemons[idx] = { ...this.xuxemons[idx], sickness: null };
            this.xuxemonSeleccionado = { ...this.xuxemonSeleccionado, sickness: null };
          }
        }
        this.cerrarModalVacuna();
        this.feedbackTipo = 'ok';
        this.feedbackMensaje = `¡${this.xuxemonSeleccionado?.name ?? 'El Xuxemon'} se ha curado!`;
        setTimeout(() => {
          this.feedbackMensaje = '';
          this.feedbackTipo = '';
        }, 3000);
      },
      error: (err) => {
        this.errorVacunas = err.error?.errors ?? 'No se pudo aplicar la vacuna.';
      },
    });
  }
}
