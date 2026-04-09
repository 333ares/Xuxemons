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

  // Busca un usuario por su public_id (#NombreXXXX)
  buscar(): void {
    const termino = this.terminoBusqueda.trim();
    if (!termino) return;

    this.buscando = true;
    this.resultadoBusqueda = null;
    this.errorBusqueda = '';

    // TODO backend: GET /amigos/buscar?public_id= — pendiente de implementación
    this.authService.buscarAmigo(termino).subscribe({
      next: (res) => {
        const usuario = res.usuario ?? null;
        if (!usuario) {
          this.errorBusqueda = 'No se ha encontrado ningún jugador con ese ID.';
          this.buscando = false;
          return;
        }
        const yaEsAmigo = this.listaAmigos.some((a) => a.id === usuario.id);
        const solicitudPendiente = usuario.solicitud_enviada ?? false;
        this.resultadoBusqueda = { ...usuario, yaEsAmigo, solicitudPendiente };
        this.buscando = false;
      },
      error: () => {
        this.errorBusqueda = 'No se ha encontrado ningún jugador con ese ID.';
        this.buscando = false;
      },
    });
  }

  // Envía una solicitud de amistad al usuario encontrado en la búsqueda
  enviarSolicitud(receiverId: number): void {
    // TODO backend: POST /amigos/solicitud — pendiente de implementación
    this.authService.enviarSolicitud(receiverId).subscribe({
      next: () => {
        if (this.resultadoBusqueda) {
          this.resultadoBusqueda = { ...this.resultadoBusqueda, solicitudPendiente: true };
        }
      },
      error: () => {},
    });
  }

  // Acepta una solicitud: la saca de pendientes y la añade a la lista de amigos
  aceptar(friendshipId: number): void {
    // TODO backend: POST /amigos/aceptar — pendiente de implementación
    this.authService.aceptarSolicitud(friendshipId).subscribe({
      next: (res) => {
        const solicitud = this.solicitudesPendientes.find((s) => s.id === friendshipId);
        if (solicitud) {
          this.solicitudesPendientes = this.solicitudesPendientes.filter(
            (s) => s.id !== friendshipId,
          );
          this.listaAmigos = [res.amigo ?? solicitud, ...this.listaAmigos];
        }
      },
      error: () => {},
    });
  }

  // Rechaza una solicitud: la elimina de la lista sin recargar
  rechazar(friendshipId: number): void {
    // TODO backend: DELETE /amigos/rechazar — pendiente de implementación
    this.authService.rechazarSolicitud(friendshipId).subscribe({
      next: () => {
        this.solicitudesPendientes = this.solicitudesPendientes.filter(
          (s) => s.id !== friendshipId,
        );
      },
      error: () => {},
    });
  }
}
