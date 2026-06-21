import type { PricingPlanType } from "@/types";

export const pricingPlans: PricingPlanType[] = [
    {
        name: 'Découverte',
        description: 'Idéal pour les voyageurs solo ou en couple qui souhaitent explorer une destination phare du Sénégal.',
        monthlyPrice: 25000,
        yearlyPrice: 250000,
        billingNote: 'Par personne',
        title: 'Ce que vous obtenez',
        features: [
            'Excursion d\'une journée complète',
            'Guide local certifié inclus',
            'Transport aller-retour depuis Dakar',
            'Entrées des sites touristiques',
            'Collation locale offerte'
        ],
        active: false,
        aos: 'flip-right',
        duration: 800
    },
    {
        name: 'Aventure',
        description: 'La formule la plus populaire pour découvrir 2 à 3 destinations avec hébergement et repas inclus.',
        monthlyPrice: 75000,
        yearlyPrice: 700000,
        billingNote: 'Par personne',
        title: 'Tout ce qu\'inclut cette offre',
        features: [
            'Circuit de 2 à 3 jours',
            'Guide bilingue dédié',
            'Transport confortable climatisé',
            'Hébergement en lodge ou hôtel',
            'Repas traditionnels inclus (2 repas/jour)',
            'Entrées et visites guidées',
            'Photos souvenirs offertes'
        ],
        active: true,
        aos: 'flip-left',
        duration: 1000
    },
    {
        name: 'Grand Tour',
        description: 'L\'expérience ultime pour découvrir tout le Sénégal : Dakar, Gorée, Saloum, Casamance, Saint-Louis.',
        monthlyPrice: 150000,
        yearlyPrice: 1400000,
        billingNote: 'Par personne',
        title: 'Couverture complète incluse',
        features: [
            'Circuit complet de 7 à 10 jours',
            'Guide expert toutes régions',
            'Véhicule 4x4 privatisé',
            'Hébergements premium sélectionnés',
            'Pension complète incluse',
            'Activités nautiques et culturelles',
            'Assurance voyage incluse',
            'Assistance 24h/7j'
        ],
        active: false,
        aos: 'flip-right',
        duration: 1200
    }
];
