import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-perfil-admin',
  standalone: true,
  imports: [CommonModule, Nav, RouterLink],
  templateUrl: './perfil-admin.html',
  styleUrl: './perfil-admin.css',
})
export class PerfilAdmin implements OnInit {
  // Datos del administrador cargados desde el backend
  admin: any = null;

  // Controla la visibilidad del diálogo de confirmación de cierre de sesión
  mostrarDialogoSesion: boolean = false;

  constructor(
    private router: Router,
    private authService: Auth,
  ) {}

  ngOnInit() {
    // Cargamos los datos del admin autenticado mediante el token JWT almacenado
    this.authService.getInfoUsuario().subscribe({
      next: (res) => {
        this.admin = res.usuario;

        // Si el usuario que cargó no tiene id === 1, no es el admin real:
        // lo redirigimos a su perfil de jugador para evitar accesos no autorizados
        if (this.admin?.id !== 1) {
          this.router.navigate(['/perfil']);
        }
      },
      error: () => {
        // Token expirado o inválido → redirigimos al login
        this.router.navigate(['/login']);
      },
    });
  }

  // Gestión de cierre de sesión

  cerrarSesion() {
    this.mostrarDialogoSesion = true;
  }

  cerrarDialogoSesion() {
    this.mostrarDialogoSesion = false;
  }

  confirmarCierreSesion() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.eliminarToken();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Aunque el backend falle, eliminamos el token local igualmente
        this.authService.eliminarToken();
        this.router.navigate(['/login']);
      },
    });
  }
}
