import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { CnaasApiService } from '../../../services/cnaas-api.service';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

declare var google: any;

@Component({
  selector: 'app-agences',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, GoogleMapsModule],
  templateUrl: './agences.component.html',
  styleUrls: ['./agences.component.scss']
})
export class AgencesComponent implements OnInit, AfterViewInit {

  /* ─── Donn�es dynamiques ─── */
  zonesAvecAgences: { zone: string; agences: any[] }[] = [];
  selectedZone: { zone: string; agences: any[] } | null = null;
  selectedAgency: any = null;
  loading = true;
  error = false;

  center: google.maps.LatLngLiteral = { lat: 14.6928, lng: -17.4467 };
  zoom = 12;

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  @ViewChildren(MapMarker) mapMarkers!: QueryList<MapMarker>;
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  /* ─── Fallback statique (si API indisponible) ─── */
  private fallbackZones = [
    {
      zone: 'Zone Ouest Siège',
      agences: [
        {
          nomAgence: 'Siège',
          adresse: 'Sur la VDN Libert� EXT Villa N�6 � Dakar',
          email: 'contact@senegal-excursions.sn',
          telephone: '+221 33 869 78 00',
          latitude: 14.7167, longitude: -17.4677
        }
      ]
    }
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private api: CnaasApiService
  ) {
  }

  ngOnInit(): void {
    this.loadAgences();
  }

  ngAfterViewInit(): void {
  }

  loadAgences(): void {
    this.loading = true;
    this.error = false;

    this.api.getAgencesParZone().subscribe({
      next: (zones) => {
        this.loading = false;
        
        setTimeout(() => {
          if (zones && zones.length > 0) {
            this.zonesAvecAgences = zones as { zone: string; agences: any[] }[];
          } else {
            // Si l'API retourne vide, utiliser fallback
            this.zonesAvecAgences = this.fallbackZones;
          }
          // S�lectionner la premi�re zone par d�faut
          if (this.zonesAvecAgences.length > 0) {
            this.selectZone(this.zonesAvecAgences[0]);
          }
        }, 100); // Allow DOM to render *ngIf="!loading"
      },
      error: () => {
        this.loading = false;
        this.error = true;
        
        setTimeout(() => {
          this.zonesAvecAgences = this.fallbackZones;
          this.selectZone(this.zonesAvecAgences[0]);
        }, 100);
      }
    });
  }

  selectZone(zone: { zone: string; agences: any[] }): void {
    this.selectedZone = zone;
    this.selectedAgency = null;
    this.updateMapBounds();
  }

  selectAgency(agency: any, markerElem?: MapMarker): void {
    this.selectedAgency = agency;
    if (this.hasValidCoords(agency)) {
      this.center = { lat: Number(agency.latitude), lng: Number(agency.longitude) };
      this.zoom = 15;
      
      if (this.infoWindow) {
        if (markerElem) {
          this.infoWindow.open(markerElem);
        } else if (this.mapMarkers) {
          const foundMarker = this.mapMarkers.find(m => {
            const pos = m.getPosition();
            return pos?.lat() === Number(agency.latitude) && pos?.lng() === Number(agency.longitude);
          });
          if (foundMarker) {
            this.infoWindow.open(foundMarker);
          }
        }
      }
    }
  }

  openInfoWindow(marker: MapMarker, agency: any) {
    this.selectedAgency = agency;
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

  private updateMapBounds(): void {
    if (!this.selectedZone || !this.selectedZone.agences || this.selectedZone.agences.length === 0) {
      this.center = { lat: 14.6928, lng: -17.4467 };
      this.zoom = 12;
      return;
    }

    const agences = this.selectedZone.agences.filter(a => this.hasValidCoords(a));
    if (agences.length === 0) {
      this.center = { lat: 14.6928, lng: -17.4467 };
      this.zoom = 12;
      return;
    }

    if (agences.length === 1) {
      this.center = { lat: Number(agences[0].latitude), lng: Number(agences[0].longitude) };
      this.zoom = 14;
      return;
    }

    // Google Maps fit bounds
    if (typeof google !== 'undefined' && google.maps) {
      const bounds = new google.maps.LatLngBounds();
      agences.forEach(a => {
        bounds.extend({
          lat: Number(a.latitude),
          lng: Number(a.longitude)
        });
      });

      // Si la carte est d�jà rendue
      if (this.googleMap && this.googleMap.googleMap) {
        this.googleMap.fitBounds(bounds, 40);
      } else {
        // Sinon, on attend un peu qu'elle s'initialise
        setTimeout(() => {
          if (this.googleMap && this.googleMap.googleMap) {
            this.googleMap.fitBounds(bounds, 40);
          } else {
            // Fallback (on calcule manuellement le centre si fitBounds �choue)
            let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
            agences.forEach(a => {
              const lat = Number(a.latitude);
              const lng = Number(a.longitude);
              if (lat < minLat) minLat = lat;
              if (lat > maxLat) maxLat = lat;
              if (lng < minLng) minLng = lng;
              if (lng > maxLng) maxLng = lng;
            });
            this.center = {
              lat: (minLat + maxLat) / 2,
              lng: (minLng + maxLng) / 2
            };
            this.zoom = 7; 
          }
        }, 300);
      }
    }
  }

  hasValidCoords(agency: any): boolean {
    return agency.latitude && agency.longitude && !isNaN(Number(agency.latitude)) && !isNaN(Number(agency.longitude));
  }

  /** Retourne le libell� de la zone de rattachement d'une agence */
  getZoneLabel(agence: any): string {
    return agence.zoneRattachement?.libelle || agence.zone || '';
  }

  /** Retourne le libell� du type unit� d'une agence */
  getTypeLabel(agence: any): string {
    return agence.typeUnite?.libelle || agence.type || '';
  }

  /** Retourne le libell� de la commune d'une agence */
  getCommuneLabel(agence: any): string {
    return agence.commune?.libelle || '';
  }

  /** Formate le téléphone pour l'affichage */
  getTelephones(agence: any): string[] {
    if (!agence.telephone) return [];
    return agence.telephone.split(/[,;\/]/).map((t: string) => t.trim()).filter((t: string) => t);
  }

  /** Formate l'email pour l'affichage */
  getEmails(agence: any): string[] {
    if (!agence.email) return [];
    return agence.email.split(/[,;]/).map((e: string) => e.trim()).filter((e: string) => e);
  }
}
