import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Adminav } from '../shared/adminav/adminav';

// Aquí importamos tus 3 componentes de configuración
import { GeneracionDiaria } from '../generacion-diaria/generacion-diaria';
import { ProbabilidadInfeccion } from '../probabilidad-infeccion/probabilidad-infeccion';
import { CrecimientoXuxemons } from '../crecimiento-xuxemons/crecimiento-xuxemons'; // <- Ajusta la ruta si es necesario

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [
    CommonModule,
    Adminav,
    RouterLink,
    GeneracionDiaria,
    ProbabilidadInfeccion,
    CrecimientoXuxemons,
  ],
  templateUrl: './parametros.html',
  styleUrl: './parametros.css',
})
export class Parametros {}
