import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

export interface Slot {
  // Representa una "casilla" física en la mochila
  indice: number;
  item: ItemMochila | null;
  cantidadEnSlot: number;
}

export interface Xuxemon {
  id: number;
  name: string;
  sickness: number;
  image?: string;
  level?: number;
}

@Component({
  selector: 'app-mochila',
  standalone: true,
  imports: [CommonModule, Nav],
  templateUrl: './mochila.html',
  styleUrl: './mochila.css',
})
export class Mochila implements OnInit {
  cargando = true;
  error = '';
  usuario: any = null;
  todosLosSlots: Slot[] = [];
  slotSeleccionado: Slot | null = null;
  totalObjetos = 0;

  readonly POR_PAGINA = 9; // 3 columnas × 3 filas
  readonly MAX_SLOTS = 20;
  readonly MAX_APILABLE = 5; // Máximo de unidades apilables por slot
  paginaActual = 1;
  ultimaPagina = 1;

  //  Modal de vacuna
  mostrarModalVacuna: boolean = false;
  xuxemonsEnfermos: Xuxemon[] = [];
  cargandoXuxemons: boolean = false;
  errorXuxemons: string = '';

  //  Diálogo de borrado
  mostrarDialogoBorrar: boolean = false;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarMochila();
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

  // Carga los objetos de la mochila desde el backend
  cargarMochila(pagina: number = 1): void {
    this.cargando = true;
    this.auth.getMochila(pagina).subscribe({
      next: (res) => {
        const items: ItemMochila[] = res.objetos.data;
        this.paginaActual = res.objetos.current_page;
        this.ultimaPagina = res.objetos.last_page;
        this.totalObjetos = items.reduce((acc, item) => acc + item.amount, 0);
        this.todosLosSlots = this.construirSlots(items);
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.errors ?? 'Error al cargar la mochila.';
        this.cargando = false;
      },
    });
  }

  // Construye el array de slots a partir de los items recibidos
  private construirSlots(items: ItemMochila[]): Slot[] {
    return items.map((item, i) => ({
      indice: i,
      item: item,
      cantidadEnSlot: item.amount,
    }));
  }

  // Paginación
  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.ultimaPagina) return;
    this.cargarMochila(pagina);
  }

  // Getter de paginas
  get paginas(): number[] {
    return Array.from({ length: this.ultimaPagina }, (_, i) => i + 1);
  }

  // Slots de la página actual
  get slotsEnPaginaActual(): Slot[] {
    return this.todosLosSlots;
  }

  // Slots usados (con item)
  get slotsUsados(): number {
    return this.todosLosSlots.filter((s) => s.item !== null).length;
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

  //  Diálogo de borrado

  abrirDialogoBorrar(): void {
    this.mostrarDialogoBorrar = true;
  }

  cerrarDialogoBorrar(): void {
    this.mostrarDialogoBorrar = false;
  }

  confirmarBorrar(): void {
    if (!this.slotSeleccionado?.item) return;

    this.auth.borrarObjeto(this.slotSeleccionado.item.id).subscribe({
      next: () => {
        const item = this.slotSeleccionado!.item!;

        // Si es apilable y tiene más de 1, restamos 1 unidad visualmente
        if (item.stackable && item.amount > 1) {
          item.amount -= 1;
          this.slotSeleccionado!.cantidadEnSlot -= 1;
          this.totalObjetos -= 1;
        } else {
          // Si no, eliminamos el slot de la lista
          this.todosLosSlots = this.todosLosSlots.filter((s) => s.item?.id !== item.id);
          this.slotSeleccionado = null;
          this.totalObjetos -= 1;
        }

        this.cerrarDialogoBorrar();
      },
      error: (err) => {
        console.error('Error al borrar objeto', err);
      },
    });
  }

  //  Modal de vacuna

  /** Abre el modal y carga los Xuxemons que están enfermos (sickness !== 0). */
  abrirModalVacuna(): void {
    this.mostrarModalVacuna = true;
    this.cargandoXuxemons = true;
    this.errorXuxemons = '';
    this.xuxemonsEnfermos = [];

    this.auth.getXuxemons().subscribe({
      next: (res) => {
        const todos: Xuxemon[] = res.xuxemons ?? res;
        this.xuxemonsEnfermos = todos.filter((x) => x.sickness !== 0);
        this.cargandoXuxemons = false;
      },
      error: (err) => {
        this.errorXuxemons = err.error?.errors ?? 'No se pudieron cargar los Xuxemons.';
        this.cargandoXuxemons = false;
      },
    });
  }

  cerrarModalVacuna(): void {
    this.mostrarModalVacuna = false;
    this.xuxemonsEnfermos = [];
    this.errorXuxemons = '';
  }

  /**
   * Aplica la vacuna al Xuxemon indicado.
   * Si tiene éxito, elimina la vacuna de la mochila reutilizando confirmarBorrar().
   */
  confirmarAplicarVacuna(xuxemonId: number): void {
    if (!this.slotSeleccionado?.item) return;

    this.auth.aplicarVacuna(this.slotSeleccionado.item.id, xuxemonId).subscribe({
      next: () => {
        this.cerrarModalVacuna();
        // Reutilizamos la lógica de borrado para descontar la vacuna de la mochila
        this.confirmarBorrar();
      },
      error: (err) => {
        console.error('Error al aplicar la vacuna', err);
        this.errorXuxemons = err.error?.errors ?? 'No se pudo aplicar la vacuna.';
      },
    });
  }
}
