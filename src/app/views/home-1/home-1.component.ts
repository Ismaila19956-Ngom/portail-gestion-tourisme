import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AboutComponent } from "./components/about/about.component";
import { ContactComponent } from "./components/contact/contact.component";
import { FaqsComponent } from "./components/faqs/faqs.component";
import { HeroComponent } from "./components/hero/hero.component";
import { PricingPlansComponent } from "./components/pricing-plans/pricing-plans.component";
import { ServicesComponent } from "./components/services/services.component";
import { TestimonialComponent } from "./components/testimonial/testimonial.component";
import { WorkComponent } from "./components/work/work.component";
import { StatistiquesService, StatistiquesGlobalesDto } from '../../core/services/statistiques.service';
import { CnaasApiService } from '../../services/cnaas-api.service';
import { Partenaire } from '../../models/cnaas.models';

@Component({
    selector: 'app-home-1',
    imports: [
        RouterLink,
        HeroComponent,
        AboutComponent,
        ServicesComponent,
        WorkComponent,
        TestimonialComponent,
        FaqsComponent,
        ContactComponent,
        PricingPlansComponent,
        CommonModule
    ],
    templateUrl: './home-1.component.html',
    styles: ``
})
export class Home1Component implements OnInit {
  stats: StatistiquesGlobalesDto = {
    nbAgriculteurs: 15000,
    nbProduits: 10,
    nbRegions: 14,
    tauxSatisfaction: 98
  };

  partenaires: Partenaire[] = [];

  constructor(
    private statistiquesService: StatistiquesService,
    private apiService: CnaasApiService
  ) {}

  ngOnInit(): void {
    this.statistiquesService.getStatistiquesGlobales().subscribe({
      next: (data) => {
        if (data) {
          this.stats = data;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques', err);
      }
    });

    this.apiService.getPartenaires().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Pour le marquee infini, on duplique si nécessaire
          this.partenaires = [...data, ...data, ...data, ...data];
        }
      },
      error: (err) => console.error('Erreur lors du chargement des partenaires', err)
    });
  }
}
