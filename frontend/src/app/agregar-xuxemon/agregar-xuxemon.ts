import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-agregar-xuxemon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-xuxemon.html',
  styleUrls: ['./agregar-xuxemon.css'],
})
export class AgregarXuxemon implements OnInit {
  constructor(private auth: Auth) {}

  // Usuario al que se añadirá el Xuxemon — lo recibe desde GestionUsuarios
  @Input() usuario: any = null;

  // Evento que cierra el modal
  @Output() cerrar = new EventEmitter<boolean>();

  cargando: boolean = false;
  mensaje: string = '';
  mensajeTipo: 'exito' | 'error' | '' = '';

  ngOnInit(): void {}

  // Llama al backend para asignar un Xuxemon aleatorio al usuario
  // La lógica de selección aleatoria reside en AdminController::agregarXuxemon
  confirmar(): void {
    if (!this.usuario?.id) return;

    this.cargando = true;
    this.mensaje = '';

    this.auth.agregarXuxemon(this.usuario.id).subscribe({
      next: (res) => {
        this.mensaje = `Xuxemon añadido correctamente a ${this.usuario.name}.`;
        this.mensajeTipo = 'exito';
        this.cargando = false;
      },
      error: (err) => {
        this.mensaje = err.error?.errors ?? 'Error al añadir el Xuxemon.';
        this.mensajeTipo = 'error';
        this.cargando = false;
      },
    });
  }

  close(): void {
    this.cerrar.emit();
  }

  // Cierra el modal al hacer clic en el fondo oscuro
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}
