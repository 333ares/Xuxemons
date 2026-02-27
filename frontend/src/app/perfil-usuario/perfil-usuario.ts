import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
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

  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
  ) { }

  ngOnInit() {
    // Cargamos los datos del usuario desde el backend
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario;

        // Guardamos los datos actualizados en localStorage
        this.authService.guardarUsuario(this.usuario);

        // Inicializamos el formulario con los datos reales
        this.perfilForm = this.fb.group({
          name: [this.usuario?.name ?? '', [Validators.required, Validators.minLength(2)]],
          surname: [this.usuario?.surname ?? '', [Validators.required, Validators.minLength(2)]],
          email: [this.usuario?.email ?? '', [Validators.required, Validators.email]],
          telefono: [this.usuario?.telefono ?? '', []],
          password: ['', [Validators.minLength(6)]],
        });
      },
      error: () => {
        // Si falla (token expirado, etc.) redirigimos al login
        this.router.navigate(['/login']);
      }
    });

    // Inicializamos el formulario vacío para evitar errores antes de que lleguen los datos
    this.perfilForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', []],
      password: ['', [Validators.minLength(6)]],
    });
  }

  onGuardar() {
    if (this.perfilForm.invalid) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const datos = { ...this.perfilForm.value };
    if (!datos.password) delete datos.password;

    // Llamada real al backend
    this.authService.actualizarUsuario(datos).subscribe({
      next: (res) => {
        this.mensajeExito = 'Cambios guardados correctamente.';
        this.cargando = false;
        this.usuario = res.usuario;
        this.authService.guardarUsuario(this.usuario);
        this.perfilForm.patchValue({ password: '' });
      },
      error: (err) => {
        this.mensajeError = err.error?.errors ?? 'Error al guardar los cambios.';
        this.cargando = false;
      }
    });
  }

  onDescartar() {
    this.perfilForm.patchValue({
      name: this.usuario?.name ?? '',
      surname: this.usuario?.surname ?? '',
      email: this.usuario?.email ?? '',
      telefono: this.usuario?.telefono ?? '',
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
    this.authService.eliminarCuenta().subscribe({
      next: () => {
        this.authService.eliminarToken();
        this.authService.eliminarUsuario();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Aunque falle limpiamos igualmente
        this.authService.eliminarToken();
        this.authService.eliminarUsuario();
        this.router.navigate(['/login']);
      }
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.eliminarToken();
        this.authService.eliminarUsuario();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Aunque falle el backend, limpiamos igualmente
        this.authService.eliminarToken();
        this.authService.eliminarUsuario();
        this.router.navigate(['/login']);
      }
    });
  }
}