import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ICONS } from '../shared/icons';
import { Nav } from '../shared/nav/nav';
export interface Xuxemon {
  id: number;
  name: string;
  type: 'agua' | 'tierra' | 'aire';
  size: 's' | 'm' | 'g';
  sickness: string | number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface XuxemonGrupo {
  nombre: string;
  type: 'agua' | 'tierra' | 'aire';
  cantidad: number;
  xuxemons: Xuxemon[];
  representante: Xuxemon;
}

@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [RouterLink, Nav],
  templateUrl: './xuxedex.html',
  styleUrl: './xuxedex.css',
})
export class Xuxedex {
  icons: Record<string, SafeHtml> = {};

  constructor(private sanitizer: DomSanitizer) {
    Object.keys(ICONS).forEach((key) => {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(ICONS[key]);
    });
  }
}
