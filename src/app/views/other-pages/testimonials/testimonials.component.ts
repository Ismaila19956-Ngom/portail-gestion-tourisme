import { Component } from '@angular/core';
import { BreadcrumbComponent } from "@app/components/breadcrumb/breadcrumb.component";
import type { TestimonialType } from '@/types';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "@app/components/pagination/pagination.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-testimonials',
    imports: [BreadcrumbComponent, CommonModule, PaginationComponent,RouterModule],
    templateUrl: './testimonials.component.html',
    styles: ``
})
export class TestimonialsComponent {
    testimonials:TestimonialType[] = [
        {
            image: 'assets/img/all-images/testimonial-img11.png',
            name: 'Ousmane Diallo',
            role: 'Agriculteur â€” Kaolack',
            description: 'Grâce Ã  la Sénégal Excursions, j\'ai été indemnisé rapidement après la sécheresse de 2024. Sans cette assurance, j\'aurais tout perdu. Je recommande Ã  tous les agriculteurs sénégalais de souscrire avant l\'hivernage.',
        },
        {
            image: 'assets/img/all-images/testimonial-img12.png',
            name: 'Mariama Sarr',
            role: 'Éleveuse â€” Louga',
            description: 'L\'assurance bétail Sénégal Excursions m\'a sauvée lorsque la fièvre aphteuse a décimé mon troupeau. L\'indemnisation a été rapide et le montant suffisant pour racheter de nouveaux animaux. Merci Sénégal Excursions.',
        },
        {
            image: 'assets/img/all-images/testimonial-img13.png',
            name: 'Ibrahima Faye',
            role: 'Maraîcher â€” Thiès',
            description: 'Je cultive des tomates et des oignons depuis 15 ans. Depuis que j\'ai souscrit Ã  l\'assurance horticulture Sénégal Excursions, je travaille avec plus de sérénité face aux inondations et aux parasites.',
        },
        {
            image: 'assets/img/all-images/testimonial-img15.png',
            name: 'Aminata Ndiaye',
            role: 'Avicultrice â€” Dakar',
            description: 'J\'ai perdu 500 poulets Ã  cause d\'une épidémie. La Sénégal Excursions a couvert mes pertes en moins de 15 jours. Le processus était simple, transparent et sans tracasseries. Je suis pleinement satisfaite.',
        },
        {
            image: 'assets/img/all-images/testimonial-img16.png',
            name: 'Moussa Baldé',
            role: 'Riziculteur â€” Ziguinchor',
            description: 'L\'assurance indicielle récolte Sénégal Excursions est révolutionnaire pour notre région. Pas besoin d\'attendre un expert â€” l\'indemnisation se déclenche automatiquement quand la pluviométrie descend sous le seuil.',
        },
        {
            image: 'assets/img/all-images/testimonial-img17.png',
            name: 'Fatou Diop',
            role: 'Agricultrice â€” Diourbel',
            description: 'J\'ai souscrit pour la première fois cette année. L\'agent Sénégal Excursions de notre zone a tout expliqué clairement. Le prix est abordable et la couverture est excellente pour mes cultures d\'arachide.',
        },
        {
            image: 'assets/img/all-images/testimonial-img18.png',
            name: 'Cheikh Mbaye',
            role: 'Chef de coopérative â€” Saint-Louis',
            description: 'Notre coopérative regroupe 120 agriculteurs. Nous avons tous souscrit Ã  la Sénégal Excursions collectivement. Le tarif de groupe est avantageux et le suivi de l\'équipe Sénégal Excursions est exemplaire.',
        },
        {
            image: 'assets/img/all-images/testimonial-img19.png',
            name: 'Rokhaya Sow',
            role: 'Arboricultrice â€” Kolda',
            description: 'Mes vergers de mangues représentent l\'essentiel de mes revenus. L\'assurance arboriculture Sénégal Excursions me protège contre les cyclones et les maladies fongiques. Je dors tranquille chaque saison.',
        },
        {
            image: 'assets/img/all-images/testimonial-img20.png',
            name: 'Lamine Traoré',
            role: 'Agro-éleveur â€” Tambacounda',
            description: 'En tant qu\'agro-éleveur, j\'ai souscrit Ã  la fois Ã  l\'assurance récolte et Ã  l\'assurance bétail Sénégal Excursions. C\'est une double protection qui me permet d\'investir avec confiance dans mon exploitation.',
        }
    ]
}
