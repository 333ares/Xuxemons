import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgregarXuxemon } from '../agregar-xuxemon/agregar-xuxemon';
import { AgregarObjeto } from '../agregar-objeto/agregar-objeto';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, AgregarXuxemon, AgregarObjeto],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css'],
})
export class GestionUsuarios implements OnInit {
  // Lista completa de usuarios — se cargará desde AdminController::listarUsuarios
  usuarios: any[] = [
    {
      id: 2,
      public_id: '#Ares0002',
      name: 'Ares',
      surname: 'Gómez Pacheco',
      email: 'ares@example.com',
      xuxemons: 7,
      objetos: 14,
      activo: true,
    },
    {
      id: 3,
      public_id: '#Deivid0003',
      name: 'Deivid',
      surname: 'Anderson Martinez',
      email: 'deivid@example.com',
      xuxemons: 18,
      objetos: 3,
      activo: true,
    },
    {
      id: 4,
      public_id: '#Olaya0004',
      name: 'Olaya',
      surname: 'Baa Bidane',
      email: 'olaya@example.com',
      xuxemons: 5,
      objetos: 20,
      activo: true,
    },
    {
      id: 5,
      public_id: '#Thornalune0005',
      name: 'Thornalune',
      surname: '',
      email: 'thorn@example.com',
      xuxemons: 11,
      objetos: 6,
      activo: true,
    },
    {
      id: 6,
      public_id: '#Dracibright0006',
      name: 'Dracibright',
      surname: '',
      email: 'draci@example.com',
      xuxemons: 23,
      objetos: 9,
      activo: false,
    },
    {
      id: 7,
      public_id: '#Snowhale0007',
      name: 'Snowhale',
      surname: '',
      email: 'snow@example.com',
      xuxemons: 4,
      objetos: 17,
      activo: true,
    },
    {
      id: 8,
      public_id: '#Lumivex0008',
      name: 'Lumivex',
      surname: '',
      email: 'lumi@example.com',
      xuxemons: 9,
      objetos: 11,
      activo: false,
    },
    {
      id: 9,
      public_id: '#Kira0009',
      name: 'Kira',
      surname: 'Solís',
      email: 'kira@example.com',
      xuxemons: 14,
      objetos: 5,
      activo: true,
    },
    {
      id: 10,
      public_id: '#Zafar0010',
      name: 'Zafar',
      surname: 'Ibáñez',
      email: 'zafar@example.com',
      xuxemons: 2,
      objetos: 8,
      activo: true,
    },
    {
      id: 11,
      public_id: '#Vael0011',
      name: 'Vael',
      surname: 'Mora',
      email: 'vael@example.com',
      xuxemons: 30,
      objetos: 0,
      activo: true,
    },
  ];

  // Búsqueda — filtra en cliente sobre los datos ya cargados
  terminoBusqueda: string = '';
  usuariosFiltrados: any[] = [];

  // Paginación
  paginaActual: number = 1;
  usuariosPorPagina: number = 8;

  // Modales
  modalXuxemonAbierto: boolean = false;
  modalObjetoAbierto: boolean = false;
  usuarioSeleccionado: any = null;

  ngOnInit(): void {
    this.usuariosFiltrados = [...this.usuarios];
    // TODO: llamar a AdminService.listarUsuarios() y asignar a this.usuarios
  }

  // Filtra la lista local. Si se necesita búsqueda en backend usar AdminController::navegadorUsuarios
  filtrarUsuarios(): void {
    const t = this.terminoBusqueda.toLowerCase().trim();
    this.paginaActual = 1;

    if (!t) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(
      (u) =>
        u.name.toLowerCase().includes(t) ||
        u.surname.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t) ||
        u.public_id.toLowerCase().includes(t),
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

  // Activar / desactivar usuario
  // La lógica real se delega al backend aquí solo se actualiza el estado local
  toggleActivo(usuario: any): void {
    usuario.activo = !usuario.activo;
    // TODO: llamar a AdminService.toggleUsuarioActivo(usuario.id)
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.filtrarUsuarios();
  }
}
