import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
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
