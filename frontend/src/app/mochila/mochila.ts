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
export class Mochila {}
