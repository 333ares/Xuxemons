import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-mochila',
  standalone: true,
  imports: [RouterLink, Nav],
  templateUrl: './mochila.html',
  styleUrl: './mochila.css',
})
export class Mochila {

  cargando = true;
  error = '';



 cargarMochila(): void {
    this.cargando = true;
    this.error = '';

    if (MOCK) {
      // Simula un pequeño delay como si fuera la API
      setTimeout(() => {
        this.todosLosSlots = this.calcularSlots(DATOS_PRUEBA);
        this.cargando = false;
      }, 600);
      return;
    }

    const headers = { Authorization: `Bearer ${this.auth.getToken()}` };
    this.http.get<{ message: string; objetos: ItemMochila[] }>(
      `${this.API_URL}/mochila`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.todosLosSlots = this.calcularSlots(res.objetos);
        this.cargando = false;
      },
      error: (err) => {
        if (err.status === 404) {
          // El backend devuelve 404 cuando la mochila está vacía
          this.todosLosSlots = this.calcularSlots([]);
        } else {
          this.error = 'No se ha podido cargar la mochila.';
        }
        this.cargando = false;
      }
    });
  }

}
