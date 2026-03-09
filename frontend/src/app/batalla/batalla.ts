import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-batalla',
  standalone: true,
  imports: [RouterLink , Nav],
  templateUrl: './batalla.html',
  styleUrl: './batalla.css',
})
export class Batalla {}
