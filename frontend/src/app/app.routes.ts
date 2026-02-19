import { Routes } from '@angular/router';
import { PaginaPrincipal } from './pagina-principal/pagina-principal';
import { PerfilComponent } from './perfil/perfil';


export const routes: Routes = [
  {
    path: '',
    component: PaginaPrincipal
  },
  {
    path: 'perfil',
    component: PerfilComponent
  }
];

