import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blogs-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './blogs-sidebar.component.html',
  styles: ``
})
export class BlogsSidebarComponent {

  recentPosts = [
    {
      image: 'assets/images/tourisme/excursion_goree_1781800606230.png',
      title: 'Conseils pour visiter l\'Île de Gorée',
      date: '10 Mars 2025'
    },
    {
      image: 'assets/images/tourisme/excursion_casamance_1781800557434.png',
      title: 'Hivernage 2025 : Préparer votre voyage',
      date: '25 Fév 2025'
    },
    {
      image: 'assets/images/tourisme/excursion_safari_1781800561571.png',
      title: 'Nouveaux circuits Safari disponibles',
      date: '15 Fév 2025'
    }
  ];

  reseauxSociaux = [
    { reseau: 'Facebook', url: '#', icon: 'fab fa-facebook-f' },
    { reseau: 'Instagram', url: '#', icon: 'fab fa-instagram' },
    { reseau: 'LinkedIn', url: '#', icon: 'fab fa-linkedin-in' },
    { reseau: 'X (Twitter)', url: '#', icon: 'fa-brands fa-x-twitter' }
  ];

  getSocialIcon(rs: any): string {
    return rs.icon || 'fa-solid fa-link';
  }
}
