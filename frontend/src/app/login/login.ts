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
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth
  ) {
    this.loginForm = this.fb.group({
      public_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Comprobamos si venimos del registro para mostrar el mensaje de éxito
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['registrado']) {
      this.successMessage = `Te has registrado correctamente, tu ID es ${nav.extras.state['public_id']}`;
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { public_id, password } = this.loginForm.value;

    this.authService.login(public_id, password).subscribe({
      next: (res) => {
        // Guardamos el token y redirigimos
        this.authService.guardarToken(res.token);
        this.router.navigate(['/paginaPrincipal']);
      },
      error: (err) => {
        // Si el error es un objeto (validación de Laravel) lo aplanamos en un string legible
        if (typeof err.error?.errors === 'object') {
          this.errorMessage = Object.values(err.error.errors).flat().join(', ');
        } else {
          this.errorMessage = err.error?.errors ?? 'Credenciales incorrectas.';
        }
      },
    });
  }
}
