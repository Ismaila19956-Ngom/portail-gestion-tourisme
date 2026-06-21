import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ReseauxSociauxService, ReseauSocialPortail } from '@core/services/reseaux-sociaux.service';
import { workData } from '../../home-1/components/data';

@Component({
  selector: 'app-etape-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './etape-detail.component.html',
  styles: []
})
export class EtapeDetailComponent implements OnInit {
  etape: any;
  autresEtapes: any[] = [];
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
        this.fetchEtapeDetail(id);
      }
    });
  }

  fetchEtapeDetail(id: string) {
    this.loading = true;
    this.error = false;
    
    // Utiliser les données statiques (tourisme) au lieu de l'API (CNAAS)
    this.mapEtapeData(workData, id);
  }

  private mapEtapeData(data: any[], id: string) {
    if (data && data.length > 0) {
      const found = data.find(e => e.id.toString() === id);
      if (found) {
        this.etape = {
          id: found.id,
          title: found.title || '',
          image: found.image || 'assets/images/produits/default.jpeg',
          description: found.description
        };
        
        // Les autres étapes
        this.autresEtapes = data
          .filter(e => e.id.toString() !== id)
          .slice(0, 2)
          .map(e => ({
            id: e.id,
            title: e.title || '',
            image: e.image || 'assets/images/produits/default.jpeg',
            description: e.description
          }));
          
      } else {
        this.error = true;
      }
    } else {
      this.error = true;
    }
    this.loading = false;
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
