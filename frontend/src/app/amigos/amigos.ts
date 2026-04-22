import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Auth } from '../services/auth';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-amigos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Nav],
  templateUrl: './amigos.html',
  styleUrls: ['./amigos.css'],
})
export class Amigos implements OnInit, OnDestroy {
  // Datos del usuario autenticado (para la cabecera)
  usuario: any = null;

  // Lista completa de usuarios cargada una sola vez al entrar
  todosLosUsuarios: any[] = [];

  // --- BÚSQUEDA ---
  terminoBusqueda: string = '';
  resultadoBusqueda: any = null;
  buscando: boolean = false; // true durante el debounce para feedback visual
  errorBusqueda: string = '';

  // Subject para el debounce de 300ms en el input de búsqueda
  private busquedaSubject = new Subject<string>();
  private busquedaSub!: Subscription;

  // --- LISTAS ---
  listaAmigos: any[] = [];
  solicitudesPendientes: any[] = [];
  cargando: boolean = false;

  // --- DIÁLOGO ELIMINAR ---
  mostrarDialogoEliminar: boolean = false;
  amigoAEliminar: any = null;

  // --- FEEDBACK RETAR ---
  // Guarda el id del amigo al que se acaba de enviar el reto para mostrar feedback
  retoEnviado: number | null = null;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarTodosLosUsuarios();
    this.cargarSolicitudesPendientes();
    this.cargarListaAmigos();
    this.configurarDebounce();
  }

  ngOnDestroy(): void {
    this.busquedaSub?.unsubscribe();
  }

  // Configura el debounce de 300ms + mínimo 3 caracteres en el buscador
  private configurarDebounce(): void {
    this.busquedaSub = this.busquedaSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((termino) => {
        this.ejecutarBusqueda(termino);
      });
  }

  // Se llama desde el (input) del campo de búsqueda en el HTML
  onInputBusqueda(valor: string): void {
    this.terminoBusqueda = valor;
    this.resultadoBusqueda = null;
    this.errorBusqueda = '';

    if (valor.trim().length < 3) {
      this.buscando = false;
      return;
    }

    this.buscando = true; // muestra "Buscando..." mientras espera el debounce
    this.busquedaSubject.next(valor.trim().toLowerCase());
  }

  // Se puede llamar también desde el botón o Enter para forzar búsqueda inmediata
  buscar(): void {
    const termino = this.terminoBusqueda.trim();

    if (termino.length < 3) {
      this.errorBusqueda = 'Introduce al menos 3 caracteres para buscar.';
      return;
    }

    this.buscando = true;
    this.resultadoBusqueda = null;
    this.errorBusqueda = '';
    this.ejecutarBusqueda(termino.toLowerCase());
  }

  // Lógica real de filtrado local — sin llamada al backend
  private ejecutarBusqueda(termino: string): void {
    const usuarioActual = this.authService.obtenerUsuario();

    const encontrado = this.todosLosUsuarios.find(
      (u) => u.public_id?.toLowerCase() === termino && u.id !== usuarioActual?.id,
    );

    this.buscando = false;

    if (!encontrado) {
      this.errorBusqueda = 'No se ha encontrado ningún jugador con ese ID.';
      return;
    }

    const yaEsAmigo = this.listaAmigos.some((a) => a.user_id === encontrado.id);

    // Comprobamos también si hay solicitud ya enviada que esté pendiente
    const solicitudEnviada = false; // El estado viene del backend al cargar la lista

    this.resultadoBusqueda = { ...encontrado, yaEsAmigo, solicitudPendiente: solicitudEnviada };
  }

  // Carga todos los usuarios una sola vez para filtrar localmente
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

  private cargarUsuario(): void {
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario ?? res;
      },
      error: () => {},
    });
  }

  private cargarSolicitudesPendientes(): void {
    this.authService.obtenerSolicitudesPendientes().subscribe({
      next: (res) => {
        this.solicitudesPendientes = res.solicitudes ?? [];
      },
      error: () => {
        this.solicitudesPendientes = [];
      },
    });
  }

  private cargarListaAmigos(): void {
    this.cargando = true;
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
    this.authService.aceptarSolicitud(friendshipId).subscribe({
      next: (res) => {
        const solicitud = this.solicitudesPendientes.find((s) => s.id === friendshipId);
        if (solicitud) {
          this.solicitudesPendientes = this.solicitudesPendientes.filter(
            (s) => s.id !== friendshipId,
          );
          // El backend devuelve el amigo con id real; lo añadimos con user_id para consistencia
          const nuevoAmigo = res.amigo ?? solicitud;
          this.listaAmigos = [{ ...nuevoAmigo, user_id: nuevoAmigo.id }, ...this.listaAmigos];
        }
      },
      error: () => {},
    });
  }

  // Rechaza una solicitud: la elimina de la lista sin recargar
  rechazar(friendshipId: number): void {
    this.authService.rechazarSolicitud(friendshipId).subscribe({
      next: () => {
        this.solicitudesPendientes = this.solicitudesPendientes.filter(
          (s) => s.id !== friendshipId,
        );
      },
      error: () => {},
    });
  }

  // Envía un reto de batalla al amigo indicado
  retarAmigo(amigo: any): void {
    this.authService.enviarRetoBatalla(amigo.user_id).subscribe({
      next: () => {
        // Guardamos el id de la friendship para mostrar feedback en el botón
        this.retoEnviado = amigo.id;
        // Limpiamos el feedback tras 3 segundos
        setTimeout(() => {
          if (this.retoEnviado === amigo.id) this.retoEnviado = null;
        }, 3000);
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

  // Confirma la eliminación usando el id de la friendship (no el user_id)
  confirmarEliminar(): void {
    if (!this.amigoAEliminar) return;
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
