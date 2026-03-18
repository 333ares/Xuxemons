import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgregarXuxemon } from '../agregar-xuxemon/agregar-xuxemon';
import { AgregarObjeto } from '../agregar-objeto/agregar-objeto';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, AgregarXuxemon, AgregarObjeto],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css'],
})
export class GestionUsuarios implements OnInit {
  usuarios: any[] = [];
  terminoBusqueda: string = '';
  usuariosFiltrados: any[] = [];
  paginaActual: number = 1;
  usuariosPorPagina: number = 8;
  modalXuxemonAbierto: boolean = false;
  modalObjetoAbierto: boolean = false;
  usuarioSeleccionado: any = null;
  cargando = true;
  error = '';

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Carga los usuarios desde el backend
  cargarUsuarios(): void {
    this.cargando = true;
    this.auth.listarUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res.usuarios;
        this.usuariosFiltrados = [...this.usuarios];
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.errors ?? 'Error al cargar los usuarios.';
        this.cargando = false;
      }
    });
  }

  // Filtra la lista local
  filtrarUsuarios(): void {
    const t = this.terminoBusqueda.toLowerCase().trim();
    this.paginaActual = 1;

    if (!t) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(
      (u) =>
        u.name?.toLowerCase().includes(t) ||
        u.surname?.toLowerCase().includes(t) ||
        u.email?.toLowerCase().includes(t) ||
        u.public_id?.toLowerCase().includes(t),
    );
  }

  // Paginación
  get totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.usuariosPorPagina);
  }

  get usuariosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    return this.usuariosFiltrados.slice(inicio, inicio + this.usuariosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  // Modales
  abrirModalXuxemon(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.modalXuxemonAbierto = true;
  }

  abrirModalObjeto(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.modalObjetoAbierto = true;
  }

  cerrarModales(): void {
    this.modalXuxemonAbierto = false;
    this.modalObjetoAbierto = false;
    this.usuarioSeleccionado = null;
  }

  toggleActivo(usuario: any): void {
    usuario.activo = !usuario.activo;
    // TODO: llamar al backend cuando esté disponible
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.filtrarUsuarios();
  }
}