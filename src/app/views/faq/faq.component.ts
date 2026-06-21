import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnaasApiService } from '../../services/cnaas-api.service';
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

  constructor(private api: CnaasApiService) {}

  ngOnInit(): void {
    this.loadGlobalFaqs();
  }

  loadGlobalFaqs(): void {
    this.loading = true;
    this.error = false;
    
    // Pour l'instant, on récupère toutes les FAQs en appelant un endpoint global
    // Si l'endpoint getAllFaqs n'existe pas, on peut utiliser un contournement ou l'ajouter.
    // Supposons qu'on a une méthode getAllFaqs()
    if ((this.api as any).getAllFaqs) {
        (this.api as any).getAllFaqs().pipe(catchError(() => of([]))).subscribe((faqs: any) => {
            this.faqs = faqs;
            this.filteredFaqs = [...this.faqs];
            this.loading = false;
        });
    } else {
        console.log('Utilisation du fallback (par produits)...');
        this.api.getProduits().subscribe(produits => {
            console.log('Produits récupérés:', produits);
            const allFaqs: any[] = [];
            let completed = 0;
            if (!produits || produits.length === 0) {
                console.log('Aucun produit trouvé');
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
                            console.log('Toutes les requêtes sont terminées. Total FAQs:', allFaqs);
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
