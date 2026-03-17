import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Nav } from '../shared/nav/nav';
import { Auth } from '../services/auth';

export interface ItemMochila {
  id: number;
  name: string;
  type: string;
  stackable: boolean;
  amount: number;
  created_at?: string;
}

export interface Slot {// Representa una "casilla" física en la mochila
  indice: number;
  item: ItemMochila | null;
  cantidadEnSlot: number;
}

@Component({
  selector: 'app-mochila',
  standalone: true,
  imports: [RouterLink, CommonModule, Nav],
  templateUrl: './mochila.html',
  styleUrl: './mochila.css',
})
export class Mochila implements OnInit {
  cargando = true;
  error = '';
  usuario: any = null;
  todosLosSlots: Slot[] = [];
  slotSeleccionado: Slot | null = null;

  readonly POR_PAGINA = 9; // 3 columnas × 3 filas
  readonly MAX_SLOTS = 20;
  readonly MAX_APILABLE = 5; // Máximo de unidades apilables por slot
  paginaActual = 1;

  private readonly API_URL = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private auth: Auth,
  ) { }

  ngOnInit(): void {
    this.cargarUsuario();
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



  seleccionarSlot(slot: Slot): void {
    if (!slot.item) return;
    // Si se hace clic en el slot ya seleccionado, se deselecciona
    this.slotSeleccionado = this.slotSeleccionado?.indice === slot.indice ? null : slot;
  }

  // Mapea el nombre del ítem al archivo PNG de la carpeta public/chuches/
  getImagenItem(nombre: string): string {
    const mapa: Record<string, string> = {
      chocolatina: 'chuches/chocolate.png',
      'bastón de caramelo': 'chuches/navidad.png',
      inxulina: 'chuches/Vacuna.png',
      caramelux: 'chuches/caramelo.png',
      pirupiru: 'chuches/piruleta.png',
      chicleto: 'chuches/suggus.png',
      'chal de frutas': 'chuches/macedonia.png',
      azucarín: 'chuches/redondos.png',
      'xocolatina extra': 'chuches/chocolate.png',
    };
    const clave = nombre.toLowerCase().trim();
    return mapa[clave] ?? 'chuches/caramelos.png'; // fallback genérico
  }
}
