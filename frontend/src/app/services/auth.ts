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
  private obtenerCabeceras() {
    return {
      Authorization: `Bearer ${this.obtenerToken()}`,
      'Content-Type': 'application/json',
    };
  }

  // --- AUTENTICACIÓN ---

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
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers: this.obtenerCabeceras() });
  }

  // --- LOCAL STORAGE ---

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  eliminarToken(): void {
    localStorage.removeItem('token');
  }

  // Guarda el usuario en localStorage (AdminGuard)
  guardarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  eliminarUsuario(): void {
    localStorage.removeItem('usuario');
  }

  // --- USUARIOS ---

  // GET /usuario — datos del usuario autenticado
  getInfoUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario`, { headers: this.obtenerCabeceras() });
  }

  // DELETE /usuario — elimina la cuenta del usuario autenticado
  eliminarCuenta(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario`, { headers: this.obtenerCabeceras() });
  }

  // PUT /usuario — actualiza los datos del usuario autenticado
  actualizarUsuario(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario`, datos, { headers: this.obtenerCabeceras() });
  }

  // GET /xuxemonsNav — búsqueda de Xuxemons por nombre (buscador)
  navXuxemons(nav: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemonsNav?nav=${nav}`, { headers: this.obtenerCabeceras() });
  }

  // --- XUXEDEX ---

  // GET /xuxemons — lista paginada de Xuxemons del usuario
  obtenerXuxemons(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons?page=${pagina}`, { headers: this.obtenerCabeceras() });
  }

  // GET /xuxemons/tipo — filtra por tipo (agua / tierra / aire)
  getXuxemonsPorTipo(type: string = '', pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons/tipo?type=${type}&page=${pagina}`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // GET /xuxemons/tamano — filtra por tamaño (s / m / g)
  getXuxemonsPorTamano(size: string = '', pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons/tamano?size=${size}&page=${pagina}`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // DELETE /xuxemon — elimina un Xuxemon por id
  borrarXuxemon(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/xuxemon`, {
      headers: this.obtenerCabeceras(),
      body: { id },
    });
  }

  // POST /xuxemon/alimentar — da una xuxe al Xuxemon; puede provocar infección
  alimentarXuxemon(id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/xuxemon/alimentar`,
      { id },
      { headers: this.obtenerCabeceras() },
    );
  }

  // POST /xuxemon/curar — aplica una vacuna de la mochila a un Xuxemon enfermo
  // NOTA: ruta existente en backend. El front anterior la llamaba /mochila/aplicarVacuna (incorrecto).
  curarXuxemon(mochilaId: number, xuxemonId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/xuxemon/curar`,
      { mochila_id: mochilaId, xuxemon_id: xuxemonId },
      { headers: this.obtenerCabeceras() },
    );
  }

  // POST /xuxemon/subirNivel — sube de nivel al Xuxemon (s→m o m→g)
  // NOTA: pendiente de implementación en backend. La ruta aún no existe en api.php.
  subirNivel(id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/xuxemon/subirNivel`,
      { id },
      { headers: this.obtenerCabeceras() },
    );
  }

  // --- MOCHILA ---

  // GET /mochila — lista paginada de objetos del usuario
  obtenerMochila(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/mochila?page=${pagina}`, { headers: this.obtenerCabeceras() });
  }

  // DELETE /mochila — elimina (o resta una unidad de) un objeto por id
  borrarObjeto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mochila`, {
      headers: this.obtenerCabeceras(),
      body: { id },
    });
  }

  // --- ADMINISTRACIÓN ---

  // GET /listarUsuarios — KPIs globales + lista de usuarios (solo admin)
  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listarUsuarios`, { headers: this.obtenerCabeceras() });
  }

  // POST /agregarXuxemon — asigna un Xuxemon aleatorio a un usuario
  agregarXuxemon(userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/agregarXuxemon`,
      { user_id: userId },
      { headers: this.obtenerCabeceras() },
    );
  }

  // POST /agregarObjeto — añade un objeto a la mochila de un usuario
  agregarObjeto(datos: {
    user_id: number;
    type: string;
    name: string;
    amount: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarObjeto`, datos, { headers: this.obtenerCabeceras() });
  }

  // POST /xuxes-diarias — lanza el reparto diario de xuxes a todos los usuarios
  // NOTA: ruta existente en backend. El front anterior no tenía ningún método para llamarla.
  xuxesDiarias(datos: { hora: string; cantidad: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/xuxes-diarias`, datos, { headers: this.obtenerCabeceras() });
  }

  // --- ADMINISTRACIÓN: configuración (pendiente backend) ---
  // Estos tres bloques de rutas aún no existen en api.php.
  // Se mantienen en el servicio para que el componente funcione en cuanto el backend las implemente.

  // GET /admin/infectionRates — obtiene los porcentajes de infección configurados
  obtenerTasasInfeccion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/infectionRates`, { headers: this.obtenerCabeceras() });
  }

  // PUT /admin/infectionRates — actualiza los porcentajes de infección
  actualizarTasasInfeccion(data: {
    bajon: number;
    sobredosis: number;
    atracon: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/infectionRates`, data, {
      headers: this.obtenerCabeceras(),
    });
  }

  // GET /admin/dailyConfig — obtiene la configuración de reparto diario
  obtenerConfigDiaria(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dailyConfig`, { headers: this.obtenerCabeceras() });
  }

  // PUT /admin/dailyConfig — actualiza la configuración de reparto diario
  actualizarConfigDiaria(data: {
    xuxes?: { hora: string; cantidad: number };
    xuxemons?: { hora: string; cantidad: number };
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/dailyConfig`, data, { headers: this.obtenerCabeceras() });
  }

  // GET /admin/growthConfig — obtiene las xuxes necesarias para crecer
  obtenerConfigCrecimiento(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/growthConfig`, { headers: this.obtenerCabeceras() });
  }

  // PUT /admin/growthConfig — actualiza las xuxes necesarias para crecer
  actualizarConfigCrecimiento(data: {
    pequeno_a_mediano: number;
    mediano_a_grande: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/growthConfig`, data, {
      headers: this.obtenerCabeceras(),
    });
  }
}
