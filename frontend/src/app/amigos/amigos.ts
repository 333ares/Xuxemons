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
  usuario: any = null;

  // Lista de todos los usuarios cargada una sola vez
  todosLosUsuarios: any[] = [];

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
    this.cargarTodosLosUsuarios();  // ← carga única al entrar
    this.cargarSolicitudesPendientes();
    this.cargarListaAmigos();
  }

  // Carga todos los usuarios una sola vez para buscar localmente
  private cargarTodosLosUsuarios(): void {
    this.authService.obtenerTodosUsuarios().subscribe({
      next: (res) => {
        this.todosLosUsuarios = res.usuarios ?? [];
      },
      error: () => {
        this.todosLosUsuarios = [];
      },
    });
  }

  // Búsqueda 100% en el front, sin llamada al backend
  buscar(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    this.resultadoBusqueda = null;
    this.errorBusqueda = '';

    if (!termino) return;

    const usuarioActual = this.authService.obtenerUsuario();

    const encontrado = this.todosLosUsuarios.find(
      (u) =>
        u.public_id?.toLowerCase() === termino &&
        u.id !== usuarioActual?.id  // que no te encuentres a ti mismo
    );

    if (!encontrado) {
      this.errorBusqueda = 'No se ha encontrado ningún jugador con ese ID.';
      return;
    }

    const yaEsAmigo = this.listaAmigos.some((a) => a.user_id === encontrado.id);
    const solicitudPendiente = encontrado.solicitud_enviada ?? false;

    this.resultadoBusqueda = { ...encontrado, yaEsAmigo, solicitudPendiente };
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
  // Abre el diálogo de confirmación para eliminar un amigo
  abrirDialogoEliminar(amigo: any): void {
    this.amigoAEliminar = amigo;
    this.mostrarDialogoEliminar = true;
  }

  cerrarDialogoEliminar(): void {
    this.mostrarDialogoEliminar = false;
    this.amigoAEliminar = null;
  }

  // Confirma la eliminación y actualiza la lista local
  confirmarEliminar(): void {
    if (!this.amigoAEliminar) return;
    // TODO backend: DELETE /amigos/{id} — pendiente de implementación
    this.authService.eliminarAmigo(this.amigoAEliminar.id).subscribe({
      next: () => {
        this.listaAmigos = this.listaAmigos.filter((a) => a.id !== this.amigoAEliminar.id);
        this.cerrarDialogoEliminar();
      },
      error: () => {
        this.cerrarDialogoEliminar();
      },
    });
  }
}
