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
        { id: 'tous',         label: 'Toutes les questions', icon: 'fa-solid fa-layer-group',    count: 10 },
        { id: 'reservations', label: 'Réservations',         icon: 'fa-solid fa-calendar-check', count: 2  },
        { id: 'pratique',     label: 'Infos pratiques',      icon: 'fa-solid fa-suitcase',       count: 3  },
        { id: 'voyage',       label: 'Voyage & Visas',       icon: 'fa-solid fa-passport',       count: 2  },
        { id: 'securite',     label: 'Sécurité & Services',  icon: 'fa-solid fa-shield-halved',  count: 3  },
    ];

    faqs: FaqItem[] = [
        /* ── RÉSERVATIONS ── */
        {
            question: 'Comment réserver une excursion avec Sénégal Excursions ?',
            answer: "Réserver une excursion est simple : utilisez notre formulaire de réservation en ligne, appelez-nous au (+221) 33 869 78 00 ou écrivez-nous par e-mail. Un conseiller confirmera votre réservation sous 24 heures et vous enverra tous les détails pratiques. Un acompte de 30 % est requis pour valider la réservation.",
            categoryId: 'reservations',
            icon: 'fa-solid fa-calendar-check',
            link: '/contact-us',
            linkLabel: 'Réserver maintenant'
        },
        {
            question: "Quelle est la politique d'annulation si je ne peux pas venir ?",
            answer: "Vous pouvez annuler gratuitement jusqu'à 72 heures avant le départ. Entre 72 h et 24 h avant la date, 50 % du montant total est retenu. Pour une annulation moins de 24 h avant le départ, la totalité du montant est due. Nous vous recommandons de souscrire une assurance voyage pour vous couvrir en cas d'imprévu.",
            categoryId: 'reservations',
            icon: 'fa-solid fa-ban',
        },

        /* ── INFOS PRATIQUES ── */
        {
            question: 'Vos excursions sont-elles encadrées par des guides professionnels ?',
            answer: "Oui, toutes nos excursions sont animées par des guides certifiés, bilingues (français/anglais) et passionnés par le patrimoine sénégalais. Nos guides possèdent une licence professionnelle délivrée par le Ministère du Tourisme du Sénégal et une connaissance approfondie des sites visités : Gorée, le delta du Saloum, la Casamance et bien d'autres.",
            categoryId: 'pratique',
            icon: 'fa-solid fa-user-tie',
        },
        {
            question: 'Que dois-je emporter pour une excursion au Sénégal ?',
            answer: "Nous vous recommandons d'emporter : une crème solaire haute protection, un chapeau ou une casquette, de l'eau en quantité suffisante, des vêtements légers et respirants (couvrez épaules et genoux pour visiter les sites religieux), des chaussures confortables, un répulsif anti-moustiques et votre appareil photo. Pour les excursions en pirogue ou en mer, un gilet de sauvetage vous est fourni.",
            categoryId: 'pratique',
            icon: 'fa-solid fa-suitcase',
        },
        {
            question: 'Quelle est la meilleure saison pour visiter le Sénégal ?',
            answer: "La meilleure période pour visiter le Sénégal est la saison sèche, de novembre à mai. Les températures sont agréables (25–32 °C), le ciel est dégagé et les routes sont praticables. La saison des pluies (juin–octobre) offre des paysages verdoyants et moins de touristes, mais certaines excursions peuvent être ajustées. Nos conseillers vous orientent selon vos préférences.",
            categoryId: 'pratique',
            icon: 'fa-solid fa-sun',
            link: '/contact-us',
            linkLabel: 'Planifier mon séjour'
        },

        /* ── VOYAGE & VISAS ── */
        {
            question: "Les ressortissants européens ont-ils besoin d'un visa pour le Sénégal ?",
            answer: "Les ressortissants de l'Union européenne, de la Suisse, du Canada et des États-Unis n'ont pas besoin de visa pour séjourner au Sénégal jusqu'à 90 jours. Un passeport valide 6 mois après la date de retour suffit. D'autres nationalités peuvent bénéficier d'un visa à l'arrivée. Nous vous conseillons de vérifier les exigences consulaires de votre pays avant le départ.",
            categoryId: 'voyage',
            icon: 'fa-solid fa-passport',
        },
        {
            question: 'Quels moyens de paiement acceptez-vous ?',
            answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), virement international, PayPal, ainsi que les solutions de mobile money locales : Wave, Orange Money et Free Money. Le paiement en espèces est accepté en agence. L'ensemble de nos prix est affiché en franc CFA (XOF) et en euros pour votre commodité.",
            categoryId: 'voyage',
            icon: 'fa-solid fa-credit-card',
        },

        /* ── SÉCURITÉ & SERVICES ── */
        {
            question: 'Le Sénégal est-il un pays sûr pour les touristes ?',
            answer: "Le Sénégal est reconnu comme l'une des destinations les plus sûres d'Afrique de l'Ouest, avec une longue tradition d'hospitalité appelée « Teranga ». Les zones touristiques de Dakar, Saly, Saint-Louis et la Casamance accueillent des millions de visiteurs chaque année sans incident majeur. Nos guides restent à vos côtés tout au long des excursions pour assurer votre confort et votre sécurité.",
            categoryId: 'securite',
            icon: 'fa-solid fa-shield-halved',
        },
        {
            question: "Les guides parlent-ils d'autres langues que le français ?",
            answer: "Nos guides sont tous au minimum bilingues français/anglais. Plusieurs d'entre eux parlent également l'espagnol, l'italien, l'allemand ou le portugais. Si vous avez besoin d'un guide dans une langue spécifique, signalez-le lors de votre réservation et nous ferons notre possible pour vous l'attribuer.",
            categoryId: 'securite',
            icon: 'fa-solid fa-language',
        },
        {
            question: 'Vos excursions sont-elles accessibles aux personnes à mobilité réduite ?',
            answer: "Nous proposons des excursions adaptées aux personnes à mobilité réduite sur certains sites (Dakar, Saly, parties de Saint-Louis). Pour d'autres destinations comme l'île de Gorée ou la mangrove du Saloum, les conditions du terrain sont plus contraignantes. Contactez-nous avant de réserver et nous concevrons un itinéraire personnalisé selon vos besoins.",
            categoryId: 'securite',
            icon: 'fa-solid fa-wheelchair',
            link: '/contact-us',
            linkLabel: 'Nous contacter'
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
