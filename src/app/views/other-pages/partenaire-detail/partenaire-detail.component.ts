import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ReseauxSociauxService, ReseauSocialPortail } from '@core/services/reseaux-sociaux.service';

@Component({
  selector: 'app-partenaire-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './partenaire-detail.component.html',
  styles: []
})
export class PartenaireDetailComponent implements OnInit {
  partenaire: any;
  autresPartenaires: any[] = [];
  loading = true;
  error = false;
  reseauxSociaux: ReseauSocialPortail[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private reseauxSvc: ReseauxSociauxService
  ) {}

  ngOnInit(): void {
    this.reseauxSvc.getActifs().subscribe(rs => {
        this.reseauxSociaux = rs;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchPartenaireDetail(id);
      }
    });
  }

  fetchPartenaireDetail(id: string) {
    this.loading = true;
    this.error = false;
    const baseUrl = environment.apiUrl ? environment.apiUrl.replace(/\/+$/, '') : 'http://localhost:8080/api';
    
    this.http.get<any[]>(`${baseUrl}/contact-partenaires`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const found = data.find(p => p.id.toString() === id);
          if (found) {
            this.partenaire = {
              id: found.id,
              title: found.titre || '',
              image: this.getImageUrl(found.imageUrl, baseUrl),
              description: found.contenu || found.description
            };
            
            // Les autres partenaires
            this.autresPartenaires = data
              .filter(p => p.id.toString() !== id)
              .slice(0, 2)
              .map(p => ({
                id: p.id,
                title: p.titre || '',
                image: this.getImageUrl(p.imageUrl, baseUrl),
                description: p.description
              }));
              
          } else {
            this.error = true;
          }
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement detail partenaire:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getImageUrl(url: string, baseUrl: string): string {
    if (!url) return 'assets/images/produits/default.jpeg';
    if (url.startsWith('http')) return url;
    const base = baseUrl.replace('/api', '');
    return url.startsWith('/') ? base + url : base + '/' + url;
  }

  getSocialIcon(rs: ReseauSocialPortail): string {
      if (rs.icon) {
          return rs.icon;
      }
      const map: Record<string, string> = {
          FACEBOOK:  'fa-brands fa-facebook-f',
          INSTAGRAM: 'fa-brands fa-instagram',
          TWITTER:   'fa-brands fa-x-twitter',
          YOUTUBE:   'fa-brands fa-youtube',
          LINKEDIN:  'fa-brands fa-linkedin-in',
          WHATSAPP:  'fa-brands fa-whatsapp',
          TIKTOK:    'fa-brands fa-tiktok',
      };
      return map[rs.reseau?.toUpperCase()] ?? 'fa-solid fa-share-nodes';
  }
}
