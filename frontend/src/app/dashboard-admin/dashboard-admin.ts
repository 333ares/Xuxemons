import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Adminav } from '../shared/adminav/adminav';
import { GestionUsuarios } from '../gestion-usuarios/gestion-usuarios';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, Adminav, GestionUsuarios],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css'],
})
export class DashboardAdmin implements OnInit {
  // Datos del admin autenticado
  admin: any = null;
  fechaHoy: string = '';

  // KPIs globales de la plataforma
  kpis = {
    totalUsuarios: 0,
    totalXuxemons: 0,
    xuxemonsEnfermos: 0,
    totalObjetos: 0,
  };

  // Porcentajes de infección por tipo de enfermedad
  infectionRates: any = {
    bajon: 5,
    sobredosis: 10,
    atracon: 15,
  };

  // Configuración diaria de generación automática
  dailyConfig: any = {
    xuxes: { hora: '08:00', cantidad: 1 },
    xuxemons: { hora: '08:00', cantidad: 1 },
  };

  // Estado de guardado por sección
  guardandoInfeccion = false;
  guardandoDiarioXuxes = false;
  guardandoDiarioXuxemons = false;
  feedbackInfeccion = '';
  feedbackDiarioXuxes = '';
  feedbackDiarioXuxemons = '';

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.calcularFechaHoy();
    this.cargarDatos();
    this.cargarInfectionRates();
    this.cargarDailyConfig();
  }

  // Carga los KPIs y la lista de usuarios desde el backend
  private cargarDatos(): void {
    this.auth.listarUsuarios().subscribe({
      next: (res) => {
        this.kpis.totalUsuarios = res.totalUsuarios;
        this.kpis.totalXuxemons = res.totalXuxemons;
        this.kpis.xuxemonsEnfermos = res.totalXuxemonsEnfermos;
        this.kpis.totalObjetos = res.totalObjetos;
      },
      error: (err) => {
        console.error('Error al cargar los datos del dashboard:', err);
      },
    });
  }

  // Carga los porcentajes de infección actuales desde el backend
  private cargarInfectionRates(): void {
    this.auth.getInfectionRates().subscribe({
      next: (res) => {
        this.infectionRates = {
          bajon: res.bajon ?? 5,
          sobredosis: res.sobredosis ?? 10,
          atracon: res.atracon ?? 15,
        };
      },
      error: (err) => {
        console.error('Error al cargar los porcentajes de infección:', err);
      },
    });
  }

  // Carga la configuración de generación diaria desde el backend
  private cargarDailyConfig(): void {
    this.auth.getDailyConfig().subscribe({
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
      },
    });
  }

  // Guarda los porcentajes de infección en el backend
  guardarInfectionRates(): void {
    this.guardandoInfeccion = true;
    this.feedbackInfeccion = '';

    this.auth.updateInfectionRates(this.infectionRates).subscribe({
      next: () => {
        this.feedbackInfeccion = 'ok';
        this.guardandoInfeccion = false;
        setTimeout(() => (this.feedbackInfeccion = ''), 3000);
      },
      error: (err) => {
        console.error('Error al guardar los porcentajes de infección:', err);
        this.feedbackInfeccion = 'error';
        this.guardandoInfeccion = false;
        setTimeout(() => (this.feedbackInfeccion = ''), 3500);
      },
    });
  }

  // Guarda la configuración diaria de xuxes en el backend
  guardarDailyConfigXuxes(): void {
    this.guardandoDiarioXuxes = true;
    this.feedbackDiarioXuxes = '';

    this.auth.updateDailyConfig({ xuxes: this.dailyConfig.xuxes }).subscribe({
      next: () => {
        this.feedbackDiarioXuxes = 'ok';
        this.guardandoDiarioXuxes = false;
        setTimeout(() => (this.feedbackDiarioXuxes = ''), 3000);
      },
      error: (err) => {
        console.error('Error al guardar la configuración de xuxes:', err);
        this.feedbackDiarioXuxes = 'error';
        this.guardandoDiarioXuxes = false;
        setTimeout(() => (this.feedbackDiarioXuxes = ''), 3500);
      },
    });
  }

  // Guarda la configuración diaria de xuxemons en el backend
  guardarDailyConfigXuxemons(): void {
    this.guardandoDiarioXuxemons = true;
    this.feedbackDiarioXuxemons = '';

    this.auth.updateDailyConfig({ xuxemons: this.dailyConfig.xuxemons }).subscribe({
      next: () => {
        this.feedbackDiarioXuxemons = 'ok';
        this.guardandoDiarioXuxemons = false;
        setTimeout(() => (this.feedbackDiarioXuxemons = ''), 3000);
      },
      error: (err) => {
        console.error('Error al guardar la configuración de xuxemons:', err);
        this.feedbackDiarioXuxemons = 'error';
        this.guardandoDiarioXuxemons = false;
        setTimeout(() => (this.feedbackDiarioXuxemons = ''), 3500);
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
}
