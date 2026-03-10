import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-amigos',
  standalone: true,
  imports: [RouterLink, Nav],
  templateUrl: './amigos.html',
  styleUrls: ['./amigos.css'],
})
export class Amigos {}
