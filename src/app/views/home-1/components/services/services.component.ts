import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { serviceData } from '../data';

interface ProduitCard {
    id: number;
    nom: string;
    description: string;
    image: string;
    icon: string;
}

@Component({
    selector: 'app-services',
    imports: [CommonModule, RouterLink],
    templateUrl: './services.component.html',
    styles: ``
})
export class ServicesComponent implements OnInit {

    produits: ProduitCard[] = [];
    loading = true;

    constructor() {}

    ngOnInit(): void {
        this.produits = serviceData.slice(0, 6).map(p => ({
            id:          p.id,
            nom:         p.title,
            description: p.description || '',
            image:       p.image || '',
            icon:        this.getIconForTour(p.title),
        }));
        this.loading = false;
    }

    slug(id: number): string { return btoa(String(id)); }

    getIconForTour(title: string): string {
        const n = title.toLowerCase();
        if (n.includes('culture') || n.includes('gorée')) return 'fa-solid fa-landmark';
        if (n.includes('safari') || n.includes('nature')) return 'fa-solid fa-leaf';
        if (n.includes('aventure') || n.includes('randon')) return 'fa-solid fa-person-hiking';
        if (n.includes('croisière') || n.includes('pêche')) return 'fa-solid fa-ship';
        if (n.includes('gastro') || n.includes('art')) return 'fa-solid fa-utensils';
        return 'fa-solid fa-map-location-dot';
    }
}
