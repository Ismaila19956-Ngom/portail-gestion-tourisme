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
        { id: 'cultures',   label: 'Cultures & Récolte', icon: 'fa-solid fa-wheat-awn'   },
        { id: 'elevage',    label: 'Élevage & Bétail',   icon: 'fa-solid fa-cow'         },
        { id: 'maraichage', label: 'Maraîchage',         icon: 'fa-solid fa-seedling'    },
        { id: 'aviculture', label: 'Aviculture',         icon: 'fa-solid fa-egg'         },
    ];

    blogs: BlogItem[] = [
        {
            image: 'assets/images/produits/hf_20260311_162333_0b136c9f-1c67-4e61-978e-ab229d738d9d.jpeg',
            author: 'Équipe Sénégal Excursions',
            date: '10 Mars 2025',
            title: 'Préparer sa récolte : les bons réflexes avant l\'hivernage',
            description: 'Nos agronomes partagent leurs conseils essentiels pour préparer vos champs avant la saison des pluies : choix des semences adaptées, gestion des sols, rotation des cultures et pratiques de conservation de l\'eau pour maximiser vos rendements.',
            theme: 'Cultures & Récolte',
            themeColor: '#F1B53B',
            themeId: 'cultures',
            readTime: '6 min',
            views: '2 140 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_162333_2c5dfd81-2a14-40ad-99fb-17207f71c1bb.jpeg',
            author: 'Dr. Mamadou Diallo',
            date: '25 Février 2025',
            title: 'Maladies du bétail au Sénégal : prévention et couverture',
            description: 'Face Ã  la recrudescence des maladies animales (fièvre aphteuse, PPCB, charbon symptomatique), découvrez comment l\'assurance bétail Sénégal Excursions vous protège et quelles mesures préventives adopter pour sécuriser votre cheptel.',
            theme: 'Élevage & Bétail',
            themeColor: '#556B2F',
            themeId: 'elevage',
            readTime: '7 min',
            views: '1 870 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_163904_c2646f0e-6619-49af-8072-281498895f7c.jpeg',
            author: 'Fatou Ndiaye',
            date: '12 Février 2025',
            title: 'Horticulture et maraîchage : optimiser votre assurance',
            description: 'Le secteur maraîcher est particulièrement vulnérable aux aléas climatiques et parasitaires. Nos experts vous expliquent comment adapter votre couverture d\'assurance Sénégal Excursions Ã  votre type de production et votre région.',
            theme: 'Maraîchage',
            themeColor: '#2ecc71',
            themeId: 'maraichage',
            readTime: '5 min',
            views: '1 340 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_162333_01988b04-73a0-41b3-bffc-7087d47324a6.jpeg',
            author: 'Ibrahim Baldé',
            date: '5 Février 2025',
            title: 'Aviculture : protégez votre cheptel en 3 étapes clés',
            description: 'La Newcastle, la grippe aviaire et les accidents de bâtiment représentent les principales menaces pour vos élevages. Découvrez les trois étapes indispensables pour sécuriser votre exploitation avicole avec Sénégal Excursions.',
            theme: 'Aviculture',
            themeColor: '#e67e22',
            themeId: 'aviculture',
            readTime: '4 min',
            views: '980 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_164048_ee881310-4c1c-4717-895a-fe275c17150c.jpeg',
            author: 'Équipe Sénégal Excursions',
            date: '28 Janvier 2025',
            title: 'Assurance indicielle : comment fonctionne l\'indemnisation automatique ?',
            description: 'L\'assurance indicielle utilise des données satellite et pluviométriques pour déclencher automatiquement les indemnisations sans expertise terrain. Ce guide vous explique le mécanisme, les zones couvertes et les cultures éligibles.',
            theme: 'Cultures & Récolte',
            themeColor: '#F1B53B',
            themeId: 'cultures',
            readTime: '8 min',
            views: '3 210 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_164318_c3ceca30-849b-4352-ba8c-2f80ddb318d5.jpeg',
            author: 'Dr. Mamadou Diallo',
            date: '15 Janvier 2025',
            title: 'Gestion des pâturages et prévention des épizooties en zone sahélienne',
            description: 'La gestion durable des pâturages est fondamentale pour prévenir les épidémies animales dans le Sahel sénégalais. Cet article détaille les meilleures pratiques d\'élevage extensif et les protocoles de vaccination recommandés.',
            theme: 'Élevage & Bétail',
            themeColor: '#556B2F',
            themeId: 'elevage',
            readTime: '6 min',
            views: '1 120 vues',
        },
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
