import type { BlogType, MemberType, TestimonialType } from "@/types";

const blogs: BlogType[] = [
    {
        image: 'assets/images/tourisme/hero_goree.png',
        title: 'Voyage dans le temps à l\'île de Gorée',
        date: '2 Avril 2025',
        category: 'Histoire & Culture',
        description: 'Découvrez l\'histoire poignante de Gorée, ses ruelles fleuries et son architecture coloniale préservée.',
        aos: 'flip-left',
        duration: 800
    },
    {
        image: 'assets/images/tourisme/hero_saloum.png',
        title: 'Écotourisme : Les trésors du Sine-Saloum',
        date: '15 Mai 2025',
        category: 'Nature & Découverte',
        description: 'Explorez la mangrove en pirogue et rencontrez les pêcheurs locaux dans ce paradis naturel classé.',
        aos: 'flip-right',
        duration: 1000
    },
    {
        image: 'assets/images/tourisme/hero_dakar.png',
        title: 'Dakar l\'effervescente : Que faire ce week-end ?',
        date: '20 Juin 2025',
        category: 'Vie Urbaine',
        description: "De la corniche aux marchés colorés, plongez dans l'énergie vibrante de la capitale sénégalaise.",
        aos: 'flip-left',
        duration: 1200
    }
];

const teamMembers: MemberType[] = [
    {
        name: 'Mamadou Ndou',
        role: 'Fondateur & Guide Expert',
        image: 'assets/images/tourisme/guide_mamadou.png',
    },
    {
        name: 'Fatou Diallo',
        role: 'Responsable Réservations',
        image: 'assets/images/tourisme/guide_awa.png',
    },
    {
        name: 'Ibrahima Seck',
        role: 'Guide Casamance',
        image: 'assets/images/tourisme/guide_homme_1.png',
    },
    {
        name: 'Aissatou Ndiaye',
        role: 'Guide Sine-Saloum',
        image: 'assets/images/tourisme/guide_femme_1.png',
    }
];

const testimonialData:TestimonialType[] = [
    {
        message: `Notre excursion dans le Sine-Saloum était tout simplement magique. Le guide Ibrahima connaît chaque recoin du delta. Je recommande à 100% !`,
        authorImg: 'assets/images/tourisme/traveler_woman_1_1783120641754.png',
        name: 'Sophie Martin',
        role: '🇫🇷 Voyageuse – Février 2025',
    },
    {
        message: `The Casamance tour was absolutely breathtaking. Our guide spoke perfect English and really made the difference. Will definitely book again!`,
        authorImg: 'assets/images/tourisme/traveler_man_1_1783120626926.png',
        name: 'James O\'Brien',
        role: '🇬🇧 Traveller – March 2025',
    },
    {
        message: `L'île de Gorée nous a profondément émus. Le guide a raconté l'histoire avec beaucoup d'émotion et de respect. Merci infiniment à toute l'équipe !`,
        authorImg: 'assets/images/tourisme/voyageur_1.png',
        name: 'Aminata Diallo',
        role: '🇸🇳 Touriste – Avril 2025',
    },
    {
        message: `Première fois au Sénégal et quelle découverte ! L'excursion à Saint-Louis et au parc des oiseaux du Djoudj était incroyable. Bravo !`,
        authorImg: 'assets/images/tourisme/voyageur_2.png',
        name: 'Carlos Mendez',
        role: '🇪🇸 Voyageur – Mai 2025',
    },
    {
        message: `J'ai réservé le circuit multi-destinations Dakar-Saloum-Casamance pour notre voyage de noces. Tout était parfait. Un souvenir que nous garderons toute notre vie.`,
        authorImg: 'assets/images/tourisme/traveler_couple_1783120610142.png',
        name: 'Marie & Luc Fontaine',
        role: '🇧🇪 Couple – Janvier 2025',
    },
    {
        message: `مذهل! رحلة السفاري في حديقة نيوكولو كوبا كانت من أجمل تجاربي في حياتي. الدليل محترف جداً ويعرف كل شيء عن الحيوانات.`,
        authorImg: 'assets/images/tourisme/voyageur_3.png',
        name: 'Ahmed Al-Rashidi',
        role: '🇸🇦 Touriste – Juin 2025',
    },
    {
        message: `Nous avons emmené nos trois enfants pour l'excursion famille au parc de Bandia. C'était adapté à tous les âges. Les enfants ont adoré !`,
        authorImg: 'assets/images/tourisme/guide_femme_2.png',
        name: 'Nathalie Dubois',
        role: '🇨🇭 Famille – Décembre 2024',
    },
    {
        message: `The booking process was super easy and the response was very fast. Our guide was punctual, knowledgeable and fun. Highly recommended!`,
        authorImg: 'assets/images/tourisme/guide_homme_2.png',
        name: 'Priya Sharma',
        role: '🇮🇳 Traveller – November 2024',
    }
];

export { blogs, teamMembers, testimonialData };
