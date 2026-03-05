import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-amigos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './amigos.html',
  styleUrls: ['./amigos.css'],
})
export class Amigos {}
