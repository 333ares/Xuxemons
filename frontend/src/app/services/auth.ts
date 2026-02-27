import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /// Envía las credenciales al backend y recibe el token JWT
  login(public_id: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { public_id, password });
  }

  // Guarda el token JWT en localStorage
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Guarda los datos del usuario en localStorage como JSON
  guardarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  // Obtiene el token JWT del localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}