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
        { id: 'cultures',   label: 'Cultures & R�colte', icon: 'fa-solid fa-wheat-awn'   },
        { id: 'elevage',    label: '�levage & Bétail',   icon: 'fa-solid fa-cow'         },
        { id: 'maraichage', label: 'Mara�chage',         icon: 'fa-solid fa-seedling'    },
        { id: 'aviculture', label: 'Aviculture',         icon: 'fa-solid fa-egg'         },
    ];

    blogs: BlogItem[] = [
        {
            image: 'assets/images/produits/hf_20260311_162333_0b136c9f-1c67-4e61-978e-ab229d738d9d.jpeg',
            author: '�quipe Sénégal Excursions',
            date: '10 Mars 2025',
            title: 'Pr�parer sa r�colte : les bons r�flexes avant l\'hivernage',
            description: 'Nos agronomes partagent leurs conseils essentiels pour pr�parer vos champs avant la saison des pluies : choix des semences adapt�es, gestion des sols, rotation des cultures et pratiques de conservation de l\'eau pour maximiser vos rendements.',
            theme: 'Cultures & R�colte',
            themeColor: '#F1B53B',
            themeId: 'cultures',
            readTime: '6 min',
            views: '2 140 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_162333_2c5dfd81-2a14-40ad-99fb-17207f71c1bb.jpeg',
            author: 'Dr. Mamadou Diallo',
            date: '25 F�vrier 2025',
            title: 'Maladies du bétail au Sénégal : pr�vention et couverture',
            description: 'Face à la recrudescence des maladies animales (fi�vre aphteuse, PPCB, charbon symptomatique), d�couvrez comment l\'assurance bétail Sénégal Excursions vous prot�ge et quelles mesures pr�ventives adopter pour s�curiser votre cheptel.',
            theme: '�levage & Bétail',
            themeColor: '#556B2F',
            themeId: 'elevage',
            readTime: '7 min',
            views: '1 870 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_163904_c2646f0e-6619-49af-8072-281498895f7c.jpeg',
            author: 'Fatou Ndiaye',
            date: '12 F�vrier 2025',
            title: 'Horticulture et mara�chage : optimiser votre assurance',
            description: 'Le secteur mara�cher est particuli�rement vuln�rable aux al�as climatiques et parasitaires. Nos experts vous expliquent comment adapter votre couverture d\'assurance Sénégal Excursions à votre type de production et votre r�gion.',
            theme: 'Mara�chage',
            themeColor: '#2ecc71',
            themeId: 'maraichage',
            readTime: '5 min',
            views: '1 340 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_162333_01988b04-73a0-41b3-bffc-7087d47324a6.jpeg',
            author: 'Ibrahim Bald�',
            date: '5 F�vrier 2025',
            title: 'Aviculture : prot�gez votre cheptel en 3 étapes cl�s',
            description: 'La Newcastle, la grippe aviaire et les accidents de bâtiment repr�sentent les principales menaces pour vos �levages. Découvrez les trois étapes indispensables pour s�curiser votre exploitation avicole avec Sénégal Excursions.',
            theme: 'Aviculture',
            themeColor: '#e67e22',
            themeId: 'aviculture',
            readTime: '4 min',
            views: '980 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_164048_ee881310-4c1c-4717-895a-fe275c17150c.jpeg',
            author: '�quipe Sénégal Excursions',
            date: '28 Janvier 2025',
            title: 'Assurance indicielle : comment fonctionne l\'indemnisation automatique ?',
            description: 'L\'assurance indicielle utilise des donn�es satellite et pluviom�triques pour d�clencher automatiquement les indemnisations sans expertise terrain. Ce guide vous explique le m�canisme, les zones couvertes et les cultures �ligibles.',
            theme: 'Cultures & R�colte',
            themeColor: '#F1B53B',
            themeId: 'cultures',
            readTime: '8 min',
            views: '3 210 vues',
        },
        {
            image: 'assets/images/produits/hf_20260311_164318_c3ceca30-849b-4352-ba8c-2f80ddb318d5.jpeg',
            author: 'Dr. Mamadou Diallo',
            date: '15 Janvier 2025',
            title: 'Gestion des p�turages et pr�vention des �pizooties en zone sah�lienne',
            description: 'La gestion durable des p�turages est fondamentale pour pr�venir les �pid�mies animales dans le Sahel s�n�galais. Cet article d�taille les meilleures pratiques d\'�levage extensif et les protocoles de vaccination recommand�s.',
            theme: '�levage & Bétail',
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
