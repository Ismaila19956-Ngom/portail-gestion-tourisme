import type { FAQType, MemberType, ServiceType, TestimonialType } from "@/types";
import type { BlogType } from "./types";

const serviceData: ServiceType[] = [
    {
        duration: 800,
        image: 'assets/img/all-images/service-img1.png',
        id: 1,
        title: 'Excursions Culturelles',
        description: 'Plongez dans la richesse de la culture sénégalaise : île de Gorée, villages traditionnels, marchés colorés et cérémoniels.',
    },
    {
        duration: 900,
        image: 'assets/img/all-images/service-img2.png',
        id: 2,
        title: 'Safari & Nature',
        description: 'Découvrez la faune sauvage du Sénégal : parc du Niokolo-Koba, réserve de Bandia, oiseaux du Sine-Saloum.',
    },
    {
        duration: 1000,
        image: 'assets/img/all-images/service-img3.png',
        id: 3,
        title: 'Aventure & Randonnée',
        description: 'Explorez les forêts de Casamance, les dunes de Lompoul ou les collines de Dindefelo Ã  pied ou en 4x4.',
    },
    {
        duration: 1100,
        image: 'assets/img/all-images/service-img1.png',
        id: 4,
        title: 'Croisières & Pêche',
        description: 'Naviguez sur le fleuve Sénégal, le delta du Saloum ou partez en mer avec nos pêcheurs locaux.',
    },
    {
        duration: 1200,
        image: 'assets/img/all-images/service-img2.png',
        id: 5,
        title: 'Gastronomie & Art de Vivre',
        description: 'Cours de cuisine sénégalaise, dégustations de thiéboudienne, yassa, mafé, et visite des marchés d\'épices.',
    },
    {
        duration: 1300,
        image: 'assets/img/all-images/service-img3.png',
        id: 6,
        title: 'Circuits Multi-destinations',
        description: 'Packages tout-inclus combinant Dakar, Saint-Louis, Casamance et le Sine-Saloum en une expérience complète.',
    },
]

const workData = [
    {
        id: 1,
        icon: 'assets/img/icons/work1.svg',
        duration: 800,
        title: 'Choisissez votre Excursion',
        image: 'assets/images/tourisme/excursion_dakar_1781800534313.png',
        description: 'Parcourez notre catalogue d\'excursions et filtrez par région, type d\'activité, durée et budget. Lisez les avis de nos voyageurs satisfaits pour faire le meilleur choix.'
    },
    {
        id: 2,
        icon: 'assets/img/icons/work2.svg',
        title: 'Réservez en Ligne',
        duration: 1000,
        image: 'assets/images/tourisme/excursion_goree_1781800606230.png',
        description: 'Remplissez le formulaire de réservation en quelques minutes. Choisissez vos dates, le nombre de participants et votre mode de paiement préféré (carte, PayPal, Mobile Money).'
    },
    {
        id: 3,
        icon: 'assets/img/icons/work3.svg',
        title: 'Confirmation Immédiate',
        image: 'assets/images/tourisme/excursion_saloum_1781800545237.png',
        duration: 1200,
        description: 'Recevez votre confirmation par email sous 2 heures avec tous les détails : point de rendez-vous, programme détaillé, liste du matériel recommandé et contact du guide.'
    },
    {
        id: 4,
        icon: 'assets/img/icons/work4.svg',
        title: 'Vivez l\'Expérience',
        duration: 1400,
        image: 'assets/images/tourisme/excursion_casamance_1781800557434.png',
        description: 'Votre guide local certifié vous accueille et vous accompagne tout au long de l\'excursion. Profitez, photographiez, découvrez. Partagez ensuite votre avis pour aider les futurs voyageurs.'
    }
]

const teamMembers: MemberType[] = [
    {
        name: 'Mamadou Ndou',
        role: 'Fondateur & Guide Expert',
        image: 'assets/img/all-images/team-img1.png',
    },
    {
        name: 'Fatou Diallo',
        role: 'Responsable Réservations',
        image: 'assets/img/all-images/team-img2.png',
    },
    {
        name: 'Ibrahima Seck',
        role: 'Guide Casamance',
        image: 'assets/img/all-images/team-img3.png',
    },
    {
        name: 'Aissatou Ndiaye',
        role: 'Guide Sine-Saloum',
        image: 'assets/img/all-images/team-img4.png',
    }
];

