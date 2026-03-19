import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-agregar-objeto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-objeto.html',
  styleUrls: ['./agregar-objeto.css'],
})
export class AgregarObjeto implements OnInit {
  constructor(private auth: Auth) { }

  @Input() usuario: any = null;
  @Output() cerrar = new EventEmitter<void>();

  // Tipo de objeto: 'xuxe' (apilable) | 'vacuna' (no apilable)
  tipoSeleccionado: 'xuxe' | 'vacuna' = 'xuxe';

  // Listas de objetos disponibles según tipo
  xuxesDisponibles = ['Caramelo', 'Piruleta', 'Gominola'];
  vacunasDisponibles = ['Xocolatina', 'Xal de fruites', 'Inxulina'];

  nombreSeleccionado: string = '';
  cantidad: number = 1;

  // Buscador interno para escalar si la lista crece
  terminoBusquedaObjeto: string = '';

  cargando: boolean = false;
  mensaje: string = '';
  mensajeTipo: 'exito' | 'error' | '' = '';

  ngOnInit(): void { }

  get objetosDisponibles(): string[] {
    const lista =
      this.tipoSeleccionado === 'vacuna' ? this.vacunasDisponibles : this.xuxesDisponibles;

    if (!this.terminoBusquedaObjeto.trim()) return lista;
    return lista.filter((o) => o.toLowerCase().includes(this.terminoBusquedaObjeto.toLowerCase()));
  }

  cambiarTipo(tipo: 'xuxe' | 'vacuna'): void {
    this.tipoSeleccionado = tipo;
    this.nombreSeleccionado = '';
    this.terminoBusquedaObjeto = '';
    this.cantidad = 1;
  }

  // Llama al backend para añadir el objeto al usuario
  // La lógica de stacking reside en AdminController::agregarObjeto
  confirmar(): void {
    if (!this.usuario?.id || !this.nombreSeleccionado) return;

    this.cargando = true;
    this.mensaje = '';

    this.auth.agregarObjeto({
      user_id: this.usuario.id,
      type: this.tipoSeleccionado,
      name: this.nombreSeleccionado,
      amount: this.tipoSeleccionado === 'xuxe' ? this.cantidad : 1
    }).subscribe({
      next: () => {
        const tipo = this.tipoSeleccionado === 'vacuna' ? 'Vacuna' : 'Xuxe';
        this.mensaje = `${tipo} "${this.nombreSeleccionado}" añadida correctamente a ${this.usuario.name}.`;
        this.mensajeTipo = 'exito';
        this.cargando = false;
      },
      error: (err) => {
        if (typeof err.error?.errors === 'object') {
          this.mensaje = Object.values(err.error.errors).flat().join(', ');
        } else {
          this.mensaje = err.error?.errors ?? 'Error al añadir el objeto.';
        }
        this.mensajeTipo = 'error';
        this.cargando = false;
      }
    });
  }
  close(): void {
    this.cerrar.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}
