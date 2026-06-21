import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CnaasApiService } from '../../../../../services/cnaas-api.service';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule, RouterLink],
  templateUrl: './faqs.component.html',
  styles: ``
})
export class FaqsComponent implements OnInit {
    faqData: any[] = [];
    loading = true;

    constructor(private api: CnaasApiService) {}

    ngOnInit(): void {
        this.api.getAllFaqs().subscribe({
            next: (faqs: any[]) => {
                this.faqData = faqs || [];
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    getIcon(text: string): string {
        const n = (text || '').toLowerCase();
        if (n.includes('récolte') || n.includes('recolte') || n.includes('culture') || n.includes('horticol')) return 'fa-solid fa-wheat-awn';
        if (n.includes('bétail') || n.includes('betail') || n.includes('cheptel') || n.includes('vache') || n.includes('animal')) return 'fa-solid fa-cow';
        if (n.includes('avicul') || n.includes('volaille') || n.includes('poulet')) return 'fa-solid fa-egg';
        if (n.includes('matériel') || n.includes('materiel') || n.includes('équipement') || n.includes('equipement')) return 'fa-solid fa-tractor';
        if (n.includes('indiciel') || n.includes('pluie') || n.includes('climat')) return 'fa-solid fa-cloud-rain';
        if (n.includes('serre') || n.includes('maraich')) return 'fa-solid fa-seedling';
        if (n.includes('stock')) return 'fa-solid fa-warehouse';
        if (n.includes('arboricul') || n.includes('arbre')) return 'fa-solid fa-tree';
        return 'fa-solid fa-leaf';
    }

    getColor(index: number): string {
        const colors = ['#28a745', '#198754', '#20c997', '#0f5132', '#556B2F'];
        return colors[index % colors.length];
    }
}
