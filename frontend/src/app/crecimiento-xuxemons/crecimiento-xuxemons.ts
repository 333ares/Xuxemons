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

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.cargarGrowthConfig();
  }

  // Carga la configuración actual desde el backend
  private cargarGrowthConfig(): void {
    this.auth.getGrowthConfig().subscribe({
      next: (res) => {
        this.growthConfig = {
          pequeno_a_mediano: res.pequeno_a_mediano ?? 3,
          mediano_a_grande: res.mediano_a_grande ?? 5,
        };
      },
      error: (err) => {
        console.error('Error al cargar la configuración de crecimiento:', err);
      },
    });
  }

  // Guarda la configuración en el backend
  guardarGrowthConfig(): void {
    this.guardandoCrecimiento = true;
    this.feedbackCrecimiento = '';

    this.auth.updateGrowthConfig(this.growthConfig).subscribe({
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
