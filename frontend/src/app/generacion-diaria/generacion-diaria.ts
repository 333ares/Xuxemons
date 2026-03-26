import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-generacion-diaria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generacion-diaria.html',
  styleUrl: './generacion-diaria.css',
})
export class GeneracionDiaria implements OnInit {
  // Datos
  fechaHoy: string = '';

  // Configuración diaria de generación automática
  dailyConfig: any = {
    xuxes: { hora: '08:00', cantidad: 1 },
    xuxemons: { hora: '08:00', cantidad: 1 },
  };

  // Estado de guardado por sección
  feedbackDiarioXuxes = '';
  feedbackDiarioXuxemons = '';

  // Variables para controlar el estado de los botones
  guardandoDiarioXuxes: boolean = false;
  guardandoDiarioXuxemons: boolean = false;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.calcularFechaHoy();
    this.cargarConfigDiaria();
  }

  // Carga la configuración de generación diaria desde el backend
  // NOTA: la ruta GET /admin/dailyConfig está pendiente de implementación en el backend.
  // Mientras no exista, el componente usa los valores por defecto definidos arriba.
  private cargarConfigDiaria(): void {
    this.auth.obtenerConfigDiaria().subscribe({
      next: (res) => {
        this.dailyConfig = {
          xuxes: {
            hora: res.xuxes?.hora ?? '08:00',
            cantidad: res.xuxes?.cantidad ?? 1,
          },
          xuxemons: {
            hora: res.xuxemons?.hora ?? '08:00',
            cantidad: res.xuxemons?.cantidad ?? 1,
          },
        };
      },
      error: (err) => {
        console.error('Error al cargar la configuración diaria:', err);
        // Se mantienen los valores por defecto si la ruta aún no existe en el backend
      },
    });
  }

  private calcularFechaHoy(): void {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Guarda solo la configuración de las Xuxes diarias
  guardarDailyConfigXuxes(): void {
    this.guardandoDiarioXuxes = true;
    this.feedbackDiarioXuxes = '';

    const payload = {
      xuxes: {
        hora: this.dailyConfig.xuxes.hora,
        cantidad: this.dailyConfig.xuxes.cantidad,
      },
    };

    this.auth.actualizarConfigDiaria(payload).subscribe({
      next: () => {
        this.guardandoDiarioXuxes = false;
        this.feedbackDiarioXuxes = 'ok';
        setTimeout(() => (this.feedbackDiarioXuxes = ''), 3000);
      },
      error: (err) => {
        console.error('Error guardando configuración de xuxes:', err);
        this.guardandoDiarioXuxes = false;
        this.feedbackDiarioXuxes = 'error';
        setTimeout(() => (this.feedbackDiarioXuxes = ''), 3500);
      },
    });
  }

  // Guarda solo la configuración de los Xuxemons diarios
  guardarDailyConfigXuxemons(): void {
    this.guardandoDiarioXuxemons = true;
    this.feedbackDiarioXuxemons = '';

    const payload = {
      xuxemons: {
        hora: this.dailyConfig.xuxemons.hora,
        cantidad: this.dailyConfig.xuxemons.cantidad,
      },
    };

    this.auth.actualizarConfigDiaria(payload).subscribe({
      next: () => {
        this.guardandoDiarioXuxemons = false;
        this.feedbackDiarioXuxemons = 'ok';
        setTimeout(() => (this.feedbackDiarioXuxemons = ''), 3000);
      },
      error: (err) => {
        console.error('Error guardando configuración de xuxemons:', err);
        this.guardandoDiarioXuxemons = false;
        this.feedbackDiarioXuxemons = 'error';
        setTimeout(() => (this.feedbackDiarioXuxemons = ''), 3500);
      },
    });
  }
}