const faqData: FAQType[] = [
    {
        question: 'Comment réserver une excursion ?',
        answer: 'Vous pouvez réserver directement sur notre site en cliquant sur "Réserver" de l\'excursion choisie, nous contacter par WhatsApp au +221 77 654 32 10, ou envoyer un email Ã  contact@senegal-excursions.sn. La confirmation est envoyée sous 2 heures.'
    },
    {
        question: 'Quels modes de paiement acceptez-vous ?',
        answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, Wave et Orange Money. Le paiement est sécurisé et la confirmation est immédiate. Un acompte de 30% peut être demandé pour les excursions multi-jours.'
    },
    {
        question: 'Puis-je annuler ou modifier ma réservation ?',
        answer: 'Oui, l\'annulation est gratuite jusqu\'Ã  48h avant le départ. Entre 48h et 24h, 50% du montant est retenu. Moins de 24h, la totalité est due. Vous pouvez modifier votre date sans frais jusqu\'Ã  72h avant.'
    },
    {
        question: 'Les guides parlent-ils anglais ou d\'autres langues ?',
        answer: 'Tous nos guides sont bilingues français/anglais. Certains parlent également espagnol, portugais ou wolof. Précisez votre langue préférée lors de la réservation pour que nous vous assignions le guide le plus adapté.'
    },
    {
        question: 'Que comprend le prix de l\'excursion ?',
        answer: 'Le prix inclut le transport aller-retour depuis Dakar, le guide local certifié, les entrées des sites visités et les repas mentionnés dans le programme. Les boissons personnelles et les achats souvenirs sont Ã  votre charge.'
    },
    {
        question: 'Est-ce que les excursions sont adaptées aux enfants ?',
        answer: 'La majorité de nos excursions sont adaptées aux familles avec enfants. Les activités physiques intenses (randonnée, escalade) sont clairement indiquées. Nous proposons des tarifs réduits pour les enfants de moins de 12 ans.'
    }
];

const blogs: BlogType[] = [
    {
        image: 'assets/images/tourisme/excursion_saloum_1781800545237.png',
        title: 'Top 5 des expériences incontournables dans le Sine-Saloum',
        date: '15 Juin 2025',
        category: 'Nature & Éco-tourisme',
        description: 'Le delta du Sine-Saloum, classé Réserve de Biosphère par l\'UNESCO, offre des paysages Ã  couper le souffle. Découvrez comment en profiter au maximum.',
        aos: 'flip-left',
        duration: 800
    },
    {
        image: 'assets/images/tourisme/excursion_dakar_1781800534313.png',
        title: 'Guide complet : Visiter Dakar en 48 heures comme un local',
        date: '8 Juillet 2025',
        category: 'Culture & Ville',
        description: 'Marchés, restaurant de thiéboudienne, Monument de la Renaissance, quartier de Plateau : notre guide insider pour une immersion totale dans la capitale.',
        aos: 'flip-right',
        duration: 1000
    },
    {
        image: 'assets/images/tourisme/excursion_casamance_1781800557434.png',
        title: 'Casamance : la Sénégal secrète que tout voyageur doit découvrir',
        date: '20 AoÃ»t 2025',
        category: 'Aventure',
        description: 'La Casamance est la région la plus verte du Sénégal. Forêts sacrées, rizières, villages Diola : une autre Afrique vous attend au sud du pays.',
        aos: 'flip-left',
        duration: 1200
    }
];

