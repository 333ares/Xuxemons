import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth
  ) {
    this.loginForm = this.fb.group({
      public_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { public_id, password } = this.loginForm.value;

    this.authService.login(public_id, password).subscribe({
      next: (res) => {
        // Guardamos el token y redirigimos
        this.authService.guardarToken(res.token);
        this.authService.guardarUsuario(res.usuario);
        this.router.navigate(['/paginaPrincipal']);
      },
      error: (err) => {
        // Mostramos el error del backend en el formulario
        this.errorMessage = err.error?.errors ?? 'Credenciales incorrectas';
      },
    });
  }
}