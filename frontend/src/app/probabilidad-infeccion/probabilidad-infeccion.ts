import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-probabilidad-infeccion',
  standalone: true, // ¡Importante para que funcionen los imports!
  imports: [CommonModule, FormsModule], // Necesario para usar [(ngModel)]
  templateUrl: './probabilidad-infeccion.html',
  styleUrl: './probabilidad-infeccion.css',
})
export class ProbabilidadInfeccion implements OnInit {
  fechaHoy: string = '';

  // Porcentajes de infección por tipo de enfermedad
  infectionRates: any = {
    bajon: 5,
    sobredosis: 10,
    atracon: 15,
  };

  // Estado de guardado por sección
  guardandoInfeccion = false;
  feedbackInfeccion = '';

  constructor(private auth: Auth) {}

  // Ahora sí se llamarán estas funciones al cargar la vista
  ngOnInit(): void {
    this.calcularFechaHoy();
    this.cargarInfectionRates();
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
