import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Adminav } from '../shared/adminav/adminav';
import { GestionUsuarios } from '../gestion-usuarios/gestion-usuarios';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CommonModule, Adminav, RouterLink],
  templateUrl: './parametros.html',
  styleUrl: './parametros.css',
})
export class Parametros {}
