import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Adminav } from '../shared/adminav/adminav';
import { GestionUsuarios } from '../gestion-usuarios/gestion-usuarios';

@Component({
  selector: 'app-gestion-usuarios-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Adminav, GestionUsuarios],
  templateUrl: './gestion-usuarios-page.html',
  styleUrls: ['./gestion-usuarios-page.css'],
})
export class GestionUsuariosPage {}
