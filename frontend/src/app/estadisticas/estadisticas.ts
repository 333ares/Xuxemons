import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Adminav } from '../shared/adminav/adminav';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, Adminav, RouterLink],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements OnInit {
  //  KPIs globales (vienen de GET /listarUsuarios)
  totalUsuarios: number = 0;
  totalXuxemons: number = 0;
  totalXuxemonsEnfermos: number = 0;
  totalObjetos: number = 0;

  //  Métricas calculadas
  porcentajeEnfermos: number = 0;
  porcentajeSanos: number = 0;
  mediaXuxemonsPorUsuario: number = 0;
  mediaObjetosPorUsuario: number = 0;

  //  Top 5 jugadores por número de Xuxemons
  topUsuarios: any[] = [];

  //  Tasas de infección (vienen de GET /config-alimentar)
  porcentajeBajon: number = 0;
  porcentajeSobredosis: number = 0;
  porcentajeAtracon: number = 0;
  porcentajeSinEnfermedad: number = 100;

  //  Estado de carga
  cargando: boolean = true;
  errorCarga: boolean = false;

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarTasasInfeccion();
  }
  cargarEstadisticas(): void {
    this.authService.listarUsuarios().subscribe({
      next: (res) => {
        this.totalUsuarios = res.totalUsuarios ?? 0;
        this.totalXuxemons = res.totalXuxemons ?? 0;
        this.totalXuxemonsEnfermos = res.totalXuxemonsEnfermos ?? 0;
        this.totalObjetos = res.totalObjetos ?? 0;

        if (this.totalXuxemons > 0) {
          this.porcentajeEnfermos = Math.round(
            (this.totalXuxemonsEnfermos / this.totalXuxemons) * 100,
          );
          this.porcentajeSanos = 100 - this.porcentajeEnfermos;
        }

        if (this.totalUsuarios > 0) {
          this.mediaXuxemonsPorUsuario =
            Math.round((this.totalXuxemons / this.totalUsuarios) * 10) / 10;
          this.mediaObjetosPorUsuario =
            Math.round((this.totalObjetos / this.totalUsuarios) * 10) / 10;
        }

        this.topUsuarios = [...(res.usuarios ?? [])]
          .sort((a: any, b: any) => b.xuxemons - a.xuxemons)
          .slice(0, 5);

        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false; // ← sin esto el spinner nunca desaparece
        // Solo redirigir al login si el token realmente ha caducado (401)
        if (err?.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.errorCarga = true; // muestra el error en pantalla, no echa al usuario
        }
      },
    });
  }

  cargarTasasInfeccion(): void {
    this.authService.obtenerTasasInfeccion().subscribe({
      next: (res) => {
        if (res?.config) {
          this.porcentajeBajon = res.config.porcentaje_bajon ?? 0;
          this.porcentajeSobredosis = res.config.porcentaje_sobredosis ?? 0;
          this.porcentajeAtracon = res.config.porcentaje_atracon ?? 0;
          // El resto de probabilidad corresponde a no enfermar
          this.porcentajeSinEnfermedad =
            100 - this.porcentajeBajon - this.porcentajeSobredosis - this.porcentajeAtracon;
        }
      },
      error: () => {
        // No bloqueamos la vista si falla; se quedan los valores por defecto
      },
    });
  }

  // Devuelve los datos del círculo SVG para el donut de salud
  // Permite pasarle un porcentaje y que genere el stroke-dashoffset correcto
  donutOffset(porcentaje: number): number {
    const circunferencia = 2 * Math.PI * 52; // radio = 52
    return circunferencia - (porcentaje / 100) * circunferencia;
  }
}
