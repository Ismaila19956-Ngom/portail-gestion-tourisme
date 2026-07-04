import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourismeApiService } from '../../services/tourisme-api.service';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './faq.component.html',
  styles: [``]
})
export class FaqComponent implements OnInit {
  faqs: any[] = [];
  filteredFaqs: any[] = [];
  loading = true;
  error = false;
  searchQuery = '';
  activeFaqIdx = -1;

  constructor(private api: TourismeApiService) {}

  ngOnInit(): void {
    this.loadGlobalFaqs();
  }

  loadGlobalFaqs(): void {
    this.loading = true;
    this.error = false;
    
    // Pour l'instant, on r�cup�re toutes les FAQs en appelant un endpoint global
    // Si l'endpoint getAllFaqs n'existe pas, on peut utiliser un contournement ou l'ajouter.
    // Supposons qu'on a une m�thode getAllFaqs()
    if ((this.api as any).getAllFaqs) {
        (this.api as any).getAllFaqs().pipe(catchError(() => of([]))).subscribe((faqs: any) => {
            if (!faqs || faqs.length === 0) {
                // Fallback aux données de test si l'API ne retourne rien
                this.faqs = [
                    { question: 'Comment puis-je réserver une excursion ?', reponse: 'Vous pouvez réserver directement sur notre site web en sélectionnant l\'excursion de votre choix et en remplissant le formulaire. Vous recevrez une confirmation immédiate.' },
                    { question: 'Quels sont les modes de paiement acceptés ?', reponse: 'Nous acceptons les paiements par carte bancaire (Visa, MasterCard), PayPal et via les services de Mobile Money locaux.' },
                    { question: 'Puis-je annuler ou modifier ma réservation ?', reponse: 'Oui, vous pouvez annuler gratuitement jusqu\'à 48 heures avant le début de l\'excursion.' },
                    { question: 'Les excursions sont-elles adaptées aux enfants ?', reponse: 'La majorité de nos excursions sont familiales. Les conditions spécifiques sont précisées dans les détails.' },
                    { question: 'Que dois-je apporter lors d\'une excursion ?', reponse: 'Nous recommandons des vêtements confortables, de la crème solaire, un chapeau, et une bouteille d\'eau.' }
                ];
            } else {
                this.faqs = faqs;
            }
            this.filteredFaqs = [...this.faqs];
            this.loading = false;
        });
    } else {
        console.log('Utilisation du fallback (par produits)...');
        this.api.getProduits().subscribe(produits => {
            console.log('Produits rcuprs:', produits);
            const allFaqs: any[] = [];
            let completed = 0;
            if (!produits || produits.length === 0) {
                console.log('Aucun produit trouv');
                this.faqs = [
                    { question: 'Comment puis-je réserver une excursion ?', reponse: 'Vous pouvez réserver directement sur notre site web en sélectionnant l\'excursion de votre choix et en remplissant le formulaire. Vous recevrez une confirmation immédiate.' },
                    { question: 'Quels sont les modes de paiement acceptés ?', reponse: 'Nous acceptons les paiements par carte bancaire (Visa, MasterCard), PayPal et via les services de Mobile Money locaux.' },
                    { question: 'Puis-je annuler ou modifier ma réservation ?', reponse: 'Oui, vous pouvez annuler gratuitement jusqu\'à 48 heures avant le début de l\'excursion.' },
                    { question: 'Les excursions sont-elles adaptées aux enfants ?', reponse: 'La majorité de nos excursions sont familiales. Les conditions spécifiques sont précisées dans les détails.' },
                    { question: 'Que dois-je apporter lors d\'une excursion ?', reponse: 'Nous recommandons des vêtements confortables, de la crème solaire, un chapeau, et une bouteille d\'eau.' }
                ];
                this.filteredFaqs = [...this.faqs];
                this.loading = false;
                return;
            }
            produits.forEach(p => {
                this.api.getFaqsByProduit(p.id).subscribe({
                    next: (faqs: any) => {
                        console.log(`FAQs pour produit ${p.id}:`, faqs);
                        if (faqs && Array.isArray(faqs)) {
                            allFaqs.push(...faqs);
                        }
                        completed++;
                        if (completed === produits.length) {
                            console.log('Toutes les requ�tes sont termin�es. Total FAQs:', allFaqs);
                            this.faqs = allFaqs;
                            this.filteredFaqs = [...this.faqs];
                            this.loading = false;
                        }
                    },
                    error: (err) => {
                        console.error(`Erreur FAQ produit ${p.id}:`, err);
                        completed++;
                        if (completed === produits.length) {
                            this.faqs = allFaqs;
                            this.filteredFaqs = [...this.faqs];
                            this.loading = false;
                        }
                    }
                });
            });
        });
    }
  }

  toggleFaq(idx: number): void {
    this.activeFaqIdx = this.activeFaqIdx === idx ? -1 : idx;
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredFaqs = [...this.faqs];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredFaqs = this.faqs.filter(faq => 
      faq.question?.toLowerCase().includes(query) || 
      faq.reponse?.toLowerCase().includes(query)
    );
    this.activeFaqIdx = -1;
  }
}
