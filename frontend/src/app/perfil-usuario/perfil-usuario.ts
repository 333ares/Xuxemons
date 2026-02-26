import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {
  perfilForm!: FormGroup;
  mostrarPassword: boolean = false;
  mostrarDialogoBaja: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  // Datos del usuario cargados desde localStorage via el servicio
  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
  ) {}

  ngOnInit() {
    // Cargamos el usuario guardado en localStorage tras el login
    this.usuario = this.authService.getUsuario();

    // Inicializamos el formulario con los datos actuales del usuario
    this.perfilForm = this.fb.group({
      name: [this.usuario?.name ?? '', [Validators.required, Validators.minLength(2)]],
      surname: [this.usuario?.surname ?? '', [Validators.required, Validators.minLength(2)]],
      email: [this.usuario?.email ?? '', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
    });
  }

  onGuardar() {
    if (this.perfilForm.invalid) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const datos = { ...this.perfilForm.value };

    // Si el campo password está vacío, no lo enviamos al backend
    // El UserController de Laravel solo lo actualiza si llega en el body
    if (!datos.password) {
      delete datos.password;
    }
  }
  onDescartar() {
    // Restaura los valores originales y limpia mensajes de feedback
    this.perfilForm.patchValue({
      name: this.usuario?.name ?? '',
      surname: this.usuario?.surname ?? '',
      email: this.usuario?.email ?? '',
      password: '',
    });
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  abrirDialogoBaja() {
    this.mostrarDialogoBaja = true;
  }

  cerrarDialogoBaja() {
    this.mostrarDialogoBaja = false;
  }

  confirmarBaja() {
    this.authService.darseDebaja().subscribe({
      next: () => {
        // Borramos token y datos locales, luego redirigimos al login
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.mensajeError = 'No se ha podido completar la baja. Inténtalo de nuevo.';
        this.mostrarDialogoBaja = false;
      },
    });
  }
}
