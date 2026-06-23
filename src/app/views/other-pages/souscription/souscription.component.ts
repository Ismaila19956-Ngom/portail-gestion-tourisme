import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from "../../../components/breadcrumb/breadcrumb.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CnaasApiService } from '../../../services/cnaas-api.service';
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
    private cnaasApi: CnaasApiService,
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
    this.cnaasApi.getProduits().subscribe({
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
    this.cnaasApi.getReferentielValues('OBJET_CONTACT').subscribe({
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
    if (!p) return 'assets/images/produits/hf_20260311_170823_a27f86bf-847a-4fd5-af9a-9404d583c16e.jpeg';
    if (p.imageUrl && p.imageUrl.trim() !== '') return p.imageUrl;
    
    const n = (p.nom || '').toLowerCase();
    const b = (p.branche?.libelle || '').toLowerCase();
    if (n.includes('r�colte') || n.includes('recolte') || b.includes('r�colte'))
        return 'assets/images/produits/hf_20260311_162333_0b136c9f-1c67-4e61-978e-ab229d738d9d.jpeg';
    if (n.includes('bétail') || n.includes('betail') || n.includes('cheptel') || b.includes('betail'))
        return 'assets/images/produits/hf_20260311_162333_2c5dfd81-2a14-40ad-99fb-17207f71c1bb.jpeg';
    if (n.includes('avicul') || n.includes('volaille'))
        return 'assets/images/produits/hf_20260311_162333_01988b04-73a0-41b3-bffc-7087d47324a6.jpeg';
    if (n.includes('mat�riel') || n.includes('materiel') || n.includes('équipement'))
        return 'assets/images/produits/hf_20260311_162925_871036b1-9cf1-4fdb-8480-7b3ce42bf7a7.jpeg';
    if (n.includes('indiciel') || n.includes('pluie') || n.includes('indice'))
        return 'assets/images/produits/hf_20260311_164048_86f66af8-95f1-4418-b76a-4b4735fea65e.jpeg';
    if (n.includes('horticol') || n.includes('serre') || n.includes('maraich'))
        return 'assets/images/produits/hf_20260311_164705_3142c799-0510-4f38-84df-c4c15d2279d9.jpeg';
    return 'assets/images/produits/hf_20260311_171453_4c033777-5979-4867-81ed-1fbbb5c1b9bc.jpeg';
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

    this.cnaasApi.submitContact(payload).subscribe({
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
