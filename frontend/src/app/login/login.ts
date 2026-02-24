import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // ajusta la ruta si es necesario

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
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { userId, password } = this.loginForm.value;

    this.authService.login(userId, password).subscribe({
      next: (res) => {
        // Guardamos el token y redirigimos
        this.authService.guardarToken(res.token);
        this.router.navigate(['/paginaPrincipal']); // cambia la ruta a donde quieras redirigir
      },
      error: (err) => {
        // Mostramos el error del backend en el formulario
        this.errorMessage = err.error.errors ?? 'Error al iniciar sesión';
      }
    });
  }
}