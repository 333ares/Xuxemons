import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.css'],
})
export class PaginaPrincipal implements OnInit {
  // Datos del usuario autenticado, cargados desde el backend
  usuario: any = null;

  fechaHoy: string = '';

  recompensas = [
    { dia: 'Lun', esHoy: false, recogida: true },
    { dia: 'Mar', esHoy: false, recogida: true },
    { dia: 'Mié', esHoy: false, recogida: true },
    { dia: 'Jue', esHoy: true, recogida: false },
    { dia: 'Vie', esHoy: false, recogida: false },
    { dia: 'Sáb', esHoy: false, recogida: false },
    { dia: 'Dom', esHoy: false, recogida: false },
  ];

  coleccion = {
    total: 18,
    enfermos: 2,
    evoluciones: 1,
    agua: 7,
    tierra: 6,
    aire: 5,
    progresoPct: 60,
  };

  estadisticas = {
    ganadas: 7,
    jugadas: 12,
    racha: 5,
  };

  solicitudesAmistad = [{ nombre: 'Thornalune' }];

  solicitudesBatalla = [{ nombre: 'Dracibright' }, { nombre: 'Snowhale' }];

  xuxemon = {
    nombre: 'Boo-Hoot',
    tipo: 'Aire',
    tamano: 'Mediano',
  };

  mochila = {
    ocupados: 14,
    total: 20,
  };

  mochilaSlots = [
    { ocupado: true, tipo: 'apilable', emoji: '🍬' },
    { ocupado: true, tipo: 'apilable', emoji: '🍬' },
    { ocupado: true, tipo: 'apilable', emoji: '🍬' },
    { ocupado: true, tipo: 'apilable', emoji: '🍭' },
    { ocupado: true, tipo: 'apilable', emoji: '🍭' },
    { ocupado: true, tipo: 'no-apilable', emoji: '💉' },
    { ocupado: true, tipo: 'no-apilable', emoji: '🍫' },
    { ocupado: true, tipo: 'apilable', emoji: '🍬' },
    { ocupado: true, tipo: 'apilable', emoji: '🍡' },
    { ocupado: true, tipo: 'apilable', emoji: '🍡' },
    { ocupado: true, tipo: 'no-apilable', emoji: '💉' },
    { ocupado: true, tipo: 'apilable', emoji: '🍭' },
    { ocupado: true, tipo: 'apilable', emoji: '🍬' },
    { ocupado: true, tipo: 'apilable', emoji: '🍬' },
    { ocupado: false, tipo: '', emoji: '' },
    { ocupado: false, tipo: '', emoji: '' },
    { ocupado: false, tipo: '', emoji: '' },
    { ocupado: false, tipo: '', emoji: '' },
    { ocupado: false, tipo: '', emoji: '' },
    { ocupado: false, tipo: '', emoji: '' },
  ];

  amigos = [
    { nombre: 'Thornalune', online: true },
    { nombre: 'Dracibright', online: true },
    { nombre: 'Snowhale', online: false },
    { nombre: 'Lumivex', online: false },
  ];

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.calcularFechaHoy();
    this.cargarUsuario();
  }

  // Formatea la fecha de hoy en castellano
  private calcularFechaHoy(): void {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Carga los datos del usuario autenticado desde el backend
  private cargarUsuario(): void {
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        // El backend devuelve el usuario dentro de res.usuario o directamente en res
        this.usuario = res.usuario ?? res;
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
      },
    });
  }
}
