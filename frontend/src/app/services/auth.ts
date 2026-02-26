import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(public_id: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { public_id, password });
  }

  // Guarda el token en localStorage y, si el backend devuelve el usuario, también lo guardamos
  guardarToken(token: string, usuario?: any): void {
    localStorage.setItem('token', token);
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }

  // Devuelve el token guardado, o null si no hay sesión activa
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Comprueba si hay sesión activa
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  // Elimina token y datos del usuario del localStorage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // MÉTODOS PARA EL PERFIL

  // Devuelve el objeto usuario guardado en localStorage tras el login
  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Actualiza los datos del perfil (name, surname, email y opcionalmente password)
  // El id lo sacamos del usuario guardado en localStorage, igual que hace el UserController
  actualizarPerfil(datos: {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
  }): Observable<any> {
    const usuario = this.getUsuario();
    const id = usuario?.id;

    return this.http
      .put(`${this.apiUrl}/usuarios/${id}`, datos, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((res: any) => {
          // Si el servidor devuelve el usuario actualizado, lo guardamos en localStorage
          if (res?.usuario) {
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
          }
        }),
      );
  }

  // Elimina la cuenta del usuario autenticado llamando al borrarUsuario del UserController
  darseDebaja(): Observable<any> {
    const usuario = this.getUsuario();
    const id = usuario?.id;

    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Construye las cabeceras con el token JWT para las peticiones protegidas
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
  }
}
