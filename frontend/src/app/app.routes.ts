import { Routes } from '@angular/router';
import { PaginaPrincipal } from './pagina-principal/pagina-principal';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { Recuperar } from './recuperar/recuperar';
import { PerfilUsuario } from './perfil-usuario/perfil-usuario';
import { AuthGuard } from './guards/auth-guard';
import { Amigos } from './amigos/amigos';
import { Batalla } from './batalla/batalla';
import { Chat } from './chat/chat';
import { Mochila } from './mochila/mochila';
import { Xuxedex } from './xuxedex/xuxedex';
import { PerfilAdmin } from './perfil-admin/perfil-admin';
import { DashboardAdmin } from './dashboard-admin/dashboard-admin';
import { GestionUsuarios } from './gestion-usuarios/gestion-usuarios';
import { AgregarXuxemon } from './agregar-xuxemon/agregar-xuxemon';
import { AgregarObjeto } from './agregar-objeto/agregar-objeto';
import { Parametros } from './parametros/parametros';
import { Estadisticas } from './estadisticas/estadisticas';
import { GestionUsuariosPage } from './gestion-usuarios-page/gestion-usuarios-page';
import { AdminGuard } from './guards/admin-guard';
import { GeneracionDiaria } from './generacion-diaria/generacion-diaria';
import { ProbabilidadInfeccion } from './probabilidad-infeccion/probabilidad-infeccion';
import { CrecimientoXuxemons } from './crecimiento-xuxemons/crecimiento-xuxemons';
import { UserGuard } from './guards/user-guard';

export const routes: Routes = [
  // Reedireccion automatica a Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full', //Solo aplica si es / (Eso significa que si el / tiene algo mas detras no reedirigiria a Login)
  },

  // Ruta Login
  { path: 'login', component: Login },

  // Ruta Registro
  { path: 'registro', component: Registro },

  // Ruta Recuperar
  { path: 'recuperar', component: Recuperar },

  // Ruta Pagina Principal
  {
    path: 'paginaPrincipal',
    component: PaginaPrincipal,
    canActivate: [AuthGuard, UserGuard],
  },

  // Ruta Perfil del Usuario
  {
    path: 'perfilUsuario',
    component: PerfilUsuario,
    canActivate: [AuthGuard, UserGuard],
  },

  // Ruta Amigos
  {
    path: 'amigos',
    component: Amigos,
    canActivate: [AuthGuard, UserGuard],
  },

  // Ruta Batalla
  {
    path: 'batalla',
    component: Batalla,
    canActivate: [AuthGuard, UserGuard],
  },

  // Ruta Chat
  {
    path: 'chat',
    component: Chat,
    canActivate: [AuthGuard, UserGuard],
  },

  // Ruta Mochila
  {
    path: 'mochila',
    component: Mochila,
    canActivate: [AuthGuard, UserGuard],
  },

  // Ruta Xuxedex
  {
    path: 'xuxedex',
    component: Xuxedex,
    canActivate: [AuthGuard, UserGuard],
  },

  // Ruta Perfil del Administrador
  {
    path: 'perfilAdmin',
    component: PerfilAdmin,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Pagina Principal del administrador
  {
    path: 'dashboardAdmin',
    component: DashboardAdmin,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Gestion de Usuarios
  {
    path: 'gestionUsuarios',
    component: GestionUsuariosPage,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Agregar Xuxemons
  {
    path: 'agregarXuxemnon',
    component: AgregarXuxemon,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Agregar Objeto
  {
    path: 'agregarObjeto',
    component: AgregarObjeto,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Parametros del Juego
  {
    path: 'parametros',
    component: Parametros,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Estadísticas Globales
  {
    path: 'estadisticas',
    component: Estadisticas,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Generación diaria de recompensas del Admin
  {
    path: 'generacionDiaria',
    component: GeneracionDiaria,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Probabilidad de infecciones del Admin
  {
    path: 'probabilidadInfeccion',
    component: ProbabilidadInfeccion,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Ruta Crecimiento Xuxemons del Admin
  {
    path: 'crecimientoXuxemons',
    component: CrecimientoXuxemons,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Si alguien entra a una pagina inexistente lo reedirige al login. (Esto se tiene que dejar al final de las rutas)
  { path: '**', redirectTo: 'login' },
];
