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

  login(public_id: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { public_id, password });
  }

  registro(datos: {
    name: string;
    surname: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

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

  // GET /usuarios — lista pública de todos los usuarios (id, name, surname, public_id)
  obtenerTodosUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`, { headers: this.obtenerCabeceras() });
  }

  // GET /xuxemonsNav — búsqueda de Xuxemons por nombre (buscador)
  navXuxemons(nav: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemonsNav?nav=${nav}`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // --- XUXEDEX ---

  // GET /xuxemons — lista paginada de Xuxemons del usuario
  obtenerXuxemons(pagina: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/xuxemons?page=${pagina}`, {
      headers: this.obtenerCabeceras(),
    });
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
  curarXuxemon(mochilaId: number, xuxemonId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/xuxemon/curar`,
      { mochila_id: mochilaId, xuxemon_id: xuxemonId },
      { headers: this.obtenerCabeceras() },
    );
  }

  // POST /xuxemon/subirNivel — sube de nivel al Xuxemon (s→m o m→g)
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
    return this.http.get(`${this.apiUrl}/mochila?page=${pagina}`, {
      headers: this.obtenerCabeceras(),
    });
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
    return this.http.post(`${this.apiUrl}/agregarObjeto`, datos, {
      headers: this.obtenerCabeceras(),
    });
  }

  // GET /config-diaria — configuración de recompensas diarias (solo admin)
  obtenerConfigDiaria(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config-diaria`, { headers: this.obtenerCabeceras() });
  }

  // POST /xuxes-diarias — actualiza config xuxes diarias
  actualizarConfigXuxes(data: { hora: string; cantidad: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/xuxes-diarias`, data, {
      headers: this.obtenerCabeceras(),
    });
  }

  // POST /xuxemon-diario — actualiza config xuxemons diarios
  actualizarConfigXuxemons(data: { hora: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/xuxemon-diario`, data, {
      headers: this.obtenerCabeceras(),
    });
  }

  // PUT /config-alimentar — actualiza las tasas de infección / crecimiento
  actualizarTasasInfeccion(data: {
    bajon: number;
    sobredosis: number;
    atracon: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/config-alimentar`, data, {
      headers: this.obtenerCabeceras(),
    });
  }

  actualizarConfigCrecimiento(data: {
    pequeno_a_mediano: number;
    mediano_a_grande: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/config-alimentar`, data, {
      headers: this.obtenerCabeceras(),
    });
  }

  obtenerTasasInfeccion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config-alimentar`, { headers: this.obtenerCabeceras() });
  }

  obtenerConfigCrecimiento(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config-alimentar`, { headers: this.obtenerCabeceras() });
  }

  // POST /reset-config-xuxes — resetea la última entrega de xuxes
  resetConfigXuxes(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reset-config-xuxes`,
      {},
      { headers: this.obtenerCabeceras() },
    );
  }

  // POST /reset-config-xuxemons — resetea la última entrega de xuxemons
  resetConfigXuxemons(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reset-config-xuxemons`,
      {},
      { headers: this.obtenerCabeceras() },
    );
  }

  // --- AMIGOS ---

  // POST /amigos/solicitud — envía una solicitud de amistad al usuario indicado
  enviarSolicitud(receiverId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/amigos/solicitud`,
      { receiver_id: receiverId },
      { headers: this.obtenerCabeceras() },
    );
  }

  // GET /amigos/solicitudes — lista las solicitudes de amistad recibidas y pendientes
  obtenerSolicitudesPendientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/amigos/solicitudes`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // POST /amigos/aceptar — acepta una solicitud de amistad por su id
  aceptarSolicitud(friendshipId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/amigos/aceptar`,
      { friendship_id: friendshipId },
      { headers: this.obtenerCabeceras() },
    );
  }

  // DELETE /amigos/rechazar — rechaza una solicitud de amistad por su id
  rechazarSolicitud(friendshipId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/amigos/rechazar`, {
      headers: this.obtenerCabeceras(),
      body: { friendship_id: friendshipId },
    });
  }

  // GET /amigos — lista los amigos aceptados del usuario autenticado
  obtenerAmigos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/amigos`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // DELETE /amigos/{id} — elimina un amigo por su id de relación
  eliminarAmigo(friendshipId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/amigos/${friendshipId}`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // --- BATALLAS ---

  // POST /batallas/solicitud — envía un reto de batalla al usuario indicado
  enviarRetoBatalla(receiverId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/batallas/solicitud`,
      { receiver_id: receiverId },
      { headers: this.obtenerCabeceras() },
    );
  }

  // GET /batallas/solicitudes — lista los retos de batalla recibidos y pendientes
  obtenerRetosBatalla(): Observable<any> {
    return this.http.get(`${this.apiUrl}/batallas/solicitudes`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // POST /batallas/aceptar — acepta un reto de batalla por su id
  aceptarRetoBatalla(retoId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/batallas/aceptar`,
      { reto_id: retoId },
      { headers: this.obtenerCabeceras() },
    );
  }

  // DELETE /batallas/rechazar — rechaza un reto de batalla por su id
  rechazarRetoBatalla(retoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/batallas/rechazar`, {
      headers: this.obtenerCabeceras(),
      body: { reto_id: retoId },
    });
  }

  // --- CHAT ---

  // GET /chat/conversaciones — lista de amigos con último mensaje y no leídos
  listarConversaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/conversaciones`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // GET /chat/mensajes/{userId} — historial de mensajes con un usuario
  listarMensajes(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/mensajes/${userId}`, {
      headers: this.obtenerCabeceras(),
    });
  }

  // POST /chat/mensaje — envía un mensaje a un usuario
  enviarMensaje(receiverId: number, content: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/chat/mensaje`,
      { receiver_id: receiverId, content },
      { headers: this.obtenerCabeceras() },
    );
  }

  // PUT /chat/leidos/{userId} — marca como leídos los mensajes de userId
  marcarLeidos(userId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/chat/leidos/${userId}`,
      {},
      { headers: this.obtenerCabeceras() },
    );
  }
}
