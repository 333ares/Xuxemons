import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ICONS } from '../shared/icons';
import { Nav } from '../shared/nav/nav';

export interface Xuxemon {
  id: number;
  name: string;
  type: 'agua' | 'tierra' | 'aire';
  size: 's' | 'm' | 'g';
  sickness: string | number;
  user_id: number;
  created_at?: string;
}

export interface XuxemonGrupo {
  nombre: string;
  type: 'agua' | 'tierra' | 'aire';
  cantidad: number;
  xuxemons: Xuxemon[];
  representante: Xuxemon;
}

// ─── Cambiar a false cuando el backend esté listo ───
const MOCK = true;

const DATOS_PRUEBA: Xuxemon[] = [
  {
    id: 1,
    name: 'boohoot',
    type: 'aire',
    size: 'm',
    sickness: 'bajón de azúcar',
    user_id: 1,
    created_at: '2026-02-15',
  },
  {
    id: 2,
    name: 'elgominas',
    type: 'tierra',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-16',
  },
  {
    id: 3,
    name: 'avecrem',
    type: 'aire',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-17',
  },
  {
    id: 4,
    name: 'flipper',
    type: 'agua',
    size: 'g',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-18',
  },
  {
    id: 5,
    name: 'flipper',
    type: 'agua',
    size: 'm',
    sickness: 'atracón',
    user_id: 1,
    created_at: '2026-02-19',
  },
  {
    id: 6,
    name: 'flipper',
    type: 'agua',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-20',
  },
  {
    id: 7,
    name: 'rajoy',
    type: 'aire',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-21',
  },
  {
    id: 8,
    name: 'mocha',
    type: 'agua',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-22',
  },
  {
    id: 9,
    name: 'sesssi',
    type: 'tierra',
    size: 'm',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-23',
  },
  {
    id: 10,
    name: 'sesssi',
    type: 'tierra',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-24',
  },
  {
    id: 11,
    name: 'shelly',
    type: 'tierra',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-25',
  },
  {
    id: 12,
    name: 'horseluis',
    type: 'tierra',
    size: 'g',
    sickness: 'bajón de azúcar',
    user_id: 1,
    created_at: '2026-02-26',
  },
  {
    id: 13,
    name: 'horseluis',
    type: 'agua',
    size: 'm',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-27',
  },
  {
    id: 14,
    name: 'horseluis',
    type: 'tierra',
    size: 's',
    sickness: '0',
    user_id: 1,
    created_at: '2026-02-28',
  },
];

@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [RouterLink, CommonModule, Nav],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css',
})
export class Xuxedex implements OnInit {
  icons: Record<string, SafeHtml> = {};

  cargando = true;
  error = '';
  todosLosGrupos: XuxemonGrupo[] = [];
  grupoSeleccionado: XuxemonGrupo | null = null;

  readonly POR_PAGINA = 9;
  paginaActual = 1;

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {
    Object.keys(ICONS).forEach((key) => {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(ICONS[key]);
    });
  }

  ngOnInit(): void {
    this.cargarXuxemons();
  }

  cargarXuxemons(): void {
    this.cargando = true;
    this.error = '';

    if (MOCK) {
      // Simula un pequeño delay como si fuera la API
      setTimeout(() => {
        this.todosLosGrupos = this.agruparPorNombre(DATOS_PRUEBA);
        this.grupoSeleccionado = this.todosLosGrupos[0] ?? null;
        this.cargando = false;
      }, 600);
      return;
    }

    this.http.get<{ message: string; xuxemons: Xuxemon[] }>(`${this.API_URL}/xuxemons`).subscribe({
      next: (res) => {
        this.todosLosGrupos = this.agruparPorNombre(res.xuxemons);
        if (this.todosLosGrupos.length > 0) {
          this.grupoSeleccionado = this.todosLosGrupos[0];
        }
        this.cargando = false;
      },
      error: (err) => {
        if (err.status === 400) {
          this.todosLosGrupos = [];
        } else {
          this.error = "No s'han pogut carregar els Xuxemons.";
        }
        this.cargando = false;
      },
    });
  }

  private agruparPorNombre(lista: Xuxemon[]): XuxemonGrupo[] {
    const mapa = new Map<string, Xuxemon[]>();
    lista.forEach((x) => {
      const existentes = mapa.get(x.name) ?? [];
      existentes.push(x);
      mapa.set(x.name, existentes);
    });
    return Array.from(mapa.entries()).map(([nombre, xuxemons]) => ({
      nombre,
      type: xuxemons[0].type,
      cantidad: xuxemons.length,
      xuxemons,
      representante: xuxemons[0],
    }));
  }

  seleccionarGrupo(grupo: XuxemonGrupo): void {
    //Controlan el estado de la interfaz. Cuando el usuario hace clic en un grupo, seleccionarGrupo lo guarda en la variable grupoSeleccionado.
    this.grupoSeleccionado = grupo;
  }

  // Convierte el nombre del xuxemon al nombre del archivo PNG
  getImagenXuxemon(nombre: string): string {
    // Coge el nombre, lo pasa a minúsculas y usa una expresión regular (/[\s\-_]+/g) para quitar espacios, guiones bajos o normales.
    const slug = nombre.toLowerCase().replace(/[\s\-_]+/g, '');
    return `/animales/${slug}.png`;
  }

  get gruposPaginaActual(): XuxemonGrupo[] {
    // En lugar de mostrar todos los grupos a la vez, recorta la lista (slice) basándose en la página actual y la cantidad por página (POR_PAGINA).
    const inicio = (this.paginaActual - 1) * this.POR_PAGINA;
    return this.todosLosGrupos.slice(inicio, inicio + this.POR_PAGINA);
  }

  get totalPaginas(): number {
    // Calcula cuántas páginas hay en total dividiendo los grupos entre la cantidad por página y redondeando hacia arriba (Math.ceil).
    return Math.ceil(this.todosLosGrupos.length / this.POR_PAGINA);
  }

  get paginas(): number[] {
    // Crea un array de números (ej. [1, 2, 3]) para poder dibujar los botones de las páginas en el HTML con un @for.
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(pagina: number): void {
    // Cambia la página actual, pero antes se asegura de que no intentes ir a una página que no existe (menor que 1 o mayor que el total).
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }

  getNombreTipo(type: string): string {
    // Usan diccionarios (Record<string, string>) para cambiar un valor como 's' por 'Xuxemon Pequeño'
    const mapa: Record<string, string> = {
      agua: 'Tipo Agua',
      tierra: 'Tipo Tierra',
      aire: 'Tipo Aire',
    };
    return mapa[type] ?? type;
  }

  getNombreTamano(size: string): string {
    const mapa: Record<string, string> = {
      s: 'Xuxemon Pequeño',
      m: 'Xuxemon Mediano',
      g: 'Xuxemon Grande',
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

  estaSeleccionado(grupo: XuxemonGrupo): boolean {
    // La función estaSeleccionado simplemente devuelve true o false para saber si debe aplicarle un estilo de "activo/resaltado" en el HTML.
    return this.grupoSeleccionado?.nombre === grupo.nombre;
  }
}
