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
        /* â”€â”€ SOUSCRIPTION â”€â”€ */
        {
            question: 'Comment puis-je souscrire aux produits de la Sénégal Excursions ?',
            answer: "Vous pouvez souscrire directement via notre formulaire de contact en ligne, par téléphone au (+221) 33 869 78 00, ou en vous rendant dans l'une de nos agences réparties dans les 14 régions du Sénégal. Un conseiller vous accompagnera dans le choix du produit le plus adapté Ã  votre exploitation.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-file-signature',
            link: '/contact-us',
            linkLabel: 'Contacter un conseiller'
        },
        {
            question: 'Quelle est la période de souscription pour la campagne 2025 ?',
            answer: "La période de souscription pour la campagne hivernale 2025 est ouverte du 1er mars au 31 mai 2025. Passé cette date, aucune nouvelle souscription ne pourra être acceptée pour la saison en cours. Nous vous encourageons Ã  vous rapprocher rapidement d'un agent Sénégal Excursions.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-calendar-check',
        },
        {
            question: 'Quels documents sont nécessaires pour souscrire ?',
            answer: "Pour souscrire, vous aurez besoin : d'une pièce d'identité valide (CNI ou passeport), de justificatifs de votre exploitation (titre foncier ou bail, superficie cultivée), d'une évaluation de la valeur de votre production et de votre numéro de téléphone mobile pour le paiement.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-folder-open',
        },
        {
            question: 'La Sénégal Excursions couvre-t-elle toutes les régions du Sénégal ?',
            answer: "Oui, la Sénégal Excursions a pour mission de couvrir l'ensemble du monde rural sénégalais. Nos agents sont présents dans les 14 régions, des zones de culture pluviale du Bassin arachidier aux zones maraîchères du fleuve Sénégal, en passant par les zones sylvo-pastorales du nord et les régions forestières du sud.",
            categoryId: 'souscription',
            icon: 'fa-solid fa-map-location-dot',
            link: '/agences',
            linkLabel: 'Trouver une agence'
        },

        /* â”€â”€ PRODUITS â”€â”€ */
        {
            question: "Quels types de produits d'assurance proposez-vous ?",
            answer: "La Sénégal Excursions propose une gamme complète : assurance multirisque récolte, assurance bétail, assurance aviculture, assurance matériel touristique, assurance horticole/maraîchère, assurance indicielle climatique et assurance multi-risques. Chaque produit est conçu pour les réalités du monde rural sénégalais.",
            categoryId: 'produits',
            icon: 'fa-solid fa-shield-halved',
            link: '/services/one',
            linkLabel: 'Voir tous nos produits'
        },
        {
            question: "Qu'est-ce que l'assurance indicielle et comment fonctionne-t-elle ?",
            answer: "L'assurance indicielle est basée sur un indice objectif mesuré Ã  distance (données satellite ou relevés pluviométriques). Si cet indice tombe en dessous d'un seuil prédéfini (ex : déficit pluviométrique de 30%), l'indemnisation est déclenchée automatiquement, sans nécessiter d'expertise terrain. Cela garantit rapidité et neutralité.",
            categoryId: 'produits',
            icon: 'fa-solid fa-satellite-dish',
        },
        {
            question: "Quelles cultures sont éligibles Ã  l'assurance récolte ?",
            answer: "Nous couvrons les cultures stratégiques sénégalaises : arachide, mil, sorgho, maÃ¯s, niébé, coton et riz pluvial. Des extensions spécifiques couvrent les cultures irriguées (riz paddy, tomate, oignon) dans les zones de Saint-Louis, Podor et Matam.",
            categoryId: 'produits',
            icon: 'fa-solid fa-wheat-awn',
        },
        {
            question: "Les éleveurs peuvent-ils bénéficier de l'assurance bétail ?",
            answer: "Oui, l'assurance bétail Sénégal Excursions couvre la mortalité suite Ã  des accidents, des maladies contagieuses répertoriées (fièvre aphteuse, PPCB, charbon symptomatique, peste bovine) ou des catastrophes naturelles. Elle est disponible pour les bovins, ovins, caprins et camelins.",
            categoryId: 'produits',
            icon: 'fa-solid fa-cow',
        },
        {
            question: "Comment est déterminée la valeur assurée de mon exploitation ?",
            answer: "La valeur assurée est établie conjointement avec notre conseiller sur la base de : la superficie cultivée, les rendements moyens des 3 dernières campagnes, le prix de marché des cultures et le coÃ»t des intrants investis. Un formulaire d'évaluation est complété lors de la souscription.",
            categoryId: 'produits',
            icon: 'fa-solid fa-calculator',
        },

        /* â”€â”€ SINISTRES â”€â”€ */
        {
            question: 'Comment déclarer un sinistre Ã  la Sénégal Excursions ?',
            answer: "En cas de sinistre, déclarez-le dans les 72 heures suivant la constatation des dommages. Contactez votre agence Sénégal Excursions la plus proche ou appelez le (+221) 33 869 78 00. Un expert sera dépêché sur votre exploitation pour évaluer les dommages de manière contradictoire.",
            categoryId: 'sinistres',
            icon: 'fa-solid fa-triangle-exclamation',
            link: '/contact-us',
            linkLabel: 'Déclarer en ligne'
        },
        {
            question: "Quel est le délai d'indemnisation après un sinistre ?",
            answer: "Après validation de votre dossier par nos experts, l'indemnisation est versée dans un délai maximum de 30 jours. Pour l'assurance indicielle, l'indemnisation est déclenchée automatiquement dès que l'indice atteint le seuil prévu, sans visite d'expertise, ce qui réduit considérablement les délais.",
            categoryId: 'sinistres',
            icon: 'fa-solid fa-clock-rotate-left',
        },
        {
            question: "Quels documents fournir lors de la déclaration d'un sinistre ?",
            answer: "Pour votre déclaration de sinistre, préparez : votre police d'assurance, une description des dommages avec dates et causes, des photos si possible et tout document attestant des pertes (bons d'achat d'intrants, factures). Notre conseiller vous guidera dans la constitution du dossier.",
            categoryId: 'sinistres',
            icon: 'fa-solid fa-folder-open',
        },

        /* â”€â”€ PAIEMENT â”€â”€ */
        {
            question: 'Quelles sont les options de paiement disponibles ?',
            answer: "Vous pouvez régler votre prime par virement bancaire, chèque, espèces en agence ou via les solutions de mobile money : Wave, Orange Money et Free Money. Depuis 2024, la souscription et le paiement sont disponibles directement depuis votre téléphone.",
            categoryId: 'paiement',
            icon: 'fa-solid fa-credit-card',
        },
        {
            question: "Comment sont calculées les primes d'assurance ?",
            answer: "Les primes sont calculées selon : la valeur assurée de votre production, le type de culture ou d'élevage, la zone géographique et le niveau de risque climatique local, le type de garantie choisi et vos antécédents de sinistres. Notre conseiller vous proposera le tarif le plus adapté.",
            categoryId: 'paiement',
            icon: 'fa-solid fa-calculator',
        },
        {
            question: "Peut-on payer la prime en plusieurs fois ?",
            answer: "Oui, dans le cadre de nos programmes de facilitation d'accès, la Sénégal Excursions propose des facilités de paiement pour les petits exploitants. Un premier versement de 50% est requis Ã  la souscription, le solde devant être réglé avant la fin de la période de souscription. Renseignez-vous auprès de votre agence.",
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
