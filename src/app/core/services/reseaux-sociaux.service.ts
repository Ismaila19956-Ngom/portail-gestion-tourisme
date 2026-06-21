import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ReseauSocialPortail {
  id: number;
  reseau: string; // FACEBOOK | INSTAGRAM | TWITTER | YOUTUBE | LINKEDIN | WHATSAPP | TIKTOK
  url: string;
  icon?: string;
  color?: string;
  actif: boolean;
  ordre: number;
}

/** Base URL normalisée (sans trailing slash) â€” même pattern que cnaas-api.service.ts */
const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
const PUBLIC = `${baseUrl}/public`;

@Injectable({
  providedIn: 'root'
})
export class ReseauxSociauxService {

  constructor(private http: HttpClient) {}

  getActifs(): Observable<ReseauSocialPortail[]> {
    return this.http
      .get<ReseauSocialPortail[]>(`${PUBLIC}/reseaux-sociaux`)
      .pipe(
        catchError((err) => {
          console.error('[ReseauxSociaux] Erreur API:', err);
          return of([]); // Fallback silencieux : affiche les icônes statiques
        })
      );
  }
}
