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

  // ---  AUTENTICACIÓN ---
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

  // --- LOCAL SOTRAGE ---
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

  // Guarda el usuario en localStorage (AdminGuard)
  guardarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  // Obtiene el usuario del localStorage (AdminGuard)
  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // para cuando se haga logout (AdminGuard)
  eliminarUsuario(): void {
    localStorage.removeItem('usuario');
  }

  // --- USUARIOS ---
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

  // Buscar xuxemons con el navegador
  navXuxemons(nav: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemonsNav?nav=${nav}`, { headers: this.getHeaders() });
  }

  // --- XUXEDEX ---
  getXuxemons(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons?page=${pagina}`, { headers: this.getHeaders() });
  }

  getXuxemonsPorTipo(type: string = '', pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons/tipo?type=${type}&page=${pagina}`, { headers: this.getHeaders() });
  }

  getXuxemonsPorTamano(size: string = '', pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons/tamano?size=${size}&page=${pagina}`, { headers: this.getHeaders() });
  }

  borrarXuxemon(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/xuxemon`, {
      headers: this.getHeaders(),
      body: { id: id }
    });
  }

  alimentarXuxemon(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/xuxemon/alimentar`, { id }, { headers: this.getHeaders() });
  }

  subirNivel(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/xuxemon/subirNivel`, { id }, { headers: this.getHeaders() });
  }

  // --- MOCHILA ---
  getMochila(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/mochila?page=${pagina}`, { headers: this.getHeaders() });
  }

  borrarObjeto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mochila`, {
      headers: this.getHeaders(),
      body: { id: id }
    });
  }

  aplicarVacuna(objetoId: number, xuxemonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mochila/vacuna`, { objeto_id: objetoId, xuxemon_id: xuxemonId }, { headers: this.getHeaders() });
  }

  // --- ADMINISTRACIÓN ---
  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listarUsuarios`, { headers: this.getHeaders() });
  }

  agregarXuxemon(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarXuxemon`, { user_id: userId }, { headers: this.getHeaders() });
  }

  agregarObjeto(datos: { user_id: number; type: string; name: string; amount: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarObjeto`, datos, { headers: this.getHeaders() });
  }
}
