import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  eliminarToken(): void {
    localStorage.removeItem('token');
  }

  // Guarda el usuario en localStorage (AdminGuard)
  guardarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  eliminarUsuario(): void {
    localStorage.removeItem('usuario');
  }

  // --- USUARIOS ---

  // GET /usuario — datos del usuario autenticado
  getInfoUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`, { headers: this.getHeaders() });
  }

  // DELETE /usuario — elimina la cuenta del usuario autenticado
  eliminarCuenta(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario`, { headers: this.getHeaders() });
  }

  // PUT /usuario — actualiza los datos del usuario autenticado
  actualizarUsuario(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario`, datos, { headers: this.getHeaders() });
  }

  // GET /xuxemonsNav — búsqueda de Xuxemons por nombre (buscador)
  navXuxemons(nav: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemonsNav?nav=${nav}`, { headers: this.getHeaders() });
  }

  // --- XUXEDEX ---

  // GET /xuxemons — lista paginada de Xuxemons del usuario
  getXuxemons(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons?page=${pagina}`, { headers: this.getHeaders() });
  }

  // GET /xuxemons/tipo — filtra por tipo (agua / tierra / aire)
  getXuxemonsPorTipo(type: string = '', pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons/tipo?type=${type}&page=${pagina}`, {
      headers: this.getHeaders(),
    });
  }

  // GET /xuxemons/tamano — filtra por tamaño (s / m / g)
  getXuxemonsPorTamano(size: string = '', pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons/tamano?size=${size}&page=${pagina}`, {
      headers: this.getHeaders(),
    });
  }

  // DELETE /xuxemon — elimina un Xuxemon por id
  borrarXuxemon(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/xuxemon`, {
      headers: this.getHeaders(),
      body: { id },
    });
  }

  // POST /xuxemon/alimentar — da una xuxe al Xuxemon; puede provocar infección
  alimentarXuxemon(id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/xuxemon/alimentar`,
      { id },
      { headers: this.getHeaders() },
    );
  }

  // POST /xuxemon/subirNivel — sube de nivel al Xuxemon (s→m o m→g)
  subirNivel(id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/xuxemon/subirNivel`,
      { id },
      { headers: this.getHeaders() },
    );
  }

  // --- MOCHILA ---

  // GET /mochila — lista paginada de objetos del usuario
  getMochila(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/mochila?page=${pagina}`, { headers: this.getHeaders() });
  }

  // DELETE /mochila — elimina (o resta una unidad de) un objeto por id
  borrarObjeto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mochila`, {
      headers: this.getHeaders(),
      body: { id },
    });
  }

  // POST /mochila/aplicarVacuna — aplica una vacuna de la mochila a un Xuxemon enfermo
  aplicarVacuna(mochilaId: number, xuxemonId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/mochila/aplicarVacuna`,
      { mochila_id: mochilaId, xuxemon_id: xuxemonId },
      { headers: this.getHeaders() },
    );
  }

  // --- ADMINISTRACIÓN ---

  // GET /listarUsuarios — KPIs globales + lista de usuarios (solo admin)
  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listarUsuarios`, { headers: this.getHeaders() });
  }

  // POST /agregarXuxemon — asigna un Xuxemon aleatorio a un usuario
  agregarXuxemon(userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/agregarXuxemon`,
      { user_id: userId },
      { headers: this.getHeaders() },
    );
  }

  // POST /agregarObjeto — añade un objeto a la mochila de un usuario
  agregarObjeto(datos: {
    user_id: number;
    type: string;
    name: string;
    amount: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarObjeto`, datos, { headers: this.getHeaders() });
  }

  // GET /admin/infectionRates — obtiene los porcentajes de infección configurados
  getInfectionRates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/infectionRates`, { headers: this.getHeaders() });
  }

  // PUT /admin/infectionRates — actualiza los porcentajes de infección
  updateInfectionRates(data: {
    bajon: number;
    sobredosis: number;
    atracon: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/infectionRates`, data, {
      headers: this.getHeaders(),
    });
  }

  // GET /admin/dailyConfig — obtiene la configuración de reparto diario
  getDailyConfig(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dailyConfig`, { headers: this.getHeaders() });
  }

  // PUT /admin/dailyConfig — actualiza la configuración de reparto diario
  updateDailyConfig(data: {
    xuxes?: { hora: string; cantidad: number };
    xuxemons?: { hora: string; cantidad: number };
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/dailyConfig`, data, { headers: this.getHeaders() });
  }
}
