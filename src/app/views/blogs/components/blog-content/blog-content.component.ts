import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-blog-content',
    imports: [CommonModule, FormsModule],
    templateUrl: './blog-content.component.html',
    styles: ``
})
export class BlogContentComponent {

    /* â”€â”€ Commentaires â”€â”€ */
    comments = [
        {
            image: 'assets/img/all-images/testimonial-img11.png',
            name: 'Mamadou Diallo',
            date: '12 Mars 2025',
            role: 'Agriculteur â€” Kaolack',
            rating: 5,
            isReply: false,
            text: `Très bonne initiative de la Sénégal Excursions ! L'assurance indicielle m'a vraiment aidé lors de la sécheresse de 2024. L'indemnisation a été rapide, sans complication. Je recommande vivement Ã  tous les agriculteurs du Sénégal de souscrire avant la campagne 2025.`
        },
        {
            image: 'assets/img/all-images/testimonial-img12.png',
            name: 'AÃ¯ssatou Ndiaye',
            date: '14 Mars 2025',
            role: 'Éleveuse â€” Thiès',
            rating: 4,
            isReply: true,
            text: `Je suis totalement d'accord avec Mamadou. J'ai souscrit Ã  l'assurance bétail et j'ai été indemnisée rapidement lors d'une épizootie. Merci Sénégal Excursions pour votre professionnalisme et votre réactivité sur le terrain.`
        },
        {
            image: 'assets/img/all-images/testimonial-img13.png',
            name: 'Ibrahim Sow',
            date: '15 Mars 2025',
            role: 'Maraîcher â€” Saint-Louis',
            rating: 5,
            isReply: false,
            text: `Article très instructif ! Les conditions climatiques deviennent de plus en plus imprévisibles. Avoir une assurance adaptée est devenu indispensable pour nous, les agriculteurs du nord du Sénégal. Je vais me renseigner pour la campagne 2025.`
        }
    ];

    get commentCount(): number {
        return this.comments.filter(c => !c.isReply).length;
    }

    /* â”€â”€ Formulaire commentaire â”€â”€ */
    newComment = { prenom: '', nom: '', email: '', telephone: '', message: '' };
    formSubmitted = false;

    onSubmitComment() {
        if (this.newComment.prenom && this.newComment.email && this.newComment.message) {
            this.formSubmitted = true;
            this.newComment = { prenom: '', nom: '', email: '', telephone: '', message: '' };
            setTimeout(() => this.formSubmitted = false, 4000);
        }
    }
}
