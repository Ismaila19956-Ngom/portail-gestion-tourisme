import { serviceData } from '../../views/home-1/components/data';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StickyScrollDirective } from '@core/directives/sticky-scroll.directive';
import { MobileMenuComponent } from "../mobile-menu/mobile-menu.component";
import { RouterLink, Router, NavigationEnd, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { CnaasApiService } from '../../services/cnaas-api.service';
import { Produit, CategorieProduit } from '../../models/cnaas.models';
import { AuthService } from '../../services/auth.service';
import { ReseauxSociauxService, ReseauSocialPortail } from '@core/services/reseaux-sociaux.service';

interface ProduitMenu {
    id: number;
    title: string;
    icon: string;
    image: string;
    desc: string;
    link: string;
    category: string;      /* slug local (r�trocompat) */
    categorieId: number | null;  /* ID r�el depuis l'API */
}

@Component({
    selector: 'app-topbar',
    imports: [MobileMenuComponent, CommonModule, StickyScrollDirective, RouterLink, RouterLinkActive, FormsModule],
    templateUrl: './topbar.component.html',
    styles: [`
        .category-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
            overflow: hidden;
        }
        .category-link:hover {
            transform: translateX(6px);
            background-color: #f8fcf9 !important;
        }
        .category-icon {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-link:hover .category-icon {
            transform: scale(1.15) rotate(5deg);
        }
        .product-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: 1px solid transparent;
        }
        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 15px rgba(7, 90, 38, 0.08) !important;
            border-color: #d1e7dd !important;
            background-color: #f8fcf9 !important;
        }
        .product-card-icon {
            transition: all 0.3s ease;
        }
        .product-card-icon img {
            transition: transform 0.3s ease;
        }
        .product-card:hover .product-card-icon {
            background-color: #556B2F !important;
            border-color: #556B2F !important;
        }
        .product-card:hover .product-card-icon img {
            transform: scale(1.15);
        }

        /* NOUVEAUX STYLES MENU VIBRANT */
        .main-menu ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
        }
        .main-menu > ul > li {
            position: relative;
            margin: 0 12px;
        }
        .main-menu ul li a {
            position: relative;
            transition: all 0.3s ease !important;
            padding-bottom: 6px !important;
            text-decoration: none;
        }
        .main-menu > ul > li > a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #F1B53B;
            transition: width 0.3s ease;
            border-radius: 2px;
        }
        .main-menu > ul > li > a:hover {
            color: #F1B53B !important;
        }
        .main-menu > ul > li > a:hover::after {
            width: 100%;
        }
        .main-menu > ul > li > a.active {
            color: #F1B53B !important;
            font-weight: 700 !important;
        }
        .main-menu > ul > li > a.active::after {
            width: 100%;
        }
        .main-menu > ul > li > a:active {
            transform: scale(0.95);
            opacity: 0.8;
        }
        /* SOUS-MENUS DROPDOWN */
        .main-menu ul li ul.dropdown-padding {
            position: absolute;
            top: 100%;
            left: 0;
            background: #ffffff;
            min-width: 230px;
            box-shadow: 0 10px 35px rgba(0,0,0,0.08);
            border-radius: 12px;
            padding: 10px 0;
            opacity: 0;
            visibility: hidden;
            transform: translateY(15px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            border: 1px solid rgba(0,0,0,0.04);
            display: block;
            margin-top: 10px;
        }
        .main-menu ul li:hover > ul.dropdown-padding {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .main-menu ul li ul.dropdown-padding li {
            display: block;
            margin: 0;
        }
        .main-menu ul li ul.dropdown-padding li a {
            display: block;
            padding: 10px 24px !important;
            color: #475569 !important;
            font-size: 0.95rem;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            border-bottom: none !important;
            background: transparent;
        }
        .main-menu ul li ul.dropdown-padding li a::after {
            display: none !important;
        }
        .main-menu ul li ul.dropdown-padding li a:hover,
        .main-menu ul li ul.dropdown-padding li a.active {
            background-color: #f8fafc !important;
            color: #556B2F !important;
            padding-left: 30px !important;
        }
    `]
})
export class TopbarComponent implements OnInit {
    isActive = false;
    currentUrl = '';
    produitLoading = true;

    @Input() headerClass!: string;
    @Input() mobileHeaderClass!: string;
    @Input() mobileLogo!: string;
    @Input() mobileSidebarClass!: string;
    @Input() btnClass!: string;
    @Input() logo!: string;
    @Input() isAlert?: boolean;

    get isLoggedIn() { return this.authService.isLogged(); }

    /** R�seaux sociaux charg�s depuis l'API publique */
    reseauxSociaux: ReseauSocialPortail[] = [];

    constructor(
        private router: Router,
        private api: CnaasApiService,
        private authService: AuthService,
        private reseauxSvc: ReseauxSociauxService
    ) {
        this.currentUrl = this.router.url;
    }

    infoContact: any = {
        telephone: '(+221) 33 869 78 00',
        email: 'contact@senegal-excursions.sn'
    };
    liensRapides: any[] = [
        { nom: 'Facebook', url: 'https://www.facebook.com/S�n�gal ExcursionsOFFICIELLE', icone: 'fa-brands fa-facebook-f' },
        { nom: 'InstS�n�gal D�couvertem', url: 'https://www.instagram.com/senegal-excursionsofficielle/reels/', icone: 'fa-brands fa-instagram' },
        { nom: 'YouTube', url: 'https://www.youtube.com/@senegal-excursionsassurancelocauxene5540', icone: 'fa-brands fa-youtube' },
        { nom: 'LinkedIn', url: 'https://www.linkedin.com/company/compagnie-nationale-d-assurance-touristique-du-s%C3%A9n%C3%A9gal/?originalSubdomain=sn', icone: 'fa-brands fa-linkedin' }
    ];

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.currentUrl = event.urlAfterRedirects;
        });

        /* Charger les r�seaux sociaux depuis l'API publique */
        this.reseauxSvc.getActifs().subscribe(rs => {
            this.reseauxSociaux = rs;
        });

        /* Charger les cat�gories */
        /* Charger les catgories */
        this.api.getCategories().subscribe(cats => {
            this.apiCategories = cats;
            this.buildCategoriesMenu(cats);
        });

        /* Charger les produits */
        this.tousLesProduits = serviceData.map(p => ({
            id: p.id || 0,
            title: p.title || '',
            icon: p.icon || '',
            image: p.image || '',
            desc: p.description || '',
            link: `/excursions/detail/${p.id}`,
            category: 'Excursions',
            categorieId: 1
        }));
        this.displayedProducts = this.tousLesProduits;
        this.produitLoading = false;

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
    }

    /** Retourne l'ic�ne Font Awesome correspondant au r�seau */
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

    private toMenuProduit(p: Produit): ProduitMenu {
        return {
            id:          p.id,
            title:       p.nom,
            icon:        this.getIcon(p),
            image:       this.getImage(p),
            desc:        this.getDesc(p),
            link:        `/services/single/${btoa(String(p.id))}`,
            category:    this.getCategory(p),
            categorieId: p.categorie?.id ?? null,
        };
    }

    private getIcon(p: Produit): string {
        const n = (p.nom || '').toLowerCase();
        if (n.includes('r�colte') || n.includes('recolte')) return 'fa-solid fa-wheat-awn';
        if (n.includes('b�tail') || n.includes('betail') || n.includes('cheptel')) return 'fa-solid fa-cow';
        if (n.includes('avicul') || n.includes('volaille')) return 'fa-solid fa-egg';
        if (n.includes('mat�riel') || n.includes('materiel') || n.includes('�quipement') || n.includes('equipement')) return 'fa-solid fa-tractor';
        if (n.includes('indiciel') || n.includes('pluie')) return 'fa-solid fa-satellite-dish';
        if (n.includes('horticol') || n.includes('maraich') || n.includes('serre')) return 'fa-solid fa-seedling';
        if (n.includes('arboricul')) return 'fa-solid fa-tree';
        if (n.includes('stock')) return 'fa-solid fa-warehouse';
        return 'fa-solid fa-shield-halved';
    }

    private getImage(p: Produit): string {
        const n = (p.nom || '').toLowerCase();
        if (n.includes('r�colte') || n.includes('recolte'))
            return 'assets/images/produits/hf_20260311_162333_0b136c9f-1c67-4e61-978e-ab229d738d9d.jpeg';
        if (n.includes('b�tail') || n.includes('betail') || n.includes('cheptel'))
            return 'assets/images/produits/hf_20260311_162333_2c5dfd81-2a14-40ad-99fb-17207f71c1bb.jpeg';
        if (n.includes('avicul') || n.includes('volaille'))
            return 'assets/images/produits/hf_20260311_162333_01988b04-73a0-41b3-bffc-7087d47324a6.jpeg';
        if (n.includes('mat�riel') || n.includes('materiel') || n.includes('�quipement') || n.includes('equipement'))
            return 'assets/images/produits/hf_20260311_162925_871036b1-9cf1-4fdb-8480-7b3ce42bf7a7.jpeg';
        if (n.includes('indiciel') || n.includes('pluie'))
            return 'assets/images/produits/hf_20260311_164048_86f66af8-95f1-4418-b76a-4b4735fea65e.jpeg';
        if (n.includes('horticol') || n.includes('maraich') || n.includes('serre'))
            return 'assets/images/produits/hf_20260311_164705_3142c799-0510-4f38-84df-c4c15d2279d9.jpeg';
        return 'assets/images/produits/hf_20260311_171453_4c033777-5979-4867-81ed-1fbbb5c1b9bc.jpeg';
    }

    private getDesc(p: Produit): string {
        if (p.description) return p.description.slice(0, 50);
        const n = (p.nom || '').toLowerCase();
        if (n.includes('r�colte') || n.includes('recolte')) return 'Protection cultures';
        if (n.includes('b�tail') || n.includes('betail') || n.includes('cheptel')) return 'Protection cheptel';
        if (n.includes('avicul') || n.includes('volaille')) return 'Protection volailles';
        if (n.includes('mat�riel') || n.includes('materiel') || n.includes('�quipement')) return 'Protection mat�riels';
        if (n.includes('indiciel')) return 'Indice pluviom�trique';
        if (n.includes('horticol') || n.includes('maraich')) return 'Protection mara�chage';
        if (n.includes('stock')) return 'Protection stocks';
        return 'Assurance touristique S�n�gal Excursions';
    }

    private getCategory(p: Produit): string {
        const n = (p.nom || '').toLowerCase();
        if (n.includes('b�tail') || n.includes('betail') || n.includes('cheptel') || n.includes('avicul') || n.includes('volaille')) return 'animal';
        if (n.includes('r�colte') || n.includes('recolte') || n.includes('indiciel') || n.includes('horticol') || n.includes('maraich') || n.includes('arboricul')) return 'vegetaux';
        return 'autres';
    }

    isAboutActive(): boolean {
        return ['/about', '/our-team', '/testimonials'].some(path => this.currentUrl.includes(path));
    }

    isBlogActive(): boolean {
        return this.currentUrl.includes('/blogs') || this.currentUrl.includes('/testimonials');
    }

    isProductActive(): boolean {
        return this.currentUrl.includes('/services');
    }

    /* ── Cat�gories ── */
    activeCategoryId: number | null = null;
    apiCategories: CategorieProduit[] = [];
    categoriesMenu: { id: number | null; name: string; icon: string }[] = [
        { id: null, name: 'Toutes les cat�gories', icon: 'fa-solid fa-layer-group' }
    ];

    tousLesProduits: ProduitMenu[] = [];
    displayedProducts: ProduitMenu[] = [];
    activeCategoryName = 'Toutes les cat�gories';

    private buildCategoriesMenu(cats: CategorieProduit[]): void {
        this.categoriesMenu = [
            { id: null, name: 'Toutes les cat�gories', icon: 'fa-solid fa-layer-group' },
            ...cats.map(c => ({
                id:   c.id as number | null,
                name: c.libelle || c.code,
                icon: this.getCategorieIcon(c.code)
            }))
        ];
    }

    private refreshDisplayedProducts(): void {
        if (this.activeCategoryId === null) {
            this.displayedProducts = this.tousLesProduits;
        } else {
            this.displayedProducts = this.tousLesProduits.filter(
                p => p.categorieId === this.activeCategoryId
            );
        }
    }

    getCategorieIcon(code: string): string {
        const c = (code || '').toUpperCase();
        if (c.includes('VEG') || c.includes('RECOLT') || c.includes('CULT')) return 'fa-solid fa-leaf';
        if (c.includes('ANIM') || c.includes('BET') || c.includes('ELEV')) return 'fa-solid fa-paw';
        if (c.includes('AVI') || c.includes('VOL')) return 'fa-solid fa-egg';
        if (c.includes('MARAI') || c.includes('HORT')) return 'fa-solid fa-seedling';
        return 'fa-solid fa-border-all';
    }

    setActiveCategory(categoryId: number | null, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.activeCategoryId = categoryId;
        this.activeCategoryName = categoryId === null
            ? 'Toutes les cat�gories'
            : (this.apiCategories.find(c => c.id === categoryId)?.libelle ?? '');
        this.refreshDisplayedProducts();
    }

    pageMenuItems = [
        { title: 'A propos de S�n�gal Excursions', link: '/about'        },
        // { title: 'Notre equipe',       link: '/our-team'     },
        // { title: 'Temoignages',        link: '/testimonials' },
    ];

    blogMenuItems = [
        { title: 'Toutes les actualit�s', link: '/blogs/one'     },
        { title: 'Conseils locaux',    link: '/blogs/sidebar' },
        { title: 'Nouvelles S�n�gal Excursions',       link: '/blogs/single'  },
    ];

    searchOpen  = false;
    searchQuery = '';

    toggleSearch() {
        this.searchOpen = !this.searchOpen;
        this.searchQuery = '';
    }

    onSearch() {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/services/one'], { queryParams: { q: this.searchQuery.trim() } });
            this.searchOpen = false;
            this.searchQuery = '';
        }
    }
}
