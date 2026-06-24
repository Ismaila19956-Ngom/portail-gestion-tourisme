import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { BlogsSidebarComponent } from "../components/blogs-sidebar/blogs-sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface BlogItem {
    image: string;
    author: string;
    date: string;
    title: string;
    description: string;
    theme: string;
    themeColor?: string;
    themeId: string;
    readTime?: string;
    views?: string;
}

@Component({
    selector: 'app-blog-sidebar',
    imports: [BreadcrumbComponent, BlogsSidebarComponent, CommonModule, RouterLink],
    templateUrl: './blog-sidebar.component.html',
    styles: ``
})
export class BlogSidebarComponent {

    activeTheme: string = 'tous';

    themes = [
        { id: 'tous',       label: 'Tous les conseils',  icon: 'fa-solid fa-layer-group' },
        { id: 'cultures',   label: 'Cultures & Traditions', icon: 'fa-solid fa-masks-theater' },
        { id: 'nature',     label: 'Nature & Safari',    icon: 'fa-solid fa-hippo' },
        { id: 'detente',    label: 'Plages & Détente',   icon: 'fa-solid fa-umbrella-beach' },
        { id: 'gastronomie',label: 'Gastronomie Locale', icon: 'fa-solid fa-utensils' },
    ];

    blogs: BlogItem[] = [
        {
            image: 'assets/images/tourisme/tourism_guide_hero.png',
            author: 'Équipe Sénégal Excursions',
            date: '10 Mars 2025',
            title: 'Préparer son safari à Bandia : les bons réflexes',
            description: 'Nos guides vous partagent leurs conseils essentiels pour préparer votre visite à la réserve de Bandia : meilleures heures pour observer les animaux, équipement recommandé et règles de sécurité pour maximiser votre expérience.',
            theme: 'Nature & Safari',
            themeColor: '#556B2F',
            themeId: 'nature',
            readTime: '6 min',
            views: '2 140 vues',
        },
        {
            image: 'assets/images/tourisme/excursion_dakar_1781800534313.png',
            author: 'Amadou Diallo',
            date: '25 Février 2025',
            title: 'Visite de l\'île de Gorée : Un voyage dans le temps',
            description: 'Gorée est un lieu chargé d\'histoire. Découvrez comment planifier votre traversée en chaloupe, les monuments incontournables comme la Maison des Esclaves et comment soutenir l\'artisanat local lors de votre visite.',
            theme: 'Cultures & Traditions',
            themeColor: '#F1B53B',
            themeId: 'cultures',
            readTime: '7 min',
            views: '1 870 vues',
        },
        {
            image: 'assets/images/tourisme/excursion_saloum_1781800545237.png',
            author: 'Fatou Ndiaye',
            date: '12 Février 2025',
            title: 'Le delta du Sine Saloum : un paradis écologique',
            description: 'Ce labyrinthe de mangroves est exceptionnel. Nos experts vous expliquent comment naviguer en pirogue à travers le delta, observer les oiseaux rares et séjourner dans des écolodges respectueux de l\'environnement.',
            theme: 'Nature & Safari',
            themeColor: '#556B2F',
            themeId: 'nature',
            readTime: '5 min',
            views: '1 340 vues',
        },
        {
            image: 'assets/images/tourisme/tourism_guide_hero.png',
            author: 'Ibrahim Baldé',
            date: '5 Février 2025',
            title: 'Saly Portudal : les meilleures plages en 3 étapes',
            description: 'Saly est la destination phare pour se détendre. Découvrez nos trois étapes indispensables pour profiter pleinement de la station balnéaire, des sports nautiques aux meilleurs restaurants les pieds dans l\'eau.',
            theme: 'Plages & Détente',
            themeColor: '#3498db',
            themeId: 'detente',
            readTime: '4 min',
            views: '980 vues',
        },
        {
            image: 'assets/images/tourisme/excursion_dakar_1781800534313.png',
            author: 'Équipe Sénégal Excursions',
            date: '28 Janvier 2025',
            title: 'Le guide de la street-food Dakaroise',
            description: 'Le Sénégal est célèbre pour son Thieboudienne, mais Dakar regorge de spécialités culinaires locales. Ce guide vous dévoile les meilleurs marchés et gargotes pour goûter aux délices locaux en toute sécurité.',
            theme: 'Gastronomie Locale',
            themeColor: '#e67e22',
            themeId: 'gastronomie',
            readTime: '8 min',
            views: '3 210 vues',
        },
        {
            image: 'assets/images/tourisme/excursion_saloum_1781800545237.png',
            author: 'Marie Fall',
            date: '15 Janvier 2025',
            title: 'Lac Rose (Retba) : comprendre ce phénomène unique',
            description: 'Découvrez les raisons scientifiques de la couleur rose exceptionnelle du lac et comment visiter les récolteurs de sel. Astuces : le meilleur moment de la journée pour avoir les plus belles photos souvenirs.',
            theme: 'Nature & Safari',
            themeColor: '#556B2F',
            themeId: 'nature',
            readTime: '4 min',
            views: '4 560 vues',
        }
    ];

    setTheme(id: string) {
        this.activeTheme = id;
    }

    get filteredBlogs(): BlogItem[] {
        if (this.activeTheme === 'tous') return this.blogs;
        return this.blogs.filter(b => b.themeId === this.activeTheme);
    }

    get activeThemeLabel(): string {
        return this.themes.find(t => t.id === this.activeTheme)?.label ?? '';
    }
}
