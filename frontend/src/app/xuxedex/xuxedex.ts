import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICONS } from '../shared/icons';
import { Nav } from '../shared/nav/nav';
import { Auth } from '../services/auth';

export interface Xuxemon {
  id: number;
  name: string;
  type: 'agua' | 'tierra' | 'aire';
  size: 's' | 'm' | 'g';
  sickness: string | number | null;
  xuxes_count: number;
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
  imports: [CommonModule, FormsModule, Nav],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css',
})
export class Xuxedex implements OnInit {
  // Datos del usuario autenticado
  usuario: any = null;

  icons: Record<string, SafeHtml> = {};
  cargando = true;
  error = '';

  // Lista paginada que se muestra en la UI
  xuxemons: Xuxemon[] = [];

  // Lista completa cargada una sola vez para el filtrado local
  todosLosXuxemons: Xuxemon[] = [];

  xuxemonSeleccionado: Xuxemon | null = null;
  paginaActual = 1;
  ultimaPagina = 1;

  // Búsqueda local — sin llamadas extra al backend
  terminoBusqueda: string = '';
  sinResultados = false;

  // Panel de notificaciones
  mostrarNotificaciones = false;
  notificacionesNuevas = false;

  // Configuración de crecimiento cargada desde el backend.
  // Los valores por defecto (s=3, m=5) se usan mientras llega la respuesta
  // o si el backend falla. Una vez cargados, la barra de progreso y el botón
  // "Subir nivel" reflejan automáticamente lo que el admin haya configurado.
  growthConfig: { s: number; m: number } = { s: 3, m: 5 };

  // Barra de level-up
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

