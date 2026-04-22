import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Nav } from '../shared/nav/nav';

interface Conversacion {
  user_id: number;
  name: string;
  surname: string;
  public_id: string;
  ultimo_mensaje: string | null;
  ultimo_mensaje_at: string | null;
  unread: number;
}

interface Mensaje {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  read_at: string | null;
  created_at: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Nav],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('mensajesRef') mensajesRef!: ElementRef<HTMLDivElement>;

  usuario: any = null;

  conversaciones: Conversacion[] = [];
  conversacionesFiltradas: Conversacion[] = [];
  conversacionActiva: Conversacion | null = null;

  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  terminoBusqueda: string = '';

  cargandoConversaciones = false;
  cargandoMensajes = false;
  enviando = false;

  // En móvil alternamos entre panel lateral y panel de chat
  panelVisible: 'lista' | 'chat' = 'lista';

  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private ultimoMensajeId: number | null = null;
  private debeScrollear = false;

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarConversaciones();
    this.iniciarPolling();
  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }

  ngAfterViewChecked(): void {
    if (this.debeScrollear) {
      this.scrollearAbajo();
      this.debeScrollear = false;
    }
  }

  //  Usuario

  private cargarUsuario(): void {
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.usuario = res.usuario ?? res;
      },
      error: () => {},
    });
  }

  //  Conversaciones

  cargarConversaciones(): void {
    this.cargandoConversaciones = true;
    this.authService.listarConversaciones().subscribe({
      next: (res) => {
        this.conversaciones = res.conversaciones ?? [];
        this.filtrarConversaciones();
        this.cargandoConversaciones = false;
      },
      error: () => {
        this.cargandoConversaciones = false;
      },
    });
  }

  filtrarConversaciones(): void {
    const t = this.terminoBusqueda.toLowerCase().trim();
    this.conversacionesFiltradas = t
      ? this.conversaciones.filter(
          (c) =>
            c.name?.toLowerCase().includes(t) ||
            c.surname?.toLowerCase().includes(t) ||
            c.public_id?.toLowerCase().includes(t),
        )
      : [...this.conversaciones];
  }

  seleccionarConversacion(conv: Conversacion): void {
    this.conversacionActiva = conv;
    this.panelVisible = 'chat';
    this.cargarMensajes(conv.user_id);
    // Marcamos como leídos al abrir la conversación
    this.authService.marcarLeidos(conv.user_id).subscribe({ error: () => {} });
    conv.unread = 0;
  }

  volverALista(): void {
    this.panelVisible = 'lista';
    this.conversacionActiva = null;
    this.mensajes = [];
  }

  //  Mensajes

  private cargarMensajes(userId: number): void {
    this.cargandoMensajes = true;
    this.authService.listarMensajes(userId).subscribe({
      next: (res) => {
        this.mensajes = res.mensajes ?? [];
        this.ultimoMensajeId = this.mensajes.at(-1)?.id ?? null;
        this.cargandoMensajes = false;
        this.debeScrollear = true;
      },
      error: () => {
        this.cargandoMensajes = false;
      },
    });
  }

  enviarMensaje(): void {
    const contenido = this.nuevoMensaje.trim();
    if (!contenido || !this.conversacionActiva || this.enviando) return;

    this.enviando = true;
    this.authService
      .enviarMensaje(this.conversacionActiva.user_id, contenido)
      .subscribe({
        next: (res) => {
          const msg: Mensaje = res.mensaje;
          this.mensajes = [...this.mensajes, msg];
          this.ultimoMensajeId = msg.id;
          this.nuevoMensaje = '';
          this.enviando = false;
          this.debeScrollear = true;

          // Actualizamos el último mensaje en la lista sin recargar
          const conv = this.conversaciones.find(
            (c) => c.user_id === this.conversacionActiva!.user_id,
          );
          if (conv) {
            conv.ultimo_mensaje = contenido;
            conv.ultimo_mensaje_at = new Date().toISOString();
          }
          // Reordenamos para que la conversación activa suba arriba
          this.conversaciones.sort((a, b) =>
            (b.ultimo_mensaje_at ?? '').localeCompare(a.ultimo_mensaje_at ?? ''),
          );
          this.filtrarConversaciones();
        },
        error: () => {
          this.enviando = false;
        },
      });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }

  //  Polling

  private iniciarPolling(): void {
    this.pollingInterval = setInterval(() => {
      // Actualizamos conversaciones para reflejar no leídos
      this.authService.listarConversaciones().subscribe({
        next: (res) => {
          const nuevas: Conversacion[] = res.conversaciones ?? [];
          // Solo actualizamos los datos de no leídos y último mensaje;
          // no reemplazamos si hay una conversación activa para no perder estado
          nuevas.forEach((nueva) => {
            const existe = this.conversaciones.find((c) => c.user_id === nueva.user_id);
            if (existe) {
              existe.ultimo_mensaje = nueva.ultimo_mensaje;
              existe.ultimo_mensaje_at = nueva.ultimo_mensaje_at;
              // No actualizamos unread si esa conversación está abierta
              if (this.conversacionActiva?.user_id !== nueva.user_id) {
                existe.unread = nueva.unread;
              }
            } else {
              this.conversaciones.push(nueva);
            }
          });
          this.filtrarConversaciones();
        },
        error: () => {},
      });

      // Si hay conversación activa, miramos si llegaron mensajes nuevos
      if (this.conversacionActiva) {
        this.authService.listarMensajes(this.conversacionActiva.user_id).subscribe({
          next: (res) => {
            const mensajesNuevos: Mensaje[] = res.mensajes ?? [];
            const ultimoId = mensajesNuevos.at(-1)?.id ?? null;
            if (ultimoId !== this.ultimoMensajeId) {
              this.mensajes = mensajesNuevos;
              this.ultimoMensajeId = ultimoId;
              this.debeScrollear = true;
              // Marcamos como leídos los nuevos mensajes recibidos
              this.authService
                .marcarLeidos(this.conversacionActiva!.user_id)
                .subscribe({ error: () => {} });
            }
          },
          error: () => {},
        });
      }
    }, 4000);
  }

  private detenerPolling(): void {
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
    }
  }

  //  Helpers

  private scrollearAbajo(): void {
    try {
      const el = this.mensajesRef?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }

  esMio(msg: Mensaje): boolean {
    return msg.sender_id === this.usuario?.id;
  }

  // Agrupa mensajes por fecha para mostrar separadores
  get mensajesAgrupados(): { fecha: string | null; mensajes: Mensaje[] }[] {
    const grupos: { fecha: string | null; mensajes: Mensaje[] }[] = [];
    let fechaActual: string | null = null;

    this.mensajes.forEach((msg) => {
      const fecha = this.fechaDia(msg.created_at);
      if (fecha !== fechaActual) {
        grupos.push({ fecha, mensajes: [msg] });
        fechaActual = fecha;
      } else {
        grupos[grupos.length - 1].mensajes.push(msg);
      }
    });

    return grupos;
  }

  private fechaDia(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    if (d.toDateString() === hoy.toDateString()) return 'Hoy';
    if (d.toDateString() === ayer.toDateString()) return 'Ayer';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  formatearHora(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatearFechaConversacion(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    const ahora = new Date();
    const diff = ahora.getTime() - d.getTime();

    if (diff < 60_000) return 'ahora';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min`;
    if (diff < 86_400_000)
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }

  get totalNoLeidos(): number {
    return this.conversaciones.reduce((acc, c) => acc + (c.unread ?? 0), 0);
  }

  inicialAvatar(name: string | undefined): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }
}
