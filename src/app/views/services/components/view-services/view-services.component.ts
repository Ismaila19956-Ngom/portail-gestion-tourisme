import { Component, Input, OnInit } from '@angular/core';
import { ServiceCardComponent } from "@app/components/cards/service-card/service-card.component";
import type { ServiceType } from '@/types';
import { CommonModule } from '@angular/common';
import { TourismeApiService } from '../../../../services/tourisme-api.service';
import { Produit } from '../../../../models/tourisme.models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-view-services',
    imports: [ServiceCardComponent, CommonModule],
    templateUrl: './view-services.component.html',
    styles: ``
})
export class ViewServicesComponent implements OnInit {

    /** ID du produit actuellement affich� (pour l'exclure des suggestions) */
    @Input() excludeId?: number;

    services: ServiceType[] = [];
    loading = true;

    constructor(private api: TourismeApiService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        /* R�cup�rer l'ID courant depuis la route si non pass� en @Input */
        const routeId = +(this.route.snapshot.paramMap.get('id') ?? 0);
        const excludeId = this.excludeId ?? routeId;

        this.api.getProduits().subscribe({
            next: (produits) => {
                this.services = produits
                    .filter(p => p.id !== excludeId)   /* Exclure le produit courant */
                    .slice(0, 3)
                    .map(p => this.toServiceType(p));
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    private toServiceType(p: Produit): ServiceType {
        return {
            id:          p.id,
            title:       p.nom,
            description: p.description || this.getDefaultDesc(p),
            image:       this.getImage(p),
            icon:        this.getIcon(p),
        };
    }

    private getDefaultDesc(p: Produit): string {
        const n = (p.nom || '').toLowerCase();
        if (n.includes('cultur') || n.includes('histor') || n.includes('gorée') || n.includes('goree')) return 'Plongez dans la richesse culturelle du Sénégal : Gorée, villages traditionnels, artisanat.';
        if (n.includes('safari') || n.includes('nature') || n.includes('faune') || n.includes('bandia')) return 'Découvrez la faune sauvage du Sénégal : réserve de Bandia, Niokolo-Koba, oiseaux du Saloum.';
        if (n.includes('plage') || n.includes('saly') || n.includes('mer') || n.includes('baln')) return 'Détente sur les plages paradisiaques de Saly et de Cap Skirring, sports nautiques inclus.';
        if (n.includes('gastronomie') || n.includes('culinaire') || n.includes('repas')) return 'Dégustez le Thiéboudienne, Yassa et autres spécialités sénégalaises authentiques.';
        if (n.includes('aventure') || n.includes('randonnée') || n.includes('trek') || n.includes('casamance')) return 'Explorez les forêts de Casamance, les dunes de Lompoul ou les chutes de Dindefelo.';
        if (n.includes('pirogue') || n.includes('fleuve') || n.includes('saloum') || n.includes('croisière')) return 'Naviguez en pirogue dans les mangroves du delta du Sine-Saloum.';
        return 'Découvrez cette excursion unique avec Sénégal Excursions.';
    }

    private getImage(p: Produit): string {
        if ((p as any).imageUrl && (p as any).imageUrl.trim() !== '') {
            return (p as any).imageUrl.replace(/([^:]\/)\/+/g, "$1");
        }
        const n = (p.nom || '').toLowerCase();
        if (n.includes('cultur') || n.includes('histor') || n.includes('gorée') || n.includes('goree'))
            return 'assets/images/tourisme/service_culture.png';
        if (n.includes('safari') || n.includes('nature') || n.includes('faune') || n.includes('bandia'))
            return 'assets/images/tourisme/service_safari.png';
        if (n.includes('plage') || n.includes('saly') || n.includes('mer') || n.includes('baln'))
            return 'assets/images/tourisme/service_plage.png';
        if (n.includes('gastronomie') || n.includes('culinaire') || n.includes('repas'))
            return 'assets/images/tourisme/service_gastro.png';
        if (n.includes('aventure') || n.includes('randonnée') || n.includes('trek') || n.includes('casamance'))
            return 'assets/images/tourisme/service_aventure.png';
        if (n.includes('pirogue') || n.includes('fleuve') || n.includes('saloum') || n.includes('croisière'))
            return 'assets/images/tourisme/hero_saloum.png';
        return 'assets/images/tourisme/hero_dakar.png';
    }

    private getIcon(p: Produit): string {
        const n = (p.nom || '').toLowerCase();
        if (n.includes('cultur') || n.includes('histor') || n.includes('gorée') || n.includes('goree')) return 'fa-solid fa-landmark';
        if (n.includes('safari') || n.includes('nature') || n.includes('faune') || n.includes('bandia')) return 'fa-solid fa-paw';
        if (n.includes('plage') || n.includes('saly') || n.includes('mer') || n.includes('baln')) return 'fa-solid fa-umbrella-beach';
        if (n.includes('gastronomie') || n.includes('culinaire') || n.includes('repas')) return 'fa-solid fa-utensils';
        if (n.includes('aventure') || n.includes('randonnée') || n.includes('trek') || n.includes('casamance')) return 'fa-solid fa-person-hiking';
        if (n.includes('pirogue') || n.includes('fleuve') || n.includes('saloum') || n.includes('croisière')) return 'fa-solid fa-sailboat';
        if (n.includes('circuit') || n.includes('multi') || n.includes('tour')) return 'fa-solid fa-route';
        return 'fa-solid fa-compass';
    }
}
