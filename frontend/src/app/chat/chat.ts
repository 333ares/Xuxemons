import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {}
