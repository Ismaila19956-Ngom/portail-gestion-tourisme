import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { menuItems } from './data';
import { MobileNavItemComponent } from "./mobile-nav-item/mobile-nav-item.component";
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TourismeApiService } from '../../services/tourisme-api.service';
import { ReseauxSociauxService, ReseauSocialPortail } from '@core/services/reseaux-sociaux.service';

interface MenuItem {
    title: string;
    link?: string;
    subMenu?: MenuItem[];
    isOpen?: boolean
}

@Component({
    standalone: true,
    selector: 'app-mobile-menu',
    imports: [CommonModule, MobileNavItemComponent, RouterLink],
    templateUrl: './mobile-menu.component.html',
    styles: ``
})
export class MobileMenuComponent implements OnInit {
    private api = inject(TourismeApiService);
    private reseauxSvc = inject(ReseauxSociauxService);
    private router = inject(Router);

    isMenuOpen = false;

    @Input() mobileHeaderClass!: string;
    @Input() mobileSidebarClass!: string;
    @Input() mobileLogo!: string;
    @Input() btnClass!: string;
    menuItems: MenuItem[] = [];
    
    infoContact: any = {
        adresse: 'Sénégal Excursions, Dakar, Sénégal',
        telephone: '(+221) 33 000 00 00',
        email: 'contact@senegal-excursions.sn'
    };
    liensRapides: any[] = [];
    reseauxSociaux: ReseauSocialPortail[] = [];

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        this.isMenuOpen = false;
    }

    /** Retourne l'icône Font Awesome correspondant au réseau */
    getSocialIcon(rs: ReseauSocialPortail): string {
        if (rs.icon) {
            return rs.icon;
        }
        const map: Record<string, string> = {
            INSTAGRAM: 'fa-brands fa-instagram',
            TWITTER:   'fa-brands fa-x-twitter',
            YOUTUBE:   'fa-brands fa-youtube',
            LINKEDIN:  'fa-brands fa-linkedin-in',
            WHATSAPP:  'fa-brands fa-whatsapp',
            TIKTOK:    'fa-brands fa-tiktok',
        };
        return map[rs.reseau?.toUpperCase()] ?? 'fa-solid fa-share-nodes';
    }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.closeMenu();
        });

        /* Copie profonde pour ne pas muter le tableau statique */
        this.menuItems = menuItems.map(item => ({ ...item, subMenu: item.subMenu ? [...item.subMenu] : undefined }));

        /* Remplacer le sous-menu "Nos Destinations" avec les vrais produits */
        

        /* Charger contact et liens */
        this.api.getInformationContact().subscribe(data => {
            if (data) {
                this.infoContact = data;
            }
        });

        this.api.getLiensRapides().subscribe(data => {
            if (data && data.length > 0) {
                this.liensRapides = data;
            }
        });

        /* Charger les réseaux sociaux depuis l'API publique */
        this.reseauxSvc.getActifs().subscribe(rs => {
            this.reseauxSociaux = rs;
        });
    }

    toggleSubMenu(item: MenuItem, event?: Event): void {
        if (event) {
            event.stopPropagation();
        }
        if (item.subMenu) {
            item.isOpen = !item.isOpen;
        }
    }
}
