import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-about',
  imports: [RouterLink, CommonModule],
  templateUrl: './about.component.html',
  styles: ``
})
export class AboutComponent implements OnInit {
  partenaires: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/contact-partenaires`).subscribe({
      next: (data) => {
        // Sort by 'ordre' and limit to 3 maximum
        this.partenaires = data.sort((a, b) => (a.ordre || 0) - (b.ordre || 0)).slice(0, 3);
      },
      error: (err) => console.error('Erreur chargement partenaires', err)
    });
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Si c'est un chemin relatif (ex: /api/mediatheques/fichier/...)
    const baseUrl = environment.apiUrl.replace('/api', '');
    return url.startsWith('/') ? baseUrl + url : baseUrl + '/' + url;
  }
}
