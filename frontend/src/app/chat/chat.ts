import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Nav } from '../shared/nav/nav';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink, Nav],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {}
