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
            role: 'Agriculteur — Kaolack',
            description: 'Gr�ce à la Sénégal Excursions, j\'ai �t� indemnis� rapidement apr�s la s�cheresse de 2024. Sans cette assurance, j\'aurais tout perdu. Je recommande à tous les agriculteurs s�n�galais de souscrire avant l\'hivernage.',
        },
        {
            image: 'assets/img/all-images/testimonial-img12.png',
            name: 'Mariama Sarr',
            role: '�leveuse — Louga',
            description: 'L\'assurance bétail Sénégal Excursions m\'a sauv�e lorsque la fi�vre aphteuse a d�cim� mon troupeau. L\'indemnisation a �t� rapide et le montant suffisant pour racheter de nouveaux animaux. Merci Sénégal Excursions.',
        },
        {
            image: 'assets/img/all-images/testimonial-img13.png',
            name: 'Ibrahima Faye',
            role: 'Mara�cher — Thi�s',
            description: 'Je cultive des tomates et des oignons depuis 15 ans. Depuis que j\'ai souscrit à l\'assurance horticulture Sénégal Excursions, je travaille avec plus de s�r�nit� face aux inondations et aux parasites.',
        },
        {
            image: 'assets/img/all-images/testimonial-img15.png',
            name: 'Aminata Ndiaye',
            role: 'Avicultrice — Dakar',
            description: 'J\'ai perdu 500 poulets à cause d\'une �pid�mie. La Sénégal Excursions a couvert mes pertes en moins de 15 jours. Le processus �tait simple, transparent et sans tracasseries. Je suis pleinement satisfaite.',
        },
        {
            image: 'assets/img/all-images/testimonial-img16.png',
            name: 'Moussa Bald�',
            role: 'Riziculteur — Ziguinchor',
            description: 'L\'assurance indicielle r�colte Sénégal Excursions est r�volutionnaire pour notre r�gion. Pas besoin d\'attendre un expert — l\'indemnisation se d�clenche automatiquement quand la pluviom�trie descend sous le seuil.',
        },
        {
            image: 'assets/img/all-images/testimonial-img17.png',
            name: 'Fatou Diop',
            role: 'Agricultrice — Diourbel',
            description: 'J\'ai souscrit pour la premi�re fois cette ann�e. L\'agent Sénégal Excursions de notre zone a tout expliqu� clairement. Le prix est abordable et la couverture est excellente pour mes cultures d\'arachide.',
        },
        {
            image: 'assets/img/all-images/testimonial-img18.png',
            name: 'Cheikh Mbaye',
            role: 'Chef de coop�rative — Saint-Louis',
            description: 'Notre coop�rative regroupe 120 agriculteurs. Nous avons tous souscrit à la Sénégal Excursions collectivement. Le tarif de groupe est avantageux et le suivi de l\'�quipe Sénégal Excursions est exemplaire.',
        },
        {
            image: 'assets/img/all-images/testimonial-img19.png',
            name: 'Rokhaya Sow',
            role: 'Arboricultrice — Kolda',
            description: 'Mes vergers de mangues repr�sentent l\'essentiel de mes revenus. L\'assurance arboriculture Sénégal Excursions me prot�ge contre les cyclones et les maladies fongiques. Je dors tranquille chaque saison.',
        },
        {
            image: 'assets/img/all-images/testimonial-img20.png',
            name: 'Lamine Traor�',
            role: 'Agro-�leveur — Tambacounda',
            description: 'En tant qu\'agro-�leveur, j\'ai souscrit à la fois à l\'assurance r�colte et à l\'assurance bétail Sénégal Excursions. C\'est une double protection qui me permet d\'investir avec confiance dans mon exploitation.',
        }
    ]
}
