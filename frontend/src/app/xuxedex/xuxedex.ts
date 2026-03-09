import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ICONS } from '../shared/icons';
import { Nav } from '../shared/nav/nav';

// Modelo individual de cada criatura.
export interface Xuxemon {
  id: number;
  name: string;
  type: 'agua' | 'tierra' | 'aire';
  size: 's' | 'm' | 'g';
  sickness: string | number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

//Sirve para agrupar en la interfaz gráfica a todos los Xuxemons del mismo nombre.
export interface XuxemonGrupo {
  nombre: string;
  type: 'agua' | 'tierra' | 'aire';
  cantidad: number;
  xuxemons: Xuxemon[];
  representante: Xuxemon;
}

@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [RouterLink, Nav],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css',
})

export class Xuxedex {
  icons: Record<string, SafeHtml> = {};

  cargando = true;
  error = '';

  todosLosGrupos: XuxemonGrupo[] = [];
  grupoSeleccionado: XuxemonGrupo | null = null;

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(
    private sanitizer: DomSanitizer, // Angular bloquea por defecto el código HTML/SVG insertado dinámicamente para evitar ataques XSS
    private http: HttpClient, // Para hacer peticiones web
  ) {
    Object.keys(ICONS).forEach((key) => {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(ICONS[key]);
    });
  }

  // Controla el estado de la interfaz usando las variables cargando y error
  cargarXuxemons(): void {
    this.cargando = true;
    this.error = '';
    this.http.get<{ message: string; xuxemons: Xuxemon[] }>(`${this.API_URL}/xuxemons`).subscribe({// Hace una petición GET a la API
      next: (res) => {// Agrupa la lista de Xuxemons recibidos
        this.todosLosGrupos = this.agruparPorNombre(res.xuxemons);
        if (this.todosLosGrupos.length > 0) {
          this.grupoSeleccionado = this.todosLosGrupos[0];
        }
        this.cargando = false;
      },
      error: (err) => { // Si el servidor devuelve un error 400 (Bad Request), simplemente vacía la lista.
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
}
