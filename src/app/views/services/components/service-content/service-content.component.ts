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
            question: "Quelles destinations sont proposées par Sénégal Excursions ?",
            answer: "Sénégal Excursions couvre l'ensemble du territoire sénégalais : Dakar et sa presqu'île, l'île de Gorée, la Petite Côte, le Sine-Saloum, Saint-Louis et le delta du fleuve, la Casamance et bien d'autres destinations. Des extensions vers la Gambie et la Guinée-Bissau sont également disponibles sur demande."
        },
        {
            question: "Comment fonctionne la réservation d'une excursion ?",
            answer: "La réservation se fait en trois étapes simples : choisissez votre excursion sur notre portail, remplissez le formulaire de réservation avec la date souhaitée, puis effectuez le paiement sécurisé en ligne ou en agence. Vous recevez votre confirmation par e-mail dans les 24 heures."
        },
        {
            question: "Puis-je payer via mobile money ?",
            answer: "Oui, Sénégal Excursions accepte les paiements via Wave, Orange Money et Free Money. Vous pouvez régler votre excursion directement depuis votre téléphone, en toute sécurité, sans vous déplacer en agence."
        },
        {
            question: "Les excursions sont-elles adaptées aux enfants et aux personnes à mobilité réduite ?",
            answer: "Absolument. Nous proposons des circuits familiaux adaptés aux enfants dès 4 ans, avec des activités éducatives et ludiques. Des formules accessibles aux personnes à mobilité réduite sont disponibles sur certains circuits ; contactez-nous à l'avance pour que nous puissions préparer votre accueil dans les meilleures conditions."
        },
        {
            question: "Quels sont les délais d'annulation et la politique de remboursement ?",
            answer: "Toute annulation effectuée plus de 72 heures avant le départ est remboursée à 100 %. Entre 24 et 72 heures, un avoir valable 12 mois vous est proposé. En deçà de 24 heures, seuls les frais de dossier sont retenus. En cas de force majeure (conditions météo extrêmes, etc.), le remboursement intégral est garanti."
        },
        {
            question: "Comment contacter un conseiller Sénégal Excursions ?",
            answer: "Vous pouvez nous joindre au (+221) 33 869 78 00 (du lundi au vendredi, 8h–17h) ou par e-mail à contact@senegal-excursions.sn. Nos conseillers sont également présents dans nos agences réparties dans les 14 régions du Sénégal. Retrouvez l'agence la plus proche grâce à notre carte interactive."
        }
    ];

    /* ── Avis clients ── */
    reviews = [
        {
            image: 'assets/images/tourisme/voyageur_1.png',
            name: 'Marie Dupont',
            role: 'Voyageuse — Paris, France',
            rating: 5,
            date: 'Mars 2026',
            text: "Une excursion inoubliable à Gorée et dans le Sine-Saloum ! Le guide était passionné, bilingue et d'une gentillesse rare. Les paysages étaient à couper le souffle. Je recommande Sénégal Excursions à tous mes amis !"
        },
        {
            image: 'assets/images/tourisme/voyageur_2.png',
            name: 'Fatou Diallo',
            role: 'Touriste — Abidjan, Côte d\'Ivoire',
            rating: 5,
            date: 'Janvier 2026',
            text: "Le circuit Casamance était tout simplement magique. Les repas traditionnels inclus, la pirogue sur les bolongs, les villages… tout était parfaitement organisé. Le rapport qualité-prix est excellent !"
        },
        {
            image: 'assets/images/tourisme/voyageur_3.png',
            name: 'Carlos Mendes',
            role: 'Voyageur — Lisbonne, Portugal',
            rating: 4,
            date: 'Avril 2026',
            text: "J'ai découvert Saint-Louis et le Parc du Djoudj grâce à Sénégal Excursions. Le transfert depuis l'hôtel était ponctuel, le guide très compétent. Une expérience authentique que je n'oublierai pas de sitôt."
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
