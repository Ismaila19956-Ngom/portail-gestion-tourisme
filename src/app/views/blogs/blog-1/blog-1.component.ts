import type { BlogType } from '@/types';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { BlogCardComponent } from "../../../components/cards/blog-card/blog-card.component";

@Component({
    selector: 'app-blog-1',
    imports: [BreadcrumbComponent, CommonModule, BlogCardComponent, RouterLink],
    templateUrl: './blog-1.component.html',
    styles: []
})
export class Blog1Component {
    activeTab: string = 'Toutes';

    setTab(tab: string) {
        this.activeTab = tab;
    }

    get filteredBlogs(): BlogType[] {
        if (this.activeTab === 'Toutes') return this.blogs;
        return this.blogs.filter(b => b.authorRole === this.activeTab);
    }

    blogs: BlogType[] = [
        {
            image: 'assets/images/tourisme/senegal_hero_1781800514533.png',
            title: 'Sénégal Excursions lance de nouveaux circuits pour 2025',
            description: 'Découvrez nos nouvelles offres d\'excursions pour explorer la beauté cachée du Sénégal, avec des guides locaux expérimentés.',
            date: '10 Mars 2025',
            authorRole: 'Actualités Sénégal Excursions'
        },
        {
            image: 'assets/images/tourisme/excursion_goree_1781800606230.png',
            title: 'Conseils pour visiter l\'Île de Gorée',
            description: 'Préparez votre visite à l\'île mémoire avec nos recommandations sur les meilleurs horaires et lieux à ne pas manquer.',
            date: '25 Février 2025',
            authorRole: 'Conseils de voyage'
        },
        {
            image: 'assets/images/tourisme/excursion_casamance_1781800557434.png',
            title: 'Hivernage 2025 : Préparez votre voyage en Casamance',
            description: 'Nos experts vous guident pour planifier votre excursion dans le sud du Sénégal avant la saison des pluies.',
            date: '18 Février 2025',
            authorRole: 'Conseils de voyage'
        },
        {
            image: 'assets/images/tourisme/excursion_saloum_1781800545237.png',
            title: 'Extension de nos services dans le Sine-Saloum',
            description: 'Sénégal Excursions propose désormais plus de 10 nouveaux itinéraires dans le delta du Sine-Saloum.',
            date: '5 Février 2025',
            authorRole: 'Actualités Sénégal Excursions'
        },
        {
            image: 'assets/images/tourisme/excursion_dakar_1781800534313.png',
            title: 'Comment profiter de Dakar le temps d\'un week-end ?',
            description: 'Monument de la Renaissance, marchés colorés et plages... Découvrez notre itinéraire express pour un week-end dakarois inoubliable.',
            date: '28 Janvier 2025',
            authorRole: 'Conseils de voyage'
        }
    ];

}
