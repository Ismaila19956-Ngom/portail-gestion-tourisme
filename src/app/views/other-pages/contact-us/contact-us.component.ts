import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CnaasApiService } from '../../../services/cnaas-api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReseauxSociauxService, ReseauSocialPortail } from '@core/services/reseaux-sociaux.service';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './contact-us.component.html',
  styles: ``
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  contactForm!: FormGroup;
  objetsDemande: any[] = [];
  souscriptionOption: any = null;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  reseauxSociaux: ReseauSocialPortail[] = [];

  siege: any = {
    nomAgence: 'Siège Social',
    adresse: 'Immeuble Sénégal Excursions, Dakar, Sénégal',
    email: 'contact@senegal-excursions.sn',
    telephone: '(+221) 33 869 78 00',
    horaires: 'Lun – Ven : 8h – 17h\nSamedi : 9h – 13h\nDimanche : Fermé',
    latitude: 14.7167, 
    longitude: -17.4677
  };

  center: { lat: number; lng: number } = { lat: 14.7167, lng: -17.4677 };
  zoom = 15;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  markerOptions: { draggable: boolean } = { draggable: false };

  constructor(
    private fb: FormBuilder,
    private cnaasApi: CnaasApiService,
    private route: ActivatedRoute,
    private reseauxSvc: ReseauxSociauxService
  ) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initForm();
    this.loadObjetsDemande();

    /* Charger les réseaux sociaux depuis l'API publique */
    this.reseauxSvc.getActifs().subscribe(rs => {
        this.reseauxSociaux = rs;
    });

    /* Charger les infos de contact globales */
    this.cnaasApi.getInformationContact().subscribe(data => {
      if (data) {
        this.siege.adresse = data.adresse || this.siege.adresse;
        this.siege.telephone = data.telephone || this.siege.telephone;
        this.siege.email = data.email || this.siege.email;
        if (data.horaires) {
           this.siege.horaires = data.horaires;
        }
      }
    });

    /* Charger le siège pour les coordonnées GPS */
    this.cnaasApi.getAgencesPubliques().subscribe({
      next: (agences) => {
        if (agences && agences.length > 0) {
          const siegeAgence = agences.find((a: any) => 
            a.code?.toUpperCase() === 'SIEGE' || 
            a.nomAgence?.toLowerCase().includes('siège') ||
            a.nomAgence?.toLowerCase().includes('siege') ||
            a.typeUnite?.libelle?.toLowerCase().includes('siège') ||
            a.typeUnite?.libelle?.toLowerCase().includes('siege')
          );
          if (siegeAgence) {
            this.siege.latitude = siegeAgence.latitude || this.siege.latitude;
            this.siege.longitude = siegeAgence.longitude || this.siege.longitude;
            this.siege.nomAgence = siegeAgence.nomAgence || this.siege.nomAgence;
          }
        }
        this.center = { lat: Number(this.siege.latitude), lng: Number(this.siege.longitude) };
      },
      error: () => {
        this.center = { lat: Number(this.siege.latitude), lng: Number(this.siege.longitude) };
      }
    });
  }

  ngAfterViewInit(): void {
  }

  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      objetDemandeId: [null],
      message: ['', Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  loadObjetsDemande(): void {
    this.cnaasApi.getReferentielValues('OBJET_CONTACT').subscribe({
      next: (data) => {
        this.objetsDemande = data || [];
        this.souscriptionOption = this.objetsDemande.find(o => 
          o.libelle?.toLowerCase().includes('souscr') || 
          o.libelle?.toLowerCase().includes('devis') ||
          o.libelle?.toLowerCase().includes('demande')
        ) || this.objetsDemande[0];
        
        if (this.souscriptionOption) {
          this.contactForm.patchValue({ objetDemandeId: this.souscriptionOption.id });
        }
      },
      error: (err) => console.error('Erreur chargement objets de demande', err)
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const val = this.contactForm.value;

    const payload: any = {
      prenom: val.prenom,
      nom: val.nom,
      telephone: val.telephone,
      email: val.email,
      objetDemandeId: val.objetDemandeId,
      message: val.message
    };

    this.cnaasApi.submitContact(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Votre message a bien été envoyé. Notre équipe vous recontactera bientôt.';
        this.contactForm.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer plus tard.';
        console.error('Erreur envoi contact', err);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /** Retourne l'icône Font Awesome correspondant au réseau */
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
