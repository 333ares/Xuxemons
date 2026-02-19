import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Validador que comprueba que los dos campos de contraseña coinciden
// Va fuera de la clase porque es una función pura: no necesita acceder a nada del componente.
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');


  // Si alguno de los dos campos no existe todavía, no hacemos nada
  if (!password || !confirmPassword) return null;


  if (password.value !== confirmPassword.value) {
    // Las contraseñas no coinciden: marcamos el error en confirmPassword
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Coinciden: limpiamos el error passwordMismatch si lo había,
    const errors = { ...confirmPassword.errors };
    delete errors['passwordMismatch'];
    confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    return null;
  }
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
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
    }, { validators: passwordMatchValidator }); // El validador passwordMatchValidator se aplica al grupo entero (no a un campo solo) porque necesita comparar dos campos a la vez.
  }

  onSubmit() {
    if (this.registroForm.invalid) return;

    const { nombre, apellidos, email, password } = this.registroForm.value;
  }
}
