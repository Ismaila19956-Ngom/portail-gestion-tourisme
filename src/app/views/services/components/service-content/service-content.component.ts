import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-content',
  imports: [NgbAccordionModule, CommonModule, FormsModule],
  templateUrl: './service-content.component.html',
  styles: ``
})
export class ServiceContentComponent {

    /* â”€â”€ FAQ â”€â”€ */
    faqs = [
        {
            question: "Quelles cultures sont couvertes par l'assurance récolte Sénégal Excursions ?",
            answer: "L'assurance multirisque récolte Sénégal Excursions couvre les principales cultures pluviales sénégalaises : mil, sorgho, maÃ¯s, arachide, niébé et coton. Des extensions spécifiques sont disponibles pour les cultures irriguées (riz, tomate, oignon) dans les zones de Saint-Louis et Podor."
        },
        {
            question: "Comment fonctionne l'indemnisation en cas de sinistre ?",
            answer: "Dès la déclaration d'un sinistre, un expert Sénégal Excursions ou un partenaire agréé se déplace sur votre exploitation dans un délai de 72 heures. L'évaluation des dommages est réalisée contradictoirement, et l'indemnisation est versée dans un délai maximum de 30 jours après l'accord du dossier."
        },
        {
            question: "Puis-je souscrire via mobile money ?",
            answer: "Oui, depuis la campagne 2024, la Sénégal Excursions a intégré les paiements via Wave et Orange Money. Vous pouvez souscrire et payer votre prime directement depuis votre téléphone, sans vous déplacer, grâce Ã  nos agents itinérants ou via notre portail en ligne."
        },
        {
            question: "L'assurance indicielle nécessite-t-elle une expertise terrain ?",
            answer: "Non, c'est l'un des grands avantages de l'assurance indicielle. L'indemnisation est déclenchée automatiquement sur la base de données objectives (relevés pluviométriques, indices satellitaires NDVI) sans nécessiter d'expertise sur le terrain. Cela garantit une rapidité et une neutralité totales dans le processus d'indemnisation."
        },
        {
            question: "Quels sont les délais de souscription pour la campagne 2025 ?",
            answer: "La période de souscription pour la campagne hivernale 2025 est ouverte du 1er mars au 31 mai 2025. Passé cette date, aucune nouvelle souscription ne sera acceptée pour la saison en cours. Contactez rapidement votre agent Sénégal Excursions le plus proche."
        },
        {
            question: "Comment contacter un conseiller Sénégal Excursions ?",
            answer: "Vous pouvez contacter la Sénégal Excursions au (+221) 33 869 78 00 (du lundi au vendredi, 8h-17h) ou par email Ã  contact@senegal-excursions.sn. Des agents sont également présents dans chacune des 14 régions du Sénégal. Retrouvez l'agence la plus proche via notre carte des agences."
        }
    ];

    /* â”€â”€ Avis clients â”€â”€ */
    reviews = [
        {
            image: 'assets/img/all-images/testimonial-img14.png',
            name: 'Ousmane Faye',
            role: 'Céréaliculteur â€” Louga',
            rating: 5,
            date: 'Octobre 2024',
            text: "Grâce Ã  l'assurance récolte Sénégal Excursions, j'ai pu être indemnisé après la sécheresse de juillet. La procédure a été simple et rapide. Je renouvelle sans hésiter pour 2025."
        },
        {
            image: 'assets/img/all-images/testimonial-img15.png',
            name: 'Fatou Diop',
            role: 'Maraîchère â€” Thiès',
            rating: 5,
            date: 'Décembre 2024',
            text: "L'expert Sénégal Excursions est venu dans les 48h après ma déclaration. L'indemnisation a couvert mes pertes Ã  hauteur de 85%. Je suis très satisfaite du service."
        },
        {
            image: 'assets/img/all-images/testimonial-img16.png',
            name: 'Ibrahima Baldé',
            role: 'Éleveur â€” Kolda',
            rating: 4,
            date: 'Novembre 2024',
            text: "La Sénégal Excursions est une vraie bouée de sauvetage pour nous les éleveurs du Fouladou. J'ai perdu plusieurs têtes de bétail lors de la fièvre aphteuse et j'ai été remboursé correctement."
        }
    ];

    /* â”€â”€ Formulaire avis â”€â”€ */
    newReview = { prenom: '', email: '', message: '', rating: 0 };
    hoverRating = 0;
    reviewSubmitted = false;

    setRating(r: number) { this.newReview.rating = r; }
    setHover(r: number) { this.hoverRating = r; }
    clearHover() { this.hoverRating = 0; }

    onSubmitReview() {
        if (this.newReview.prenom && this.newReview.email && this.newReview.message && this.newReview.rating > 0) {
            this.reviewSubmitted = true;
            this.newReview = { prenom: '', email: '', message: '', rating: 0 };
            this.hoverRating = 0;
            setTimeout(() => this.reviewSubmitted = false, 4000);
        }
    }

    get avgRating(): number {
        if (!this.reviews.length) return 0;
        return Math.round(this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length * 10) / 10;
    }
}
