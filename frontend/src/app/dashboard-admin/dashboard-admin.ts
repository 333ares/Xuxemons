import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Adminav } from '../shared/adminav/adminav';
import { GestionUsuarios } from '../gestion-usuarios/gestion-usuarios';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, Adminav, GestionUsuarios],
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

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    this.calcularFechaHoy();
    this.cargarDatos();
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
      }
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