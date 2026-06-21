import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';

export interface Excursion {
    id: number;
    nom: string;
    description: string;
    image: string;
    icon: string;
    region: string;
    prix: number;
    duree: number;
}

@Component({
    selector: 'app-service-1',
    imports: [CommonModule, RouterLink, BreadcrumbComponent, FormsModule],
    templateUrl: './service-1.component.html',
    styles: []
})
export class Service1Component implements OnInit {

    excursions: Excursion[] = [];
    filteredExcursions: Excursion[] = [];
    
    // Filters
    selectedRegion: string = '';
    maxPrix: number = 200000;
    selectedDuree: number = 0;
    
    regions: string[] = ['Dakar', 'Casamance', 'Sine-Saloum', 'Saint-Louis', 'Thiès'];

    ngOnInit() {
        this.excursions = this.defaultExcursions();
        this.filteredExcursions = [...this.excursions];
    }

    applyFilters() {
        this.filteredExcursions = this.excursions.filter(e => {
            const matchRegion = this.selectedRegion ? e.region === this.selectedRegion : true;
            const matchPrix = e.prix <= this.maxPrix;
            const matchDuree = this.selectedDuree > 0 ? e.duree <= this.selectedDuree : true;
            return matchRegion && matchPrix && matchDuree;
        });
    }

    slug(id: number): string { return btoa(String(id)); }
    encodeProductName(name: string): string { return btoa(unescape(encodeURIComponent(name))); }

    private defaultExcursions(): Excursion[] {
        return [
            { id: 1, nom: 'Safari R&eacute;serve de Bandia', description: 'D&eacute;couvrez la faune africaine dans une r&eacute;serve naturelle pr&egrave;s de Dakar.', image: 'assets/images/tourisme/senegal_hero_1781800514533.png', icon: 'fa-solid fa-hippo', region: 'Thiès', prix: 35000, duree: 1 },
            { id: 2, nom: 'Visite &Icirc;le de Gor&eacute;e', description: 'Plongez dans l\'histoire avec cette visite guid&eacute;e de l\'&icirc;le m&eacute;moire.', image: 'assets/images/tourisme/excursion_goree_1781800606230.png', icon: 'fa-solid fa-ship', region: 'Dakar', prix: 20000, duree: 1 },
            { id: 3, nom: 'Immersion en Casamance', description: 'Une semaine d\'immersion dans les for&ecirc;ts et villages traditionnels du Sud.', image: 'assets/images/tourisme/excursion_casamance_1781800557434.png', icon: 'fa-solid fa-tree', region: 'Casamance', prix: 150000, duree: 7 },
            { id: 4, nom: 'Balade au Sine-Saloum', description: 'Navigation en pirogue dans les bolongs et d&eacute;couverte de la mangrove.', image: 'assets/images/tourisme/excursion_saloum_1781800545237.png', icon: 'fa-solid fa-water', region: 'Sine-Saloum', prix: 45000, duree: 2 },
            { id: 5, nom: 'D&eacute;couverte de Dakar', description: 'Tour de ville, march&eacute;s color&eacute;s et Monument de la Renaissance.', image: 'assets/images/tourisme/excursion_dakar_1781800534313.png', icon: 'fa-solid fa-city', region: 'Dakar', prix: 15000, duree: 1 },
        ];
    }
}
