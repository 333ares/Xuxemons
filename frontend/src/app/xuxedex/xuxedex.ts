import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from '../shared/icons';

@Component({
  selector: 'app-xuxedex',
  standalone: true,
  imports: [RouterLink],
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
