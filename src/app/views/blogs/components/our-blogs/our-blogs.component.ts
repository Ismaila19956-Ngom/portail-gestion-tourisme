import type { BlogType } from '@/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BlogCardComponent } from "../../../../components/cards/blog-card/blog-card.component";

@Component({
    selector: 'app-our-blogs',
    imports: [CommonModule, BlogCardComponent],
    templateUrl: './our-blogs.component.html',
    styles: ``
})
export class OurBlogsComponent {
    blogPosts: BlogType[] = [
        {
            image: 'assets/images/tourisme/excursion_goree_1781800606230.png',
            title: 'Sénégal Excursions lance de nouveaux circuits pour 2025',
            date: '10 Mars 2025',
            authorRole: 'Actualités Sénégal Excursions',
            description: 'Sénégal Excursions ouvre officiellement la saison touristique pour vous faire découvrir les merveilles de notre pays.',
        },
        {
            image: 'assets/images/tourisme/excursion_casamance_1781800557434.png',
            title: 'Préparer son voyage en Casamance : nos conseils',
            date: '25 Février 2025',
            authorRole: 'Conseils de voyage',
            description: 'Nos guides locaux partagent leurs conseils essentiels pour préparer votre itinéraire et maximiser vos expériences.',
        },
        {
            image: 'assets/images/tourisme/excursion_safari_1781800561571.png',
            title: 'Extension de nos offres aux 14 régions du Sénégal',
            date: '5 Février 2025',
            authorRole: 'Actualités Sénégal Excursions',
            description: 'Sénégal Excursions renforce sa présence territoriale avec de nouveaux circuits inédits dans toutes les régions.',
        }
    ];
}