  // Modal de vacuna
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

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarConfigCrecimiento(); // Carga los umbrales de nivel desde el backend
    this.listarXuxemons();
    this.cargarTodosLosXuxemons();
    this.comprobarNotificacionesDiarias();
  }

  // --- CARGA DE DATOS ---

  private cargarUsuario(): void {
    this.auth.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario ?? res;
      },
      error: (err) => console.error('Error al cargar los datos del usuario:', err),
    });
  }

  // Carga desde el backend las xuxes necesarias para subir de nivel.
  // Si la petición falla se mantienen los valores por defecto (s=3, m=5)
  // para que la UI nunca quede rota.
  private cargarConfigCrecimiento(): void {
    this.auth.obtenerConfigCrecimiento().subscribe({
      next: (res) => {
        const cfg = res.config;
        if (cfg) {
          this.growthConfig = {
            s: cfg.xuxes_s_a_m ?? 3,
            m: cfg.xuxes_m_a_g ?? 5,
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar la configuración de crecimiento:', err);
        // Se mantienen los valores por defecto definidos en la propiedad
      },
    });
  }

  // Carga todos los xuxemons del usuario sin paginación para el buscador local
  private cargarTodosLosXuxemons(): void {
    this.auth.obtenerTodosXuxemons().subscribe({
      next: (res) => {
        this.todosLosXuxemons = res.xuxemons ?? [];
      },
      error: () => {
        this.todosLosXuxemons = [];
      },
    });
  }

  // --- BÚSQUEDA LOCAL ---

  // Se llama desde (input) en el HTML — filtra sin ninguna llamada al backend
  onBuscar(valor: string): void {
    this.terminoBusqueda = valor;
    const termino = valor.trim().toLowerCase();

    if (termino === '') {
      // Al borrar la búsqueda, volvemos a la lista paginada normal
      this.sinResultados = false;
      this.listarXuxemons();
      return;
    }

    const filtrados = this.todosLosXuxemons.filter((x) => x.name.toLowerCase().includes(termino));

    if (filtrados.length === 0) {
      this.sinResultados = true;
      this.xuxemons = [];
      this.xuxemonSeleccionado = null;
    } else {
      this.sinResultados = false;
      this.xuxemons = filtrados;
      this.ultimaPagina = 1;
      this.paginaActual = 1;
      this.xuxemonSeleccionado = filtrados[0];
    }
  }

  // Limpia la búsqueda y vuelve al listado normal
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.sinResultados = false;
    this.listarXuxemons();
  }

  // --- LISTADO Y PAGINACIÓN ---

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

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.ultimaPagina) return;
    this.listarXuxemons(pagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.ultimaPagina }, (_, i) => i + 1);
  }

  // --- FILTROS POR TIPO Y TAMAÑO (siguen llamando al backend) ---

  sinResultadosFiltroTipo = false;
  tipoActivo = '';
  cargandoFiltro = false;

  filtrarPorTipo(type: string): void {
    if (type === '') {
      this.tipoActivo = '';
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
        this.cargandoFiltro = false;
      },
      error: () => {
        this.sinResultadosFiltroTipo = true;
        this.xuxemons = [];
        this.cargandoFiltro = false;
      },
    });
  }

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

  // --- NOTIFICACIONES ---

  private comprobarNotificacionesDiarias(): void {
    const hoy = new Date().toISOString().split('T')[0];
    const ultimaVista = localStorage.getItem('xuxemons_notif_vista');
    this.notificacionesNuevas = ultimaVista !== hoy;
  }

  toggleNotificaciones(): void {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
    if (this.mostrarNotificaciones) {
      const hoy = new Date().toISOString().split('T')[0];
      localStorage.setItem('xuxemons_notif_vista', hoy);
      this.notificacionesNuevas = false;
    }
  }

  cerrarNotificaciones(): void {
    this.mostrarNotificaciones = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.mostrarNotificaciones = false;
  }

  // --- ALIMENTAR ---

  mostrarConfirmacionAlimentar = false;

  abrirConfirmacionAlimentar(): void {
    if (this.xuxemonSeleccionado) {
      this.mostrarConfirmacionAlimentar = true;
    }
  }

  cerrarConfirmacionAlimentar(): void {
    this.mostrarConfirmacionAlimentar = false;
  }

  confirmarAlimentar(): void {
    this.cerrarConfirmacionAlimentar();
    if (this.xuxemonSeleccionado) {
      this.alimentarXuxemon(this.xuxemonSeleccionado);
    }
  }

  alimentarXuxemon(xuxemon: Xuxemon): void {
    if (this.cargandoFeed) return;
    this.cargandoFeed = true;
    this.feedbackMensaje = '';
    this.feedbackTipo = '';

    const sicknessAntes = xuxemon.sickness;

    this.auth.alimentarXuxemon(xuxemon.id).subscribe({
      next: (res) => {
        const actualizado: Xuxemon = res.xuxemon;
        this.aplicarActualizacion(actualizado);

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

  // --- SUBIR NIVEL ---

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

  // --- BORRAR ---

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
        const idBorrado = this.xuxemonSeleccionado!.id;
        this.xuxemons = this.xuxemons.filter((x) => x.id !== idBorrado);
        this.todosLosXuxemons = this.todosLosXuxemons.filter((x) => x.id !== idBorrado);
        this.xuxemonSeleccionado = this.xuxemons[0] ?? null;
        this.cerrarDialogoBorrar();
      },
      error: (err) => console.error('Error al borrar xuxemon', err),
    });
  }

  // --- VACUNAS ---

  abrirModalVacuna(): void {
    if (!this.xuxemonSeleccionado || !this.estaEnfermo(this.xuxemonSeleccionado)) return;
    this.mostrarModalVacuna = true;
    this.cargandoVacunas = true;
    this.errorVacunas = '';
    this.vacunasEnMochila = [];

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

  confirmarAplicarVacuna(vacunaId: number): void {
    if (!this.xuxemonSeleccionado) return;

    this.auth.curarXuxemon(vacunaId, this.xuxemonSeleccionado.id).subscribe({
      next: (res) => {
        const actualizado = res.xuxemon;
        if (actualizado) {
          this.aplicarActualizacion(actualizado);
        } else {
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

  // --- HELPERS ---

  private aplicarActualizacion(actualizado: Xuxemon): void {
    const idx = this.xuxemons.findIndex((x) => x.id === actualizado.id);
    if (idx !== -1) this.xuxemons[idx] = { ...this.xuxemons[idx], ...actualizado };

    const idx2 = this.todosLosXuxemons.findIndex((x) => x.id === actualizado.id);
    if (idx2 !== -1)
      this.todosLosXuxemons[idx2] = { ...this.todosLosXuxemons[idx2], ...actualizado };

    if (this.xuxemonSeleccionado?.id === actualizado.id) {
      this.xuxemonSeleccionado = { ...this.xuxemonSeleccionado, ...actualizado };
    }
  }

  // Calcula las xuxes necesarias para subir de nivel usando la config
  // cargada desde el backend. Si el xuxemon tiene bajón de azúcar se añaden
  // 2 xuxes extra, igual que en el backend (XuxemonsController.php).
  calcularXuxesNecesarias(xuxemon: Xuxemon | null): number {
    if (!xuxemon) return this.growthConfig.s;
    const xuxesBase = this.growthConfig[xuxemon.size as 's' | 'm'] ?? 0;
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

  estaEnfermo(xuxemon: Xuxemon): boolean {
    const s = xuxemon.sickness;
    return s !== null && s !== undefined && s !== '0' && s !== 0 && s !== '';
  }

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
}
