import { Component, Input, OnInit } from '@angular/core';
import { ServiceCardComponent } from "@app/components/cards/service-card/service-card.component";
import type { ServiceType } from '@/types';
import { CommonModule } from '@angular/common';
import { CnaasApiService } from '../../../../services/cnaas-api.service';
import { Produit } from '../../../../models/cnaas.models';
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

    constructor(private api: CnaasApiService, private route: ActivatedRoute) {}

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
        if (n.includes('r�colte') || n.includes('recolte')) return 'Prot�gez vos cultures contre les al�as climatiques s�v�res.';
        if (n.includes('bétail') || n.includes('betail') || n.includes('cheptel')) return 'Protection compl�te de votre cheptel contre mortalit� et maladies.';
        if (n.includes('avicul') || n.includes('volaille')) return 'S�curisez vos �levages de volailles contre les risques.';
        if (n.includes('mat�riel') || n.includes('materiel') || n.includes('équipement')) return 'Garantissez vos équipements contre dommages et vols.';
        if (n.includes('indiciel')) return 'Indemnisation automatique bas�e sur des indices climatiques.';
        if (n.includes('horticol') || n.includes('maraich')) return 'Couverture sp�cifique pour serres et cultures mara�ch�res.';
        return 'Découvrez ce produit d\'assurance touristique Sénégal Excursions.';
    }

    private getImage(p: Produit): string {
        if ((p as any).imageUrl && (p as any).imageUrl.trim() !== '') {
            return (p as any).imageUrl.replace(/([^:]\/)\/+/g, "$1");
        }
        const n = (p.nom || '').toLowerCase();
        if (n.includes('r�colte') || n.includes('recolte'))
            return 'assets/images/produits/hf_20260311_162333_0b136c9f-1c67-4e61-978e-ab229d738d9d.jpeg';
        if (n.includes('bétail') || n.includes('betail') || n.includes('cheptel'))
            return 'assets/images/produits/hf_20260311_162333_2c5dfd81-2a14-40ad-99fb-17207f71c1bb.jpeg';
        if (n.includes('avicul') || n.includes('volaille'))
            return 'assets/images/produits/hf_20260311_162333_01988b04-73a0-41b3-bffc-7087d47324a6.jpeg';
        if (n.includes('mat�riel') || n.includes('materiel') || n.includes('équipement') || n.includes('equipement'))
            return 'assets/images/produits/hf_20260311_162925_871036b1-9cf1-4fdb-8480-7b3ce42bf7a7.jpeg';
        if (n.includes('indiciel') || n.includes('pluie'))
            return 'assets/images/produits/hf_20260311_164048_86f66af8-95f1-4418-b76a-4b4735fea65e.jpeg';
        if (n.includes('horticol') || n.includes('maraich') || n.includes('serre'))
            return 'assets/images/produits/hf_20260311_164705_3142c799-0510-4f38-84df-c4c15d2279d9.jpeg';
        return 'assets/images/produits/hf_20260311_171453_4c033777-5979-4867-81ed-1fbbb5c1b9bc.jpeg';
    }

    private getIcon(p: Produit): string {
        const n = (p.nom || '').toLowerCase();
        if (n.includes('r�colte') || n.includes('recolte')) return 'fa-solid fa-wheat-awn';
        if (n.includes('bétail') || n.includes('betail') || n.includes('cheptel')) return 'fa-solid fa-cow';
        if (n.includes('avicul') || n.includes('volaille')) return 'fa-solid fa-egg';
        if (n.includes('mat�riel') || n.includes('materiel') || n.includes('équipement') || n.includes('equipement')) return 'fa-solid fa-tractor';
        if (n.includes('indiciel') || n.includes('pluie')) return 'fa-solid fa-satellite-dish';
        if (n.includes('horticol') || n.includes('maraich') || n.includes('serre')) return 'fa-solid fa-seedling';
        return 'fa-solid fa-shield-halved';
    }
}
