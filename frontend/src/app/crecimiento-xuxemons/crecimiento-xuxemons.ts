import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-crecimiento-xuxemons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crecimiento-xuxemons.html',
  styleUrl: './crecimiento-xuxemons.css',
})
export class CrecimientoXuxemons implements OnInit {
  // Configuración de xuxes necesarias por tamaño
  growthConfig: any = {
    pequeno_a_mediano: 3,
    mediano_a_grande: 5,
  };

  // Estado de guardado
  guardandoCrecimiento = false;
  feedbackCrecimiento = '';

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    this.cargarGrowthConfig();
  }

  // Carga la configuración actual desde el backend
  // NOTA: la ruta GET /admin/growthConfig está pendiente de implementación en el backend.
  // Mientras no exista, el componente usa los valores por defecto definidos arriba.
  private cargarGrowthConfig(): void {
    this.auth.obtenerConfigCrecimiento().subscribe({
      next: (res) => {
        this.growthConfig = {
          pequeno_a_mediano: res.config.xuxes_s_a_m,
          mediano_a_grande: res.config.xuxes_m_a_g
        };
      },
      error: (err) => {
        console.error('Error al cargar la configuración de crecimiento:', err);
        // Se mantienen los valores por defecto si la ruta aún no existe en el backend
      },
    });
  }

  // Guarda la configuración en el backend
  // NOTA: la ruta PUT /admin/growthConfig está pendiente de implementación en el backend.
  guardarGrowthConfig(): void {
    this.guardandoCrecimiento = true;
    this.feedbackCrecimiento = '';

    this.auth.actualizarConfigCrecimiento(this.growthConfig).subscribe({
      next: () => {
        this.feedbackCrecimiento = 'ok';
        this.guardandoCrecimiento = false;
        setTimeout(() => (this.feedbackCrecimiento = ''), 3000);
      },
      error: (err) => {
        console.error('Error al guardar la configuración de crecimiento:', err);
        this.feedbackCrecimiento = 'error';
        this.guardandoCrecimiento = false;
        setTimeout(() => (this.feedbackCrecimiento = ''), 3500);
      },
    });
  }
}
