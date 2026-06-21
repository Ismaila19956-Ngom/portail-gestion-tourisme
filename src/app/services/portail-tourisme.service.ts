import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Guide {
  nom: string;
  photoUrl: string;
  langues: string[]; // ex: ['Français', 'Anglais']
}

export interface Excursion {
  id?: number;
  titre: string;
  description: string;
  prix: number;
  dureeHeures: number;
  localisation: string;
  imageUrl: string;
  active: boolean;
  guides?: Guide[];
}

export interface Reservation {
  id?: number;
  nomClient: string;
  email: string;
  telephone: string;
  dateReservation: string;
  nombrePersonnes: number;
  statut?: string;
  excursionId: number;
  excursionTitre?: string;
}

const MOCK_EXCURSIONS: Excursion[] = [
  {
    id: 1,
    titre: 'Découverte de Dakar et Île de Gorée',
    description: 'Une plongée fascinante dans l\'histoire et la culture. Visitez le Monument de la Renaissance, le phare des Mamelles et explorez l\'Île de Gorée, site du patrimoine mondial de l\'UNESCO.',
    prix: 25000,
    dureeHeures: 8,
    localisation: 'Dakar',
    imageUrl: 'assets/images/tourisme/excursion_dakar_1781800534313.png',
    active: true,
    guides: [
      { nom: 'Mamadou', photoUrl: 'assets/images/tourisme/guide_mamadou.png', langues: ['Français', 'Anglais', 'Wolof'] },
      { nom: 'Awa', photoUrl: 'assets/images/tourisme/guide_awa.png', langues: ['Français', 'Espagnol'] }
    ]
  },
  {
    id: 2,
    titre: 'Aventure en Casamance',
    description: 'Explorez la beauté luxuriante du sud du Sénégal. Naviguez dans les bolongs, rencontrez les communautés locales et profitez des plages immaculées de Cap Skirring.',
    prix: 75000,
    dureeHeures: 48,
    localisation: 'Casamance',
    imageUrl: 'assets/images/tourisme/excursion_casamance_1781800557434.png',
    active: true,
    guides: [
      { nom: 'Ibrahima', photoUrl: 'assets/img/all-images/team-img3.png', langues: ['Français', 'Anglais', 'Diola'] }
    ]
  },
  {
    id: 3,
    titre: 'Safari dans le Sine-Saloum',
    description: 'Un voyage au cœur d\'une réserve naturelle exceptionnelle. Observez les oiseaux rares, naviguez en pirogue traditionnelle et découvrez les villages de pêcheurs.',
    prix: 45000,
    dureeHeures: 24,
    localisation: 'Sine-Saloum',
    imageUrl: 'assets/images/tourisme/excursion_saloum_1781800545237.png',
    active: true,
    guides: [
      { nom: 'Aminata', photoUrl: 'assets/img/all-images/team-img4.png', langues: ['Français', 'Allemand', 'Sérère'] },
      { nom: 'Cheikh', photoUrl: 'assets/img/all-images/team-img1.png', langues: ['Français', 'Anglais'] }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class PortailTourismeService {
  private apiUrl = `${environment.apiUrl}/api/tourisme`;

  constructor(private http: HttpClient) {}

  getExcursions(): Observable<Excursion[]> {
    return of(MOCK_EXCURSIONS);
  }

  getExcursionById(id: number): Observable<Excursion | null> {
    const excursion = MOCK_EXCURSIONS.find(e => e.id === id);
    return of(excursion || null);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    console.log('Réservation créée:', reservation);
    return of({ ...reservation, id: Math.floor(Math.random() * 1000) });
  }
}
