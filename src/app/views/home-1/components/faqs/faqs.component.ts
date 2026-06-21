import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CnaasApiService } from '../../../../services/cnaas-api.service';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule, RouterLink],
  templateUrl: './faqs.component.html',
  styles: ``
})
export class FaqsComponent implements OnInit {
    faqData: any[] = [];
    loading = true;

    constructor() {}

    ngOnInit(): void {
        // Mocks for tourism FAQs
        this.faqData = [
            {
                question: 'Comment puis-je réserver une excursion ?',
                reponse: 'Vous pouvez réserver directement sur notre site web en sélectionnant l\'excursion de votre choix et en remplissant le formulaire. Vous recevrez une confirmation immédiate.'
            },
            {
                question: 'Quels sont les modes de paiement acceptés ?',
                reponse: 'Nous acceptons les paiements par carte bancaire (Visa, MasterCard), PayPal et via les services de Mobile Money locaux (Orange Money, Wave).'
            },
            {
                question: 'Puis-je annuler ou modifier ma réservation ?',
                reponse: 'Oui, vous pouvez annuler gratuitement jusqu\'à 48 heures avant le début de l\'excursion. Au-delà, des frais d\'annulation peuvent s\'appliquer.'
            },
            {
                question: 'Les excursions sont-elles adaptées aux enfants ?',
                reponse: 'La majorité de nos excursions sont familiales. Les conditions spécifiques ou limites d\'âge sont toujours précisées dans les détails de chaque excursion.'
            },
            {
                question: 'Que dois-je apporter lors d\'une excursion ?',
                reponse: 'Nous recommandons toujours de prévoir des vêtements confortables, de la crème solaire, un chapeau, des lunettes de soleil et une bouteille d\'eau. Le matériel spécifique est fourni par nos guides.'
            }
        ];
        this.loading = false;
    }

    getIcon(text: string): string {
        const n = (text || '').toLowerCase();
        if (n.includes('réserver') || n.includes('reservation') || n.includes('paiement')) return 'fa-solid fa-credit-card';
        if (n.includes('annuler') || n.includes('modifier')) return 'fa-solid fa-calendar-xmark';
        if (n.includes('enfant') || n.includes('famille')) return 'fa-solid fa-children';
        if (n.includes('apporter') || n.includes('matériel') || n.includes('vêtement')) return 'fa-solid fa-suitcase';
        return 'fa-solid fa-circle-question';
    }

    getColor(index: number): string {
        const colors = ['#28a745', '#198754', '#20c997', '#0f5132', '#556B2F'];
        return colors[index % colors.length];
    }
}
