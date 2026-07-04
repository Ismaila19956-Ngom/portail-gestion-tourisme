import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatistiquesGlobalesDto {
  nbvoyageurs: number;
  nbProduits: number;
  nbRegions: number;
  tauxSatisfaction: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {

  constructor(private http: HttpClient) { }

  getStatistiquesGlobales(): Observable<StatistiquesGlobalesDto> {
    return this.http.get<StatistiquesGlobalesDto>(`${environment.apiUrl}/polices/statistiques/globales`);
  }
}
