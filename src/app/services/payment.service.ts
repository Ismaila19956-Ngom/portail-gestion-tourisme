import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

export interface PaymentRequest {
  excursionId: number;
  qty: number;
  montant: number;
  telephone: string;
  methode: 'wave' | 'orange';
}

export interface PaymentResponse {
  success: boolean;
  payment_url: string;
  transaction_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() {}

  /**
   * Simule l'appel POST vers /api/reservations/pay
   */
  processGenericPayment(request: PaymentRequest): Observable<PaymentResponse> {
    // Dans une vraie application, cela ferait un http.post('/api/reservations/pay', request)
    console.log('Initiating payment via backend...', request);
    
    // Génération d'un ID de transaction fictif
    const txId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Simulation de l'URL de paiement retournée par l'agrégateur/l'API
    let paymentUrl = '';
    if (request.methode === 'wave') {
      paymentUrl = `https://pay.wave.com/c/checkout/${txId}`;
    } else {
      paymentUrl = `https://api.orange.com/orange-money-webpay/dev/v1/webpayment/${txId}`;
    }

    return of({
      success: true,
      payment_url: paymentUrl,
      transaction_id: txId
    }).pipe(delay(1500)); // Simulation du temps de réponse réseau
  }

}
