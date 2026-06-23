import { Component } from '@angular/core';
import { BreadcrumbComponent } from "@app/components/breadcrumb/breadcrumb.component";
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FaqItem {
    question: string;
    answer: string;
    categoryId: string;
    icon: string;
    link?: string;
    linkLabel?: string;
}

@Component({
    selector: 'app-faq',
    imports: [BreadcrumbComponent, NgbAccordionModule, CommonModule, RouterLink, FormsModule],
    templateUrl: './faq.component.html',
    styles: ``
})
export class FaqComponent {

    activeCategory = 'tous';
    searchQuery = '';

    categories = [
        { id: 'tous',         label: 'Toutes les questions', icon: 'fa-solid fa-layer-group',          count: 15 },
        { id: 'souscription', label: 'Souscription',         icon: 'fa-solid fa-file-signature',       count: 4  },
        { id: 'produits',     label: 'Nos Produits',         icon: 'fa-solid fa-shield-halved',        count: 5  },
        { id: 'sinistres',    label: 'Sinistres',            icon: 'fa-solid fa-triangle-exclamation', count: 3  },
        { id: 'paiement',     label: 'Paiement & Primes',    icon: 'fa-solid fa-credit-card',          count: 3  },
    ];

    faqs: FaqItem[] = [
        /* ── SOUSCRIPTION ── */
        {
            question: 'Comment puis-je souscrire aux produits de la Sénégal Excursions ?',
            answer: "Vous pouvez souscrire directement via notre formulaire de contact en ligne, par téléphone au (+221) 33 869 78 00, ou en vous rendant dans l'une de nos agences r�parties dans les 14 r�gions du Sénégal. Un conseiller vous accompagnera dans le choix du produit le plus adapt� à votre exploitation.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-file-signature',
            link: '/contact-us',
            linkLabel: 'Contacter un conseiller'
        },
        {
            question: 'Quelle est la p�riode de souscription pour la campagne 2025 ?',
            answer: "La p�riode de souscription pour la campagne hivernale 2025 est ouverte du 1er mars au 31 mai 2025. Pass� cette date, aucune nouvelle souscription ne pourra �tre accept�e pour la saison en cours. Nous vous encourageons à vous rapprocher rapidement d'un agent Sénégal Excursions.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-calendar-check',
        },
        {
            question: 'Quels documents sont n�cessaires pour souscrire ?',
            answer: "Pour souscrire, vous aurez besoin : d'une pi�ce d'identit� valide (CNI ou passeport), de justificatifs de votre exploitation (titre foncier ou bail, superficie cultiv�e), d'une �valuation de la valeur de votre production et de votre numéro de téléphone mobile pour le paiement.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-folder-open',
        },
        {
            question: 'La Sénégal Excursions couvre-t-elle toutes les r�gions du Sénégal ?',
            answer: "Oui, la Sénégal Excursions a pour mission de couvrir l'ensemble du monde rural s�n�galais. Nos agents sont pr�sents dans les 14 r�gions, des zones de culture pluviale du Bassin arachidier aux zones mara�ch�res du fleuve Sénégal, en passant par les zones sylvo-pastorales du nord et les r�gions foresti�res du sud.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-map-location-dot',
            link: '/agences',
            linkLabel: 'Trouver une agence'
        },

        /* ── PRODUITS ── */
        {
            question: "Quels types de produits d'assurance proposez-vous ?",
            answer: "La Sénégal Excursions propose une gamme compl�te : assurance multirisque r�colte, assurance bétail, assurance aviculture, assurance mat�riel touristique, assurance horticole/mara�ch�re, assurance indicielle climatique et assurance multi-risques. Chaque produit est con�u pour les r�alit�s du monde rural s�n�galais.",
            categoryId: 'produits',
            icon: 'fa-solid fa-shield-halved',
            link: '/services/one',
            linkLabel: 'Voir tous nos produits'
        },
        {
            question: "Qu'est-ce que l'assurance indicielle et comment fonctionne-t-elle ?",
            answer: "L'assurance indicielle est bas�e sur un indice objectif mesur� à distance (donn�es satellite ou relev�s pluviom�triques). Si cet indice tombe en dessous d'un seuil pr�d�fini (ex : d�ficit pluviom�trique de 30%), l'indemnisation est d�clench�e automatiquement, sans n�cessiter d'expertise terrain. Cela garantit rapidit� et neutralit�.",
            categoryId: 'produits',
            icon: 'fa-solid fa-satellite-dish',
        },
        {
            question: "Quelles cultures sont �ligibles à l'assurance r�colte ?",
            answer: "Nous couvrons les cultures strat�giques s�n�galaises : arachide, mil, sorgho, maïs, ni�b�, coton et riz pluvial. Des extensions sp�cifiques couvrent les cultures irrigu�es (riz paddy, tomate, oignon) dans les zones de Saint-Louis, Podor et Matam.",
            categoryId: 'produits',
            icon: 'fa-solid fa-wheat-awn',
        },
        {
            question: "Les �leveurs peuvent-ils b�n�ficier de l'assurance bétail ?",
            answer: "Oui, l'assurance bétail Sénégal Excursions couvre la mortalit� suite à des accidents, des maladies contagieuses r�pertori�es (fi�vre aphteuse, PPCB, charbon symptomatique, peste bovine) ou des catastrophes naturelles. Elle est disponible pour les bovins, ovins, caprins et camelins.",
            categoryId: 'produits',
            icon: 'fa-solid fa-cow',
        },
        {
            question: "Comment est d�termin�e la valeur assur�e de mon exploitation ?",
            answer: "La valeur assur�e est �tablie conjointement avec notre conseiller sur la base de : la superficie cultiv�e, les rendements moyens des 3 derni�res campagnes, le prix de march� des cultures et le coût des intrants investis. Un formulaire d'�valuation est compl�t� lors de la souscription.",
            categoryId: 'produits',
            icon: 'fa-solid fa-calculator',
        },

        /* ── SINISTRES ── */
        {
            question: 'Comment d�clarer un sinistre à la Sénégal Excursions ?',
            answer: "En cas de sinistre, d�clarez-le dans les 72 heures suivant la constatation des dommages. Contactez votre agence Sénégal Excursions la plus proche ou appelez le (+221) 33 869 78 00. Un expert sera d�p�ch� sur votre exploitation pour �valuer les dommages de mani�re contradictoire.",
            categoryId: 'sinistres',
            icon: 'fa-solid fa-triangle-exclamation',
            link: '/contact-us',
            linkLabel: 'D�clarer en ligne'
        },
        {
            question: "Quel est le d�lai d'indemnisation apr�s un sinistre ?",
            answer: "Apr�s validation de votre dossier par nos experts, l'indemnisation est vers�e dans un d�lai maximum de 30 jours. Pour l'assurance indicielle, l'indemnisation est d�clench�e automatiquement d�s que l'indice atteint le seuil pr�vu, sans visite d'expertise, ce qui r�duit consid�rablement les d�lais.",
            categoryId: 'sinistres',
            icon: 'fa-solid fa-clock-rotate-left',
        },
        {
            question: "Quels documents fournir lors de la déclaration d'un sinistre ?",
            answer: "Pour votre déclaration de sinistre, pr�parez : votre police d'assurance, une description des dommages avec dates et causes, des photos si possible et tout document attestant des pertes (bons d'achat d'intrants, factures). Notre conseiller vous guidera dans la constitution du dossier.",
            categoryId: 'sinistres',
            icon: 'fa-solid fa-folder-open',
        },

        /* ── PAIEMENT ── */
        {
            question: 'Quelles sont les options de paiement disponibles ?',
            answer: "Vous pouvez régler votre prime par virement bancaire, ch�que, esp�ces en agence ou via les solutions de mobile money : Wave, Orange Money et Free Money. Depuis 2024, la souscription et le paiement sont disponibles directement depuis votre téléphone.",
            categoryId: 'paiement',
            icon: 'fa-solid fa-credit-card',
        },
        {
            question: "Comment sont calcul�es les primes d'assurance ?",
            answer: "Les primes sont calcul�es selon : la valeur assur�e de votre production, le type de culture ou d'�levage, la zone g�ographique et le niveau de risque climatique local, le type de garantie choisi et vos ant�c�dents de sinistres. Notre conseiller vous proposera le tarif le plus adapt�.",
            categoryId: 'paiement',
            icon: 'fa-solid fa-calculator',
        },
        {
            question: "Peut-on payer la prime en plusieurs fois ?",
            answer: "Oui, dans le cadre de nos programmes de facilitation d'accès, la Sénégal Excursions propose des facilit�s de paiement pour les petits exploitants. Un premier versement de 50% est requis à la souscription, le solde devant �tre r�gl� avant la fin de la p�riode de souscription. Renseignez-vous aupr�s de votre agence.",
            categoryId: 'paiement',
            icon: 'fa-solid fa-money-bill-wave',
        },
    ];

    setCategory(id: string) {
        this.activeCategory = id;
        this.searchQuery = '';
    }

    onSearch() {
        this.activeCategory = 'tous';
    }

    get filteredFaqs(): FaqItem[] {
        let list = this.faqs;
        if (this.searchQuery.trim().length > 1) {
            const q = this.searchQuery.toLowerCase();
            return list.filter(f =>
                f.question.toLowerCase().includes(q) ||
                f.answer.toLowerCase().includes(q)
            );
        }
        if (this.activeCategory !== 'tous') {
            return list.filter(f => f.categoryId === this.activeCategory);
        }
        return list;
    }

    get activeCategoryLabel(): string {
        return this.categories.find(c => c.id === this.activeCategory)?.label ?? '';
    }
}
