import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.css'],
})
export class PaginaPrincipal implements OnInit {
  // TODO: Cuando el backend esté listo, cargar desde authService.getUsuario()
  // El tipo 'any' permite usar ?. en el template sin warnings de Angular strict mode
  usuario: any = {
    name: 'Aether',
    surname: 'Byte',
    public_id: '#AetherByte4821',
  };

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

  // Genera los 20 slots de la mochila para la vista previa
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

  ngOnInit() {
    // Formatea la fecha de hoy en castellano
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
