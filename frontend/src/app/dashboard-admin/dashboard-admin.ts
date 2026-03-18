import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Adminav } from '../shared/adminav/adminav';
import { GestionUsuarios } from '../gestion-usuarios/gestion-usuarios';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, Adminav, GestionUsuarios],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css'],
})
export class DashboardAdmin implements OnInit {
  // Datos del admin autenticado — se cargarán desde el backend
  admin: any = null;

  fechaHoy: string = '';

  // KPIs globales de la plataforma — se cargarán desde el backend
  kpis = {
    totalUsuarios: 128,
    totalXuxemons: 874,
    xuxemonsEnfermos: 47,
    totalObjetos: 312,
  };

  ngOnInit(): void {
    this.calcularFechaHoy();
    // TODO: llamar a AdminService para cargar admin autenticado y KPIs reales
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
