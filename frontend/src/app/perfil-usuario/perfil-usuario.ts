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
    private authService: Auth
  ) {}

  ngOnInit() {
    // Cargamos el usuario guardado en localStorage tras el login
    this.usuario = this.authService.getUsuario();

    // Inicializamos el formulario con los datos actuales del usuario
    // Los campos coinciden con el modelo User de Laravel: name, surname, email
    this.perfilForm = this.fb.group({
      name: [this.usuario?.name ?? '', [Validators.required, Validators.minLength(2)]],
      surname: [this.usuario?.surname ?? '', [Validators.required, Validators.minLength(2)]],
      email: [this.usuario?.email ?? '', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
    });
  }
}
