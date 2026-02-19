import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent {

  // Datos del usuario (luego vendrán del backend)
  usuario = {
    avatar: 'assets/avatar.png',
    username: 'AetherByte',
    userId: '#AetherByte4821',
    rol: 'Jugador/a',
    email: 'aetherbyte@gmail.com',
    telefono: '+34 612 843 957',
    fechaRegistro: '14 Feb 2026',
    nombre: 'Aether',
    apellidos: 'Byte'
  };

  // Estadísticas del usuario
  stats = {
    ganadas: 18,
    jugadas: 27,
    racha: 5
  };

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: [this.usuario.nombre],
      apellidos: [this.usuario.apellidos],
      email: [this.usuario.email],
      password: ['']
    });
  }

  guardarCambios() {
    console.log('Datos enviados:', this.form.value);
  }

  descartarCambios() {
    this.form.patchValue({
      nombre: this.usuario.nombre,
      apellidos: this.usuario.apellidos,
      email: this.usuario.email,
      password: ''
    });
  }
}
