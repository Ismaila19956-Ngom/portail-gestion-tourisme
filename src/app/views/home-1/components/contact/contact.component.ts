import { serviceData } from '../data';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CnaasApiService } from '../../../../services/cnaas-api.service';
import { Produit } from '../../../../models/cnaas.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styles: ``
})
export class ContactComponent implements OnInit {
  devisForm!: FormGroup;
  produits: Produit[] = [];
  
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: CnaasApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProduits();
  }

  initForm(): void {
    this.devisForm = this.fb.group({
      nomComplet: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      produitId: [''],
      message: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });
  }

  loadProduits(): void {
    this.produits = serviceData.map(s => ({
  id: s.id,
  nom: s.title,
  description: s.description,
  image: s.image,
  categoryId: 1
})) as any;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.devisForm.invalid) {
      this.devisForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.devisForm.value;

    // R�cup�rer le nom du produit pour l'inclure dans le message
    let nomProduit = 'Non pr�cis�';
    if (formValue.produitId) {
      const selectedProd = this.produits.find(p => p.id.toString() === formValue.produitId.toString());
      if (selectedProd) {
        nomProduit = selectedProd.nom;
      }
    }

    // On pr�fixe le message avec le produit souhait�
    const messageComplet = `Produit souhait� : ${nomProduit}\n\n${formValue.message}`;

    // On utilise un objetDemandeId par d�faut, par exemple 1 (Demande de devis)
    // S'il n'existe pas, l'API le g�rera selon sa configuration.
    const demandeContactDto = {
      nom: formValue.nomComplet,
      prenom: '', // Laiss� vide ou g�r� c�t� backend
      email: formValue.email,
      telephone: formValue.telephone,
      objetDemandeId: 1, 
      message: messageComplet
    };

    this.apiService.submitContact(demandeContactDto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Votre demande de devis a �t� envoy�e avec succ�s. Notre �quipe vous contactera sous peu.';
        this.devisForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Une erreur est survenue lors de l\'envoi. Veuillez r�essayer plus tard.';
        console.error('Erreur submitContact', err);
      }
    });
  }
}
