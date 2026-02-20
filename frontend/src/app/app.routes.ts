import { Routes } from '@angular/router';
import { PaginaPrincipal } from './pagina-principal/pagina-principal';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { Recuperar } from './recuperar/recuperar';

export const routes: Routes = [
  // Reedireccion automatica a Login
  { path: '',
    redirectTo: 'login',
    pathMatch: 'full' //Solo aplica si es / (Eso significa que si el / tiene algo mas detras no reedirigiria a Login)
  },

  // Si alguien entra a una pagina inexistente lo reedirige al login.
  { path: '**',
    redirectTo: 'login'
  },

  // Ruta Login
  { path: 'login',
    component: Login
  },

  // Ruta Registro
  { path: 'registro',
    component: Registro
  },

  // Ruta Recuperar
  { path: 'recuperar',
    component: Recuperar
  },

  // Ruta Pagina Principal
  {
    path: '',
    component: PaginaPrincipal
  }
];
