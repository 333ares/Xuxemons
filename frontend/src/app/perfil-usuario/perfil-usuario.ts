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

  // any permite que el template use ?. sin que Angular strict mode genere warnings
  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
  ) { }

  ngOnInit() {
    // Inicializamos el formulario vacío antes de que lleguen los datos
    this.perfilForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', []],
      password: ['', [Validators.minLength(6)]],
    });

    // Cargamos los datos del backend
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario;
        this.authService.guardarUsuario(this.usuario);

        // Rellenamos el formulario con los datos
        this.perfilForm.patchValue({
          name: this.usuario.name,
          surname: this.usuario.surname,
          email: this.usuario.email,
          telefono: this.usuario.telefono ?? '',
        });
      },
      error: () => {
        // Token expirado o inválido, redirigimos al login
        this.router.navigate(['/login']);
      }
    });
  }

  onGuardar() {
    if (this.perfilForm.invalid) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const datos = { ...this.perfilForm.value };
    if (!datos.password) delete datos.password;

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

  // Cierra la sesión sin eliminar la cuenta y redirige al login
  cerrarSesion() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.eliminarToken();
        this.authService.eliminarUsuario();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.eliminarToken();
        this.authService.eliminarUsuario();
        this.router.navigate(['/login']);
      }
    });
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

}