import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about-us.component.html',
  styles: ``
})
export class AboutUsComponent {
  // Données statiques tourisme - aucun appel CNAAS
}
