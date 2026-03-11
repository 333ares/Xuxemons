import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Nav } from '../shared/nav/nav';
import { Auth } from '../services/auth';

export interface ItemMochila {
  id: number;
  nombre: string;
  tipo: 'apilable' | 'no_apilable';
  cantidad: number;
  categoria: 'xuxe' | 'vacuna';
  emoji: string;
  efecto: string;
  fechaAdquisicion: string;
}

export interface Slot {// Representa una "casilla" física en la mochila
  indice: number;
  item: ItemMochila | null;
  cantidadEnSlot: number;
}

// ─── Cambiar a false cuando el backend esté listo ───
const MOCK = true;

const DATOS_PRUEBA: ItemMochila[] = [
  {
    id: 1,
    nombre: 'Chocolatina',
    tipo: 'no_apilable',
    cantidad: 1,
    categoria: 'vacuna',
    emoji: '🍫',
    efecto: 'Quita "Bajón de azúcar"',
    fechaAdquisicion: '15/02/2026',
  },
  {
    id: 2,
    nombre: 'Bastón de caramelo',
    tipo: 'apilable',
    cantidad: 3,
    categoria: 'xuxe',
    emoji: '🍬',
    efecto: 'Alimenta a tu Xuxemon',
    fechaAdquisicion: '16/02/2026',
  },
  {
    id: 3,
    nombre: 'Inxulina',
    tipo: 'no_apilable',
    cantidad: 1,
    categoria: 'vacuna',
    emoji: '💉',
    efecto: 'Cura todas las enfermedades',
    fechaAdquisicion: '17/02/2026',
  },
  {
    id: 4,
    nombre: 'Caramelux',
    tipo: 'apilable',
    cantidad: 5,
    categoria: 'xuxe',
    emoji: '🍭',
    efecto: 'Alimenta a tu Xuxemon',
    fechaAdquisicion: '18/02/2026',
  },
  {
    id: 5,
    nombre: 'PiruPiru',
    tipo: 'apilable',
    cantidad: 1,
    categoria: 'xuxe',
    emoji: '🍡',
    efecto: 'Alimenta a tu Xuxemon',
    fechaAdquisicion: '19/02/2026',
  },
  {
    id: 6,
    nombre: 'Chocolatina',
    tipo: 'no_apilable',
    cantidad: 1,
    categoria: 'vacuna',
    emoji: '🍫',
    efecto: 'Quita "Bajón de azúcar"',
    fechaAdquisicion: '20/02/2026',
  },
  {
    id: 7,
    nombre: 'Chicleto',
    tipo: 'apilable',
    cantidad: 2,
    categoria: 'xuxe',
    emoji: '🍬',
    efecto: 'Alimenta a tu Xuxemon',
    fechaAdquisicion: '21/02/2026',
  },
  {
    id: 8,
    nombre: 'Chal de frutas',
    tipo: 'no_apilable',
    cantidad: 1,
    categoria: 'vacuna',
    emoji: '🍇',
    efecto: 'Quita "Atracón"',
    fechaAdquisicion: '22/02/2026',
  },
  {
    id: 9,
    nombre: 'Azucarín',
    tipo: 'apilable',
    cantidad: 3,
    categoria: 'xuxe',
    emoji: '🍮',
    efecto: 'Alimenta a tu Xuxemon',
    fechaAdquisicion: '23/02/2026',
  },
  {
    id: 10,
    nombre: 'Xocolatina extra',
    tipo: 'no_apilable',
    cantidad: 1,
    categoria: 'vacuna',
    emoji: '🍫',
    efecto: 'Quita "Bajón de azúcar"',
    fechaAdquisicion: '24/02/2026',
  },
];

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
  ) {}

  ngOnInit(): void {
    this.cargarMochila();
  }

  cargarMochila(): void {
    this.cargando = true;
    this.error = '';

    if (MOCK) {
      // Simula un pequeño delay como si fuera la API
      setTimeout(() => {
        this.todosLosSlots = this.calcularSlots(DATOS_PRUEBA);
        this.cargando = false;
      }, 600);
      return;
    }

    const headers = { Authorization: `Bearer ${this.auth.getToken()}` };
    this.http
      .get<{ message: string; objetos: ItemMochila[] }>(`${this.API_URL}/mochila`, { headers })
      .subscribe({
        next: (res) => {
          this.todosLosSlots = this.calcularSlots(res.objetos);
          this.cargando = false;
        },
        error: (err) => {
          if (err.status === 404) {
            // El backend devuelve 404 cuando la mochila está vacía
            this.todosLosSlots = this.calcularSlots([]);
          } else {
            this.error = 'No se ha podido cargar la mochila.';
          }
          this.cargando = false;
        },
      });
  }

  private calcularSlots(items: ItemMochila[]): Slot[] {
    const slots: Slot[] = [];

    for (const item of items) {
      if (item.tipo === 'apilable') {
        let restante = item.cantidad;
        while (restante > 0 && slots.length < this.MAX_SLOTS) {
          const enEsteSlot = Math.min(restante, this.MAX_APILABLE);
          slots.push({ indice: slots.length, item: { ...item }, cantidadEnSlot: enEsteSlot });
          restante -= enEsteSlot;
        }
      } else {
        // Los no apilables ocupan un slot por unidad
        for (let i = 0; i < item.cantidad && slots.length < this.MAX_SLOTS; i++) {
          slots.push({ indice: slots.length, item: { ...item }, cantidadEnSlot: 1 });
        }
      }
    }

    // Rellenar con slots vacíos hasta llegar a 20
    while (slots.length < this.MAX_SLOTS) {
      slots.push({ indice: slots.length, item: null, cantidadEnSlot: 0 });
    }

    return slots;
  }

  seleccionarSlot(slot: Slot): void {
    if (!slot.item) return;
    // Si se hace clic en el slot ya seleccionado, se deselecciona
    this.slotSeleccionado = this.slotSeleccionado?.indice === slot.indice ? null : slot;
  }

  eliminarSeleccionado(): void {
    if (!this.slotSeleccionado) return;
    const idx = this.slotSeleccionado.indice;

    // TODO: conectar con DELETE /api/mochila/{id} cuando el backend esté listo
    this.todosLosSlots[idx] = { indice: idx, item: null, cantidadEnSlot: 0 };
    this.todosLosSlots = [...this.todosLosSlots]; // Fuerza la detección de cambios de Angular
    this.slotSeleccionado = null;
  }

  // Paginación

  get slotsEnPaginaActual(): Slot[] {
    // Recorta la lista según la página actual para mostrar solo 9 slots a la vez
    const inicio = (this.paginaActual - 1) * this.POR_PAGINA;
    return this.todosLosSlots.slice(inicio, inicio + this.POR_PAGINA);
  }

  get totalPaginas(): number {
    return Math.ceil(this.MAX_SLOTS / this.POR_PAGINA);
  }

  get paginas(): number[] {
    // Genera el array [1, 2, 3] para dibujar los botones de paginación en el HTML
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }

  // Helpers de presentación

  get slotsUsados(): number {
    return this.todosLosSlots.filter((s) => s.item !== null).length;
  }

  getNombreTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      apilable: 'Apilable · máx. 5/slot',
      no_apilable: 'No apilable',
    };
    return mapa[tipo] ?? tipo;
  }

  getNombreCategoria(categoria: string): string {
    const mapa: Record<string, string> = {
      xuxe: 'Xuxe',
      vacuna: 'Vacuna',
    };
    return mapa[categoria] ?? categoria;
  }
}
