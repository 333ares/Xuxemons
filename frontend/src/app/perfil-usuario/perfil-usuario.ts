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
    // Datos de prueba para visualizar el componente sin backend
    this.usuario = {
      name: 'Aether',
      surname: 'Byte',
      email: 'aetherbyte@gmail.com',
      public_id: '#AetherByte4821',
      rol: 'Jugador/a',
      telefono: '+34 612 843 957',
      created_at: '2026-02-14',
      batallas_ganadas: 18,
      batallas_jugadas: 27,
      mejor_racha: 5,
    };

    this.perfilForm = this.fb.group({
      name: [this.usuario?.name ?? '', [Validators.required, Validators.minLength(2)]],
      surname: [this.usuario?.surname ?? '', [Validators.required, Validators.minLength(2)]],
      email: [this.usuario?.email ?? '', [Validators.required, Validators.email]],
      // El teléfono es opcional, el usuario puede dejarlo vacío
      telefono: [this.usuario?.telefono ?? '', []],
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


    // Simulación de guardado sin backend
    setTimeout(() => {
      this.mensajeExito = 'Cambios guardados correctamente.';
      this.cargando = false;
      this.perfilForm.patchValue({ password: '' });
    }, 800);
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
    this.router.navigate(['/login']);
  }

  abrirDialogoBaja() {
    this.mostrarDialogoBaja = true;
  }

  cerrarDialogoBaja() {
    this.mostrarDialogoBaja = false;
  }

  confirmarBaja() {
    this.router.navigate(['/login']);
  }
}