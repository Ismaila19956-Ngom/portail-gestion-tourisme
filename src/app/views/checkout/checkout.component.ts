import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortailTourismeService, Excursion } from '../../services/portail-tourisme.service';
import { PaymentService, PaymentRequest, PaymentResponse } from '../../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  excursion: Excursion | null = null;
  loading = true;
  processingPayment = false;
  
  // Formulaire et état
  quantity = 1;
  phoneNumber = '';
  paymentMethod: 'wave' | 'orange' = 'wave';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: PortailTourismeService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tourService.getExcursionById(+id).subscribe({
          next: (data: Excursion | null) => {
            this.excursion = data;
            this.loading = false;
            
            if (!this.excursion) {
              this.router.navigate(['/excursions']);
            }
          },
          error: () => {
            this.loading = false;
            this.router.navigate(['/excursions']);
          }
        });
      } else {
        this.router.navigate(['/excursions']);
      }
    });
  }

  get totalAmount(): number {
    return (this.excursion?.prix || 0) * this.quantity;
  }

  incrementQty(): void {
    if (this.quantity < 20) {
      this.quantity++;
    }
  }

  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectMethod(method: 'wave' | 'orange'): void {
    this.paymentMethod = method;
  }

  onSubmitPayment(): void {
    if (!this.excursion || !this.phoneNumber || this.phoneNumber.length < 9) {
      alert("Veuillez remplir correctement votre numéro de téléphone (sans le préfixe +221).");
      return;
    }

    this.processingPayment = true;

    const req: PaymentRequest = {
      excursionId: this.excursion.id!,
      qty: this.quantity,
      montant: this.totalAmount,
      telephone: '+221' + this.phoneNumber,
      methode: this.paymentMethod
    };

    this.paymentService.processGenericPayment(req).subscribe({
      next: (response: PaymentResponse) => {
        if (response.success && response.payment_url) {
          // Dans un flux réel, on redirigerait vers l'URL retournée par l'API
          console.log("Redirection vers :", response.payment_url);
          
          // Simulation de redirection en ouvrant l'URL dans un nouvel onglet,
          // puis redirection interne vers une (future) page de confirmation.
          // window.open(response.payment_url, '_blank');
          
          alert(`Paiement initialisé via ${this.paymentMethod.toUpperCase()} !\n\nURL générée (simulée) : ${response.payment_url}\n\nUne fois le paiement validé sur votre téléphone, votre réservation sera confirmée.`);
          this.router.navigate(['/excursions']); // Rediriger vers l'accueil ou confirmation
        }
        this.processingPayment = false;
      },
      error: (err: any) => {
        console.error("Erreur de paiement", err);
        alert("Une erreur est survenue lors de l'initialisation du paiement.");
        this.processingPayment = false;
      }
    });
  }

}
