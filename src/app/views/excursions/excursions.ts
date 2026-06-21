import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortailTourismeService, Excursion } from '../../services/portail-tourisme.service';

@Component({
  selector: 'app-excursions',
  templateUrl: './excursions.html',
  styleUrls: ['./excursions.scss'],
  imports: [CommonModule, RouterLink, FormsModule]
})
export class ExcursionsComponent implements OnInit {
  excursions: Excursion[] = [];
  filteredExcursions: Excursion[] = [];
  loading = true;

  // Filtres
  searchQuery = '';
  selectedRegion = '';
  selectedDuration = '';
  maxPrice: number | null = null;
  displayLimit = 2; // Affiche 2 par défaut

  regions: string[] = [];

  constructor(private tourService: PortailTourismeService) {}

  ngOnInit(): void {
    this.tourService.getExcursions().subscribe({
      next: (data) => {
        this.excursions = data.filter(e => e.active);
        this.filteredExcursions = [...this.excursions];
        this.extractRegions();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  extractRegions(): void {
    const regionSet = new Set<string>();
    this.excursions.forEach(e => {
      if (e.localisation) {
        regionSet.add(e.localisation.trim());
      }
    });
    this.regions = Array.from(regionSet);
  }

  applyFilters(): void {
    this.filteredExcursions = this.excursions.filter(e => {
      const matchesSearch = !this.searchQuery.trim() || 
        e.titre.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        e.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesRegion = !this.selectedRegion || 
        e.localisation === this.selectedRegion;
      
      let matchesDuration = true;
      if (this.selectedDuration === 'short') {
        matchesDuration = e.dureeHeures <= 4;
      } else if (this.selectedDuration === 'medium') {
        matchesDuration = e.dureeHeures > 4 && e.dureeHeures <= 8;
      } else if (this.selectedDuration === 'long') {
        matchesDuration = e.dureeHeures > 8;
      }

      const matchesPrice = this.maxPrice === null || e.prix <= this.maxPrice;

      return matchesSearch && matchesRegion && matchesDuration && matchesPrice;
    });
  }

  get displayedExcursions(): Excursion[] {
    return this.filteredExcursions.slice(0, this.displayLimit);
  }

  showMore(): void {
    this.displayLimit += 2;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedRegion = '';
    this.selectedDuration = '';
    this.maxPrice = null;
    this.displayLimit = 2;
    this.filteredExcursions = [...this.excursions];
  }
}
