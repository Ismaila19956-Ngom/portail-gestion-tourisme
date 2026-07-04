import { Component } from '@angular/core';
import { BreadcrumbComponent } from "@app/components/breadcrumb/breadcrumb.component";
import type { TestimonialType } from '@/types';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "@app/components/pagination/pagination.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-testimonials',
    imports: [BreadcrumbComponent, CommonModule, PaginationComponent, RouterModule],
    templateUrl: './testimonials.component.html',
    styles: ``
})
export class TestimonialsComponent {
    testimonials: TestimonialType[] = [
        {
            image: 'assets/images/tourisme/voyageur_1.png',
            name: 'Sophie Marchand',
            role: 'Touriste — Lyon, France',
            description: 'Une expérience absolument inoubliable ! La visite de l\'île de Gorée avec notre guide Moussa était émouvante et profondément instructive. Sénégal Excursions a tout organisé à la perfection — transferts, billets, explications historiques. Je recommande à 100 % !',
        },
        {
            image: 'assets/images/tourisme/voyageur_2.png',
            name: 'Amadou Koné',
            role: 'Touriste — Abidjan, Côte d\'Ivoire',
            description: 'J\'ai découvert le delta du Saloum en pirogue grâce à Sénégal Excursions et c\'était magique. Les mangroves, les oiseaux, le coucher de soleil sur les bolongs… Je n\'avais jamais rien vu d\'aussi beau. Le guide était passionné et très professionnel.',
        },
        {
            image: 'assets/images/tourisme/voyageur_3.png',
            name: 'Elena Ferreira',
            role: 'Touriste — Lisbonne, Portugal',
            description: 'Saly et ses plages de sable fin, la pêche en mer au lever du jour, les villages artisanaux… Sénégal Excursions m\'a offert un séjour riche et authentique. L\'équipe est accueillante, ponctuelle et toujours souriante. Je reviens l\'année prochaine !',
        },
        {
            image: 'assets/images/tourisme/voyageur_1.png',
            name: 'Thomas Dubois',
            role: 'Touriste — Bruxelles, Belgique',
            description: 'La Casamance est un véritable paradis vert, et Sénégal Excursions nous a permis de l\'explorer en toute sécurité. Notre guide parlait français, anglais et diola — une valeur ajoutée inestimable. Les repas locaux inclus dans l\'excursion étaient délicieux.',
        },
        {
            image: 'assets/images/tourisme/voyageur_2.png',
            name: 'Fatimata Diallo',
            role: 'Touriste — Conakry, Guinée',
            description: 'Dakar m\'a émerveillée : la médina, le marché Sandaga, la Mosquée de la Divinité et la presqu\'île du Cap-Vert. Sénégal Excursions a su combiner culture, gastronomie et découverte urbaine en une journée parfaite. Un sans-faute du début à la fin !',
        },
        {
            image: 'assets/images/tourisme/voyageur_3.png',
            name: 'Marco Bianchi',
            role: 'Touriste — Milan, Italie',
            description: 'Ho visitato il Senegal con Sénégal Excursions e sono rimasto senza parole. L\'escursione sull\'isola di Gorée e la Casamance sono state indimenticabili. La guida parlava anche italiano — una piacevole sorpresa ! Service cinq étoiles, sans aucun doute.',
        },
        {
            image: 'assets/images/tourisme/voyageur_1.png',
            name: 'Mariame Baldé',
            role: 'Touriste — Dakar, Sénégal',
            description: 'Même en tant que Sénégalaise, j\'ai redécouvert mon pays grâce à Sénégal Excursions ! L\'excursion dans le delta du Saloum était une révélation. Je ne connaissais pas la moitié de ces sites. Je recommande à tous mes compatriotes de voyager et explorer leur propre pays.',
        },
        {
            image: 'assets/images/tourisme/voyageur_2.png',
            name: 'Ingrid Hansen',
            role: 'Touriste — Oslo, Norvège',
            description: 'I came to Senegal for the first time and Sénégal Excursions made it a dream trip. The guides were knowledgeable, kind and spoke excellent French and English. The Saloum Delta boat trip at sunrise was the highlight of my entire stay. Truly five-star service !',
        },
    ]
}
