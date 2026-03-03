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
    canActivate: [AuthGuard],
  },

  // Ruta Perfil del Usuario
  {
    path: 'perfilUsuario',
    component: PerfilUsuario,
    canActivate: [AuthGuard],
  },

  // Ruta Amigos
  {
    path: 'amigos',
    component: Amigos,
    canActivate: [AuthGuard],
  },

  // Ruta Batalla
  {
    path: 'batalla',
    component: Batalla,
    canActivate: [AuthGuard],
  },

  // Ruta Chat
  {
    path: 'chat',
    component: Chat,
    canActivate: [AuthGuard],
  },

  // Ruta Mochila
  {
    path: 'mochila',
    component: Mochila,
    canActivate: [AuthGuard],
  },

  // Ruta Xuxedex
  {
    path: 'xuxedex',
    component: Xuxedex,
    canActivate: [AuthGuard],
  },

  // Si alguien entra a una pagina inexistente lo reedirige al login. (Esto se tiene que dejar al final de las rutas)
  { path: '**', redirectTo: 'login' },
];
