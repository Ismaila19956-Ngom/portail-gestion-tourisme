import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, type OwlOptions } from 'ngx-owl-carousel-o';
import { CnaasApiService } from '../../../../services/cnaas-api.service';

interface Slide {
    img: string;
    title: string;
    subtitle: string;
}

const DEFAULT_SLIDES: Slide[] = [
    {
        img: 'assets/images/tourisme/senegal_hero_1781800514533.png',
        title: 'Découvrez le Sénégal Authentique avec des Guides Locaux',
        subtitle: 'Excursions inoubliables – Dakar, Gorée, Saloum, Casamance'
    },
    {
        img: 'assets/images/tourisme/excursion_dakar_1781800534313.png',
        title: 'Des Circuits Sur Mesure pour Tous les Voyageurs',
        subtitle: 'Réservation en ligne – Paiement sécurisé – Confirmation immédiate'
    },
    {
        img: 'assets/images/tourisme/excursion_saloum_1781800545237.png',
        title: 'Vivez une Expérience Unique au CÅ“ur de l\'Afrique',
        subtitle: 'Éco-tourisme responsable – Guides certifiés – Satisfaction garantie'
    }
];

@Component({
    selector: 'app-hero',
    imports: [NgFor, NgIf, CarouselModule, RouterLink],
    templateUrl: './hero.component.html',
    styles: [`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }
    `]
})
export class HeroComponent implements OnInit {

    slides: Slide[] = DEFAULT_SLIDES;

    carouselOptions: OwlOptions = {
        loop: true,
        margin: 0,
        nav: true,
        dots: true,
        mouseDrag: false,
        items: 1,
        autoplay: true,
        navText: ["<i class='fa-solid fa-angle-up'></i>", "<i class='fa-solid fa-angle-down'></i>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 800,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: { items: 1, nav: true },
            600: { items: 1 },
            1000: { items: 1 }
        }
    };

    constructor(private api: CnaasApiService) {}

    ngOnInit(): void {
        this.api.getSliders().subscribe(data => {
            if (data && data.length > 0) {
                // Filtrer les slides actifs et les trier par ordre
                const activeSlides = data.filter(s => s.actif !== false);
                activeSlides.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

                if (activeSlides.length > 0) {
                    this.slides = activeSlides.map(s => {
                        // Nettoyer les double slashes éventuels (sauf après http: ou https:)
                        const safeUrl = (s.imageUrl || '').replace(/([^:]\/)\/+/g, '$1');
                        return {
                            img:      safeUrl,
                            title:    s.titre,
                            subtitle: s.sousTitre || 'Excursions inoubliables au Sénégal'
                        };
                    });
                    return;
                }
            }
            // Sinon, on garde les slides par défaut (DEFAULT_SLIDES déjÃ  assignés)
            this.slides = DEFAULT_SLIDES;
        });
    }
}
