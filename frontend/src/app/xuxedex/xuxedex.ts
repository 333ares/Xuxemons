import { Component, OnInit } from '@angular/core';
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
  sickness: string | number;
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

    this.buscador.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((termino) => {
      const valor = termino as string;
      if (!valor || valor.trim() === '') {
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
        // El backend devuelve el usuario dentro de res.usuario o directamente en res
        this.usuario = res.usuario ?? res;
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
      },
    });
  }

  // Mostrar lista de xuxemons
  listarXuxemons(pagina: number = 1): void {
    this.cargando = true;
    this.auth.getXuxemons(pagina).subscribe({
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
      }
    });
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
      error: (err) => {
        this.sinResultadosFiltroTipo = true;
        this.xuxemons = [];
        this.cargando = false;
      }
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
      error: (err) => {
        this.sinResultadosFiltroTamano = true;
        this.xuxemons = [];
        this.cargandoFiltro = false;
      }
    });
  }


  // Paginación de datos
  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.ultimaPagina) return;
    this.listarXuxemons(pagina);
  }

  // Getter de paginas
  get paginas(): number[] {
    return Array.from({ length: this.ultimaPagina }, (_, i) => i + 1);
  }

  // Navgeador de xuxemons
  busqueda = '';
  sinResultados = false;

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
      error: (err) => {
        this.sinResultados = true;
        this.xuxemons = [];  // limpia la lista anterior
        this.cargando = false;
      }
    });
  }

  // Convierte el nombre del xuxemon al nombre del archivo PNG
  getImagenXuxemon(nombre: string): string {
    // Coge el nombre, lo pasa a minúsculas y usa una expresión regular (/[\s\-_]+/g) para quitar espacios, guiones bajos o normales.
    const slug = nombre.toLowerCase().replace(/[\s\-_]+/g, '');
    return `/animales/${slug}.png`;
  }

  getNombreTipo(type: string): string {
    // Usan diccionarios (Record<string, string>) para cambiar un valor como 's' por 'Xuxemon Pequeño'
    const mapa: Record<string, string> = {
      agua: 'Agua',
      tierra: 'Tierra',
      aire: 'Aire',
    };
    return mapa[type] ?? type;
  }

  getNombreTamano(size: string): string {
    const mapa: Record<string, string> = {
      s: 'Pequeño',
      m: 'Mediano',
      l: 'Grande',
    };
    return mapa[size] ?? size;
  }

  estaEnfermo(xuxemon: Xuxemon): boolean {
    // Evalúa si el Xuxemon tiene alguna enfermedad comprobando que no sea cero ni esté vacío.
    return xuxemon.sickness !== '0' && xuxemon.sickness !== 0 && xuxemon.sickness !== '';
  }

  getNombreEnfermedad(sickness: string | number): string {
    // Normaliza los nombres de las enfermedades.
    const mapa: Record<string, string> = {
      bajon: 'Bajón de azúcar',
      bajón: 'Bajón de azúcar',
      'bajón de azúcar': 'Bajón de azúcar',
      'bajon de azucar': 'Bajón de azúcar',
      atracón: 'Atracón',
      atracon: 'Atracón',
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
    // La función estaSeleccionado simplemente devuelve true o false para saber si debe aplicarle un estilo de "activo/resaltado" en el HTML.
    return this.xuxemonSeleccionado?.name === grupo.name;
  }

  mostrarDialogoBorrar: boolean = false;

  abrirDialogoBorrar() {
    this.mostrarDialogoBorrar = true;
  }

  cerrarDialogoBorrar() {
    this.mostrarDialogoBorrar = false;
  }

  confirmarBorrar() {
    if (!this.xuxemonSeleccionado) return;

    this.auth.borrarXuxemon(this.xuxemonSeleccionado.id).subscribe({
      next: () => {
        // quitarlo de la lista
        this.xuxemons = this.xuxemons.filter(
          x => x.id !== this.xuxemonSeleccionado?.id
        );

        this.xuxemonSeleccionado = this.xuxemons[0] ?? null;
        this.cerrarDialogoBorrar();
      },
      error: (err) => {
        console.error('Error al borrar xuxemon', err);
      }
    });
  }
}