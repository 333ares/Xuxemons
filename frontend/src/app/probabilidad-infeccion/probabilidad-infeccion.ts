import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-probabilidad-infeccion',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Estado de guardado
  guardandoInfeccion = false;
  feedbackInfeccion = '';

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.calcularFechaHoy();
    this.cargarTasasInfeccion();
  }

  // Carga los porcentajes de infección actuales desde el backend
  // NOTA: la ruta GET /admin/infectionRates está pendiente de implementación en el backend.
  // Mientras no exista, el componente usa los valores por defecto definidos arriba.
  private cargarTasasInfeccion(): void {
    this.auth.obtenerTasasInfeccion().subscribe({
      next: (res) => {
        this.infectionRates = {
          bajon: res.bajon ?? 5,
          sobredosis: res.sobredosis ?? 10,
          atracon: res.atracon ?? 15,
        };
      },
      error: (err) => {
        console.error('Error al cargar los porcentajes de infección:', err);
        // Se mantienen los valores por defecto si la ruta aún no existe en el backend
      },
    });
  }

  // Guarda los porcentajes de infección en el backend
  guardarInfectionRates(): void {
    this.guardandoInfeccion = true;
    this.feedbackInfeccion = '';

    this.auth.actualizarTasasInfeccion(this.infectionRates).subscribe({
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
