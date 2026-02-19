import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  registroForm: FormGroup;

  // Variables para controlar si se muestra u oculta la contraseña en cada campo
  mostrarPassword: boolean = false;
  mostrarConfirm: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    // Definimos el formulario con sus campos y validadores individuales.
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registroForm.invalid) return;

    const { nombre, apellidos, email, password } = this.registroForm.value;
  }
}
