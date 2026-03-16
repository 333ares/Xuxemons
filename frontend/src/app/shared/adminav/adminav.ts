import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from '../icons';

@Component({
  selector: 'app-adminav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './adminav.html',
  styleUrl: './adminav.css',
})
export class Adminav {
  icons: Record<string, SafeHtml> = {};

  constructor(private sanitizer: DomSanitizer) {
    Object.keys(ICONS).forEach((key) => {
      this.icons[key] = this.sanitizer.bypassSecurityTrustHtml(ICONS[key]);
    });
  }
}