const testimonialData: TestimonialType[] = [
    {
        message: 'Notre excursion dans le Sine-Saloum était tout simplement magique. Le guide Ibrahima connaît chaque recoin du delta. La pirogue Ã  travers les mangroves au coucher du soleil est un souvenir inoubliable. Je recommande Ã  100% !',
        authorImg: 'assets/img/all-images/testimonial-img2.png',
        name: 'Sophie Martin',
        role: 'ðŸ‡«ðŸ‡· Voyageuse – Février 2025',
    },
    {
        message: 'The Casamance tour was absolutely breathtaking. Our guide spoke perfect English and really made the difference. The sacred forest and the traditional village were beyond expectations. Will definitely book again!',
        authorImg: 'assets/img/all-images/testimonial-img3.png',
        name: 'James O\'Brien',
        role: 'ðŸ‡¬ðŸ‡§ Traveller – March 2025',
    },
    {
        message: 'L\'île de Gorée nous a profondément émus. Le guide a raconté l\'histoire avec beaucoup d\'émotion et de respect. L\'organisation était parfaite, de la réservation au retour. Merci infiniment Ã  toute l\'équipe !',
        authorImg: 'assets/img/all-images/testimonial-img4.png',
        name: 'Aminata Diallo',
        role: 'ðŸ‡¨ðŸ‡® Touriste – Avril 2025',
    },
    {
        message: 'Première fois au Sénégal et quelle découverte ! L\'excursion Ã  Saint-Louis et au parc des oiseaux du Djoudj était incroyable. Mamadou et son équipe sont des professionnels passionnés. Bravo !',
        authorImg: 'assets/img/all-images/testimonial-img5.png',
        name: 'Carlos Mendez',
        role: 'ðŸ‡ªðŸ‡¸ Voyageur – Mai 2025',
    },
    {
        message: 'J\'ai réservé le circuit multi-destinations Dakar-Saloum-Casamance pour notre voyage de noces. Tout était parfait : les hôtels, les repas, les guides. Un souvenir que nous garderons toute notre vie.',
        authorImg: 'assets/img/all-images/testimonial-img1.png',
        name: 'Marie & Luc Fontaine',
        role: 'ðŸ‡§ðŸ‡ª Couple – Janvier 2025',
    },
    {
        message: 'Ù…Ø°Ù‡Ù„! Ø±Ø­Ù„Ø© Ø§Ù„Ø³ÙØ§Ø±ÙŠ ÙÙŠ Ø­Ø¯ÙŠÙ‚Ø© Ù†ÙŠÙˆÙƒÙˆÙ„Ùˆ ÙƒÙˆØ¨Ø§ ÙƒØ§Ù†Øª Ù…Ù† Ø£Ø¬Ù…Ù„ ØªØ¬Ø§Ø±Ø¨ÙŠ ÙÙŠ Ø­ÙŠØ§ØªÙŠ. Ø§Ù„Ø¯Ù„ÙŠÙ„ Ù…Ø­ØªØ±Ù Ø¬Ø¯Ø§Ù‹ ÙˆÙŠØ¹Ø±Ù ÙƒÙ„ Ø´ÙŠØ¡ Ø¹Ù† Ø§Ù„Ø­ÙŠÙˆØ§Ù†Ø§Øª. Ø£Ù†ØµØ­ Ø¨Ø´Ø¯Ø© Ø¨Ù‡Ø°Ù‡ Ø§Ù„ÙˆÙƒØ§Ù„Ø© Ù„ÙƒÙ„ Ø§Ù„Ù…Ø³Ø§ÙØ±ÙŠÙ†.',
        authorImg: 'assets/img/all-images/testimonial-img2.png',
        name: 'Ahmed Al-Rashidi',
        role: 'ðŸ‡¸ðŸ‡¦ Touriste – Juin 2025',
    },
    {
        message: 'Nous avons emmené nos trois enfants pour l\'excursion famille au parc de Bandia. C\'était adapté Ã  tous les âges, sécurisé et vraiment enrichissant. Les enfants ont adoré voir les rhinocéros et les girafes !',
        authorImg: 'assets/img/all-images/testimonial-img3.png',
        name: 'Nathalie Dubois',
        role: 'ðŸ‡¨ðŸ‡­ Famille – Décembre 2024',
    },
    {
        message: 'The booking process was super easy and the response was very fast. Our guide was punctual, knowledgeable and fun. The Dakar city tour gave us a real feel of Senegal\'s vibrant culture. Highly recommended!',
        authorImg: 'assets/img/all-images/testimonial-img4.png',
        name: 'Priya Sharma',
        role: 'ðŸ‡®ðŸ‡³ Traveller – November 2024',
    },
]

export { serviceData, workData, teamMembers, faqData, blogs, testimonialData }
