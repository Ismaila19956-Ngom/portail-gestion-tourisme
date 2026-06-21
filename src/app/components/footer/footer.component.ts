import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CnaasApiService } from '../../services/cnaas-api.service';
import { ReseauxSociauxService, ReseauSocialPortail } from '@core/services/reseaux-sociaux.service';

interface FooterProduit {
    id: number;
    nom: string;
}

@Component({
    selector: 'app-footer',
    imports: [RouterLink, CommonModule],
    templateUrl: './footer.component.html',
    styles: ``
})
export class FooterComponent implements OnInit {
    currentYear = new Date().getFullYear();
    @Input() logo!: string;
    @Input() containerClass!: string;

    produits: FooterProduit[] = [];
    infoContact: any = {
        adresse: 'Sénégal Excursions, Dakar, Sénégal',
        telephone: '(+221) 33 000 00 00',
        email: 'contact@senegal-excursions.sn',
        horaires: 'Lun – Ven : 8h00 – 17h00'
    };
    liensRapides: any[] = [
        { nom: 'Facebook', url: 'https://www.facebook.com/Sénégal ExcursionsOFFICIELLE', icone: 'fa-brands fa-facebook-f' },
        { nom: 'LinkedIn', url: 'https://www.linkedin.com/company/compagnie-nationale-d-assurance-touristique-du-s%C3%A9n%C3%A9gal/?originalSubdomain=sn', icone: 'fa-brands fa-linkedin-in' },
        { nom: 'YouTube', url: 'https://www.youtube.com/@senegal-excursionsassurancelocauxene5540', icone: 'fa-brands fa-youtube' },
        { nom: 'Instagram', url: 'https://www.instagram.com/senegalexcursions/', icone: 'fa-brands fa-instagram' }
    ];

    reseauxSociaux: ReseauSocialPortail[] = [];

    constructor(
        private api: CnaasApiService,
        private reseauxSvc: ReseauxSociauxService
    ) {}

    slug(id: number): string { return id ? btoa(String(id)) : ''; }

    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /** Retourne l'icône Font Awesome correspondant au réseau */
    getSocialIcon(rs: ReseauSocialPortail): string {
        if (rs.icon) {
            return rs.icon;
        }
        const map: Record<string, string> = {
            FACEBOOK:  'fa-brands fa-facebook-f',
            INSTAGRAM: 'fa-brands fa-instagram',
            TWITTER:   'fa-brands fa-x-twitter',
            YOUTUBE:   'fa-brands fa-youtube',
            LINKEDIN:  'fa-brands fa-linkedin-in',
            WHATSAPP:  'fa-brands fa-whatsapp',
            TIKTOK:    'fa-brands fa-tiktok',
        };
        return map[rs.reseau?.toUpperCase()] ?? 'fa-solid fa-share-nodes';
    }

    ngOnInit(): void {
        this.api.getProduits().subscribe({
            next: (data) => {
                this.produits = data.slice(0, 5).map(p => ({ id: p.id, nom: p.nom }));
            },
            error: () => {
                /* Fallback statique */
                this.produits = [
                    { id: 0, nom: 'Excursion Dakar' },
                    { id: 0, nom: 'Île de Gorée' },
                    { id: 0, nom: 'Delta du Saloum' },
                    { id: 0, nom: 'Lac Rose' },
                    { id: 0, nom: 'Réserve de Bandia' },
                ];
            }
        });

        this.api.getInformationContact().subscribe({
            next: (data) => {
                if (data) {
                    this.infoContact = data;
                }
            }
        });

        this.api.getLiensRapides().subscribe({
            next: (data) => {
                if (data && data.length > 0) {
                    this.liensRapides = data;
                }
            }
        });

        /* Charger les réseaux sociaux depuis l'API publique */
        this.reseauxSvc.getActifs().subscribe(rs => {
            this.reseauxSociaux = rs;
        });
    }
}
