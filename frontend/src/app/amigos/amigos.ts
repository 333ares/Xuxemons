import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-amigos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Nav],
  templateUrl: './amigos.html',
  styleUrls: ['./amigos.css'],
})
export class Amigos implements OnInit {
  // Datos del usuario autenticado (para la cabecera)
  usuario: any = null;

  // --- BÚSQUEDA ---
  terminoBusqueda: string = '';
  resultadoBusqueda: any = null;
  buscando: boolean = false;
  errorBusqueda: string = '';

  // --- LISTAS ---
  listaAmigos: any[] = [];
  solicitudesPendientes: any[] = [];
  cargando: boolean = false;

  // --- DIÁLOGO ELIMINAR ---
  mostrarDialogoEliminar: boolean = false;
  amigoAEliminar: any = null;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarSolicitudesPendientes();
    this.cargarListaAmigos();
  }

  // Carga los datos del usuario autenticado para mostrarlos en la cabecera
  private cargarUsuario(): void {
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario ?? res;
      },
      error: () => {},
    });
  }

  // Carga las solicitudes de amistad pendientes recibidas
  private cargarSolicitudesPendientes(): void {
    // TODO backend: GET /amigos/solicitudes — pendiente de implementación
    this.authService.obtenerSolicitudesPendientes().subscribe({
      next: (res) => {
        this.solicitudesPendientes = res.solicitudes ?? [];
      },
      error: () => {
        this.solicitudesPendientes = [];
      },
    });
  }

  // Carga la lista de amigos del usuario autenticado
  private cargarListaAmigos(): void {
    this.cargando = true;
    // TODO backend: GET /amigos — pendiente de implementación
    this.authService.obtenerAmigos().subscribe({
      next: (res) => {
        this.listaAmigos = res.amigos ?? [];
        this.cargando = false;
      },
      error: () => {
        this.listaAmigos = [];
        this.cargando = false;
      },
    });
  }
}
