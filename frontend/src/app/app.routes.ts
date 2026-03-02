import { Routes } from '@angular/router';
import { PaginaPrincipal } from './pagina-principal/pagina-principal';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { Recuperar } from './recuperar/recuperar';
import { PerfilUsuario } from './perfil-usuario/perfil-usuario';
import { AuthGuard } from './guards/auth-guard';
import { Xuxedex } from './xuxedex/xuxedex';
import { Mochila } from './mochila/mochila';
import { Amigos } from './amigos/amigos';
import { Chat } from './chat/chat';
import { Batalla } from './batalla/batalla';

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
    canActivate: [AuthGuard], // Sirve para proteger la ruta, y que si el usuario no esta validado no pueda entrar a ciertas pantallas
  },

  // Ruta Perfil del Usuario
  {
    path: 'perfilUsuario',
    component: PerfilUsuario,
    canActivate: [AuthGuard],
  },

  // Ruta Xuxedex
  {
    path: 'xuxedex',
    component: Xuxedex,
    canActivate: [AuthGuard],
  },

  // Ruta Mochila
  {
    path: 'mochila',
    component: Mochila,
    canActivate: [AuthGuard],
  },

  // Ruta Amigos
  {
    path: 'amigos',
    component: Amigos,
    canActivate: [AuthGuard],
  },

  // Ruta Chat
  {
    path: 'chat',
    component: Chat,
    canActivate: [AuthGuard],
  },

  // Ruta Batalla
  {
    path: 'batalla',
    component: Batalla,
    canActivate: [AuthGuard],
  },

  // Si alguien entra a una pagina inexistente lo reedirige al login. (Esto se tiene que dejar al final de las rutas)
  { path: '**', redirectTo: 'login' },
];
