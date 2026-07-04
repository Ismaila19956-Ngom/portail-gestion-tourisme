import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TourismeApiService } from '../../../services/tourisme-api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-souscription',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './souscription.component.html',
  styles: ``
})
export class SouscriptionComponent implements OnInit {
  contactForm!: FormGroup;
  objetsDemande: any[] = [];
  produits: any[] = [];
  souscriptionOption: any = null;
  selectedProduit: any = null;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private tourismeApi: TourismeApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initForm();
    this.loadObjetsDemande();
    this.loadProduits();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      nomComplet: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      produitNom: [''],
      message: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });

    // Mettre à jour le message et le produit s�lectionn� si le produit choisi change
    this.contactForm.get('produitNom')?.valueChanges.subscribe(name => {
      if (name) {
        const match = this.produits.find(p => p.nom === name);
        this.selectedProduit = match || { nom: name };
        this.contactForm.patchValue({
          message: `Bonjour,\n\nJe souhaite souscrire au produit : ${name}.\nMerci de me recontacter pour m'indiquer les modalit�s.\n\nCordialement.`
        }, { emitEvent: false });
      } else {
        this.selectedProduit = null;
      }
    });
  }

  loadProduits(): void {
    this.tourismeApi.getProduits().subscribe({
      next: (list) => {
        this.produits = list || [];
        
        // Lire le paramètre product dans l'URL
        this.route.queryParams.subscribe(params => {
          let productName = params['product'];
          if (productName) {
            try {
              productName = decodeURIComponent(escape(atob(productName)));
            } catch (e) {
              // fallback si non base64
            }
            
            // Chercher le produit pour s'assurer du nom exact
            const match = this.produits.find(p => p.nom.toLowerCase() === productName.toLowerCase());
            const finalName = match ? match.nom : productName;
            
            this.selectedProduit = match || { nom: productName };
            
            this.contactForm.patchValue({
              produitNom: finalName,
              message: `Bonjour,\n\nJe souhaite souscrire au produit : "${finalName}".\nMerci de me recontacter pour m'indiquer les modalit�s.\n\nCordialement.`
            });
          }
        });
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  loadObjetsDemande(): void {
    this.tourismeApi.getReferentielValues('OBJET_CONTACT').subscribe({
      next: (data) => {
        this.objetsDemande = data || [];
        this.souscriptionOption = this.objetsDemande.find(o => 
          o.libelle?.toLowerCase().includes('souscr') || 
          o.libelle?.toLowerCase().includes('devis') ||
          o.libelle?.toLowerCase().includes('demande')
        ) || this.objetsDemande[0];
      },
      error: (err) => console.error('Erreur chargement objets de demande', err)
    });
  }

  getProductImage(p: any): string {
    if (!p) return 'assets/images/tourisme/hero_dakar.png';
    if (p.imageUrl && p.imageUrl.trim() !== '') return p.imageUrl;
    
    const n = (p.nom || '').toLowerCase();
    if (n.includes('cultur') || n.includes('histor') || n.includes('gorée'))
        return 'assets/images/tourisme/service_culture.png';
    if (n.includes('safari') || n.includes('nature') || n.includes('faune'))
        return 'assets/images/tourisme/service_safari.png';
    if (n.includes('plage') || n.includes('saly') || n.includes('mer'))
        return 'assets/images/tourisme/service_plage.png';
    if (n.includes('gastronomie') || n.includes('culinaire'))
        return 'assets/images/tourisme/service_gastro.png';
    if (n.includes('aventure') || n.includes('randonnée') || n.includes('trek'))
        return 'assets/images/tourisme/service_aventure.png';
    if (n.includes('pirogue') || n.includes('fleuve') || n.includes('saloum'))
        return 'assets/images/tourisme/hero_saloum.png';
    return 'assets/images/tourisme/hero_dakar.png';
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
    
    // D�coupage du nom complet en prenom / nom
    const nameParts = (val.nomComplet || '').trim().split(/\s+/);
    const prenom = nameParts.length > 1 ? nameParts[0] : '';
    const nom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] || '';

    const objetId = this.souscriptionOption ? this.souscriptionOption.id : (this.objetsDemande[0]?.id || null);

    const payload: any = {
      prenom: prenom,
      nom: nom,
      telephone: val.telephone,
      email: val.email,
      objetDemandeId: objetId,
      message: val.message
    };

    // Si un produit est s�lectionn�, on envoie son ID pour que la demande
    // apparaisse dans l'onglet "Demandes de souscription" c�t� admin
    if (this.selectedProduit && this.selectedProduit.id) {
      payload.produitId = this.selectedProduit.id;
    }

    this.tourismeApi.submitContact(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Votre demande de devis a bien �t� envoy�e. Notre �quipe d\'experts vous recontactera bient�t.';
        this.contactForm.reset();
        this.selectedProduit = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez r�essayer plus tard.';
        console.error('Erreur envoi contact', err);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
