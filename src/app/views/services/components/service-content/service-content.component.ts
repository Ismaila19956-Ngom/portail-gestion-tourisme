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

    /* ── FAQ ── */
    faqs = [
        {
            question: "Quelles cultures sont couvertes par l'assurance r�colte Sénégal Excursions ?",
            answer: "L'assurance multirisque r�colte Sénégal Excursions couvre les principales cultures pluviales s�n�galaises : mil, sorgho, maïs, arachide, ni�b� et coton. Des extensions sp�cifiques sont disponibles pour les cultures irrigu�es (riz, tomate, oignon) dans les zones de Saint-Louis et Podor."
        },
        {
            question: "Comment fonctionne l'indemnisation en cas de sinistre ?",
            answer: "D�s la déclaration d'un sinistre, un expert Sénégal Excursions ou un partenaire agr�� se d�place sur votre exploitation dans un d�lai de 72 heures. L'�valuation des dommages est r�alis�e contradictoirement, et l'indemnisation est vers�e dans un d�lai maximum de 30 jours apr�s l'accord du dossier."
        },
        {
            question: "Puis-je souscrire via mobile money ?",
            answer: "Oui, depuis la campagne 2024, la Sénégal Excursions a int�gr� les paiements via Wave et Orange Money. Vous pouvez souscrire et payer votre prime directement depuis votre téléphone, sans vous d�placer, gr�ce à nos agents itin�rants ou via notre portail en ligne."
        },
        {
            question: "L'assurance indicielle n�cessite-t-elle une expertise terrain ?",
            answer: "Non, c'est l'un des grands avantages de l'assurance indicielle. L'indemnisation est d�clench�e automatiquement sur la base de donn�es objectives (relev�s pluviom�triques, indices satellitaires NDVI) sans n�cessiter d'expertise sur le terrain. Cela garantit une rapidit� et une neutralit� totales dans le processus d'indemnisation."
        },
        {
            question: "Quels sont les d�lais de souscription pour la campagne 2025 ?",
            answer: "La p�riode de souscription pour la campagne hivernale 2025 est ouverte du 1er mars au 31 mai 2025. Pass� cette date, aucune nouvelle souscription ne sera accept�e pour la saison en cours. Contactez rapidement votre agent Sénégal Excursions le plus proche."
        },
        {
            question: "Comment contacter un conseiller Sénégal Excursions ?",
            answer: "Vous pouvez contacter la Sénégal Excursions au (+221) 33 869 78 00 (du lundi au vendredi, 8h-17h) ou par email à contact@senegal-excursions.sn. Des agents sont �galement pr�sents dans chacune des 14 r�gions du Sénégal. Retrouvez l'agence la plus proche via notre carte des agences."
        }
    ];

    /* ── Avis clients ── */
    reviews = [
        {
            image: 'assets/img/all-images/testimonial-img14.png',
            name: 'Ousmane Faye',
            role: 'C�r�aliculteur — Louga',
            rating: 5,
            date: 'Octobre 2024',
            text: "Gr�ce à l'assurance r�colte Sénégal Excursions, j'ai pu �tre indemnis� apr�s la s�cheresse de juillet. La proc�dure a �t� simple et rapide. Je renouvelle sans h�siter pour 2025."
        },
        {
            image: 'assets/img/all-images/testimonial-img15.png',
            name: 'Fatou Diop',
            role: 'Mara�ch�re — Thi�s',
            rating: 5,
            date: 'D�cembre 2024',
            text: "L'expert Sénégal Excursions est venu dans les 48h apr�s ma déclaration. L'indemnisation a couvert mes pertes à hauteur de 85%. Je suis très satisfaite du service."
        },
        {
            image: 'assets/img/all-images/testimonial-img16.png',
            name: 'Ibrahima Bald�',
            role: '�leveur — Kolda',
            rating: 4,
            date: 'Novembre 2024',
            text: "La Sénégal Excursions est une vraie bou�e de sauvetage pour nous les �leveurs du Fouladou. J'ai perdu plusieurs t�tes de bétail lors de la fi�vre aphteuse et j'ai �t� rembours� correctement."
        }
    ];

    /* ── Formulaire avis ── */
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
