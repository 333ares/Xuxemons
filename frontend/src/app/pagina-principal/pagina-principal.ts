import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.css']
})
export class PaginaPrincipal {

  recompensas = [
    { dia: 'Lun 16' },
    { dia: 'Mar 17' },
    { dia: 'Mié 18' },
    { dia: 'Jue 19' },
    { dia: 'Vie 20' },
    { dia: 'Sáb 21' }
  ];

  coleccion = {
    total: 18,
    enfermos: 2,
    evoluciones: 1
  };

  solicitudesAmistad = [
    { nombre: 'Thornalune' }
  ];

  solicitudesBatalla = [
    { nombre: 'Dracibright' },
    { nombre: 'Snowhale' }
  ];

  estadisticas = {
    ganadas: 7,
    jugadas: 12,
    racha: 5
  };

  xuxemon = {
    nombre: 'Boo-Hoot'
  };

}
