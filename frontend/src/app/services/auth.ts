import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Construye las cabeceras con el token JWT para rutas protegidas
  private getHeaders() {
    return {
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    };
  }

  // Envía las credenciales al backend y recibe el token JWT
  login(public_id: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { public_id, password });
  }

  // Registra un nuevo usuario en el backend
  registro(datos: {
    name: string;
    surname: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  // Invalida el token en el backend cerrando la sesión
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers: this.getHeaders() });
  }

  // Guarda el token JWT en localStorage
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtiene el token JWT del localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Elimina el token JWT del localStorage
  eliminarToken(): void {
    localStorage.removeItem('token');
  }

  // Comprueba si hay un token activo en localStorage
  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  // Obtiene los datos del usuario autenticado desde el backend
  getInfoUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`, { headers: this.getHeaders() });
  }

  // Elimina la cuenta del usuario autenticado
  eliminarCuenta(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario`, { headers: this.getHeaders() });
  }

  // Actualiza los datos del usuario autenticado
  actualizarUsuario(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario`, datos, { headers: this.getHeaders() });
  }
}