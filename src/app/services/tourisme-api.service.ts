import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
    Produit, Garantie, Prime, Franchise, Extension,
    Taxe, Frais, PageResponse, ProduitDetail, CategorieProduit, Partenaire
} from '../models/tourisme.models';
import { environment } from '../../environments/environment';

/** Base URL du portail public — aucune authentification requise */
const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
const PUBLIC = `${baseUrl}/public`;

@Injectable({ providedIn: 'root' })
export class TourismeApiService {

    constructor(private http: HttpClient) {}

    /* ─── Produits ─── */
    getProduits(keyword?: string): Observable<Produit[]> {
        let url = `${PUBLIC}/produits?size=100&page=0`;
        if (keyword) {
            url += `&keyword=${encodeURIComponent(keyword)}`;
        }
        return this.http
            .get<PageResponse<Produit>>(url)
            .pipe(
                map(p => p.content),
                catchError((err) => {
                    console.error('Erreur getProduits:', err);
                    return of([]);
                })
            );
    }

    /* ─── Sliders ─── */
    getSliders(): Observable<any[]> {
        return this.http
            .get<any[]>(`${PUBLIC}/slider`)
            .pipe(catchError(() => of([])));
    }

    getProduit(id: number): Observable<Produit> {
        return this.http.get<Produit>(`${PUBLIC}/produits/${id}`);
    }

    /* ─── FAQs ─── */
    getFaqsByProduit(produitId: number): Observable<any[]> {
        return this.http
            .get<any[]>(`${PUBLIC}/faqs/contenu/PRODUIT/${produitId}`)
            .pipe(catchError((err) => {
                console.error('Erreur getFaqsByProduit:', err);
                return of([]);
            }));
    }

    getAllFaqs(): Observable<any[]> {
        return this.http
            .get<any[]>(`${PUBLIC}/faqs/contenu/GLOBAL/0`)
            .pipe(catchError((err) => {
                console.error('Erreur getAllFaqs:', err);
                return of([]);
            }));
    }

    /* ─── Catégories ─── */
    getCategories(): Observable<CategorieProduit[]> {
        return this.http
            .get<CategorieProduit[]>(`${PUBLIC}/categories`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Partenaires ─── */
    getPartenaires(): Observable<Partenaire[]> {
        return this.http
            .get<Partenaire[]>(`${PUBLIC}/partenaires`)
            .pipe(
                map((res: any) => res.content || res),
                catchError(() => of([]))
            );
    }

    /* ─── Garanties ─── */
    getGaranties(produitId: number): Observable<Garantie[]> {
        return this.http
            .get<Garantie[]>(`${PUBLIC}/produits/${produitId}/garanties`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Primes ─── */
    getPrimes(produitId: number): Observable<Prime[]> {
        return this.http
            .get<Prime[]>(`${PUBLIC}/produits/${produitId}/primes`)
            .pipe(catchError(() => of([])));
    }

    getConfigTarifsSpeculation(produitId: number): Observable<any[]> {
        return this.http
            .get<any[]>(`${PUBLIC}/produits/${produitId}/config-tarifs-speculation`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Franchises ─── */
    getFranchises(produitId: number): Observable<Franchise[]> {
        return this.http
            .get<Franchise[]>(`${PUBLIC}/produits/${produitId}/franchises`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Config Indemnisation (PIH — Indicielle Hybride) ─── */
    getConfigIndemnisation(produitId: number): Observable<any[]> {
        return this.http
            .get<any[]>(`${baseUrl}/parametrage/configurations-indemnisation`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Indices Pluviom�triques ─── */
    getIndicesPluviometriques(): Observable<any[]> {
        return this.http
            .get<any[]>(`${PUBLIC}/indices-pluviometriques`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Extensions ─── */
    getExtensions(produitId: number): Observable<Extension[]> {
        return this.http
            .get<PageResponse<Extension>>(`${PUBLIC}/produits/${produitId}/extensions`)
            .pipe(
                map(p => p.content),
                catchError(() => of([]))
            );
    }

    /** R�cup�re les sp�culations/zones configur�es pour une extension donn�e */
    getExtensionSpeculations(extensionId: number): Observable<any[]> {
        return this.http
            .get<any[]>(`${baseUrl}/extension-speculations/extension/${extensionId}`)
            .pipe(catchError(() => of([])));
    }

    /** R�cup�re les sp�culations/zones configur�es pour une garantie donn�e */
    getGarantieSpeculations(garantieId: number): Observable<any[]> {
        return this.http
            .get<any[]>(`${environment.apiUrl}/garantie-speculations/garantie/${garantieId}`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Taxes ─── */
    getTaxes(produitId: number): Observable<Taxe[]> {
        return this.http
            .get<Taxe[]>(`${PUBLIC}/produits/${produitId}/taxes`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Frais ─── */
    getFrais(produitId: number): Observable<Frais[]> {
        return this.http
            .get<Frais[]>(`${PUBLIC}/produits/${produitId}/frais`)
            .pipe(catchError(() => of([])));
    }

    /* ─── D�tail complet (forkJoin) ─── */
    getProduitDetail(produitId: number): Observable<ProduitDetail> {
        return forkJoin({
            produit:    this.getProduit(produitId),
            garanties:  this.getGaranties(produitId),
            primes:     this.getPrimes(produitId),
            franchises: this.getFranchises(produitId),
            extensions: this.getExtensions(produitId),
            taxes:      this.getTaxes(produitId),
            frais:      this.getFrais(produitId),
        });
    }

    /* ─── R�f�rentiel public ─── */
    getReferentielValues(listeCode: string): Observable<any[]> {
        return this.http
            .get<any>(`${PUBLIC}/referentiel/${listeCode}/values?size=100`)
            .pipe(
                map(res => res.content || res),
                catchError(() => of([]))
            );
    }

    getReferentielChildren(parentId: number): Observable<any[]> {
        return this.http
            .get<any[]>(`${baseUrl}/referentiel/children/${parentId}`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Contact & Liens Rapides ─── */
    submitContact(contactData: any): Observable<any> {
        return this.http.post<any>(`${PUBLIC}/contacts`, contactData);
    }

    getInformationContact(): Observable<any> {
        return this.http
            .get<any>(`${PUBLIC}/information-contact`)
            .pipe(catchError(() => of(null)));
    }

    getLiensRapides(): Observable<any[]> {
        return this.http
            .get<any[]>(`${PUBLIC}/liens-rapides`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Agences Publiques ─── */
    getAgencesPubliques(): Observable<any[]> {
        return this.http
            .get<any>(`${PUBLIC}/agences?size=200`)
            .pipe(
                map(res => res.content || res),
                catchError(() => of([]))
            );
    }

    getAgencesParZone(): Observable<any[]> {
        return this.http
            .get<any[]>(`${PUBLIC}/agences/par-zone`)
            .pipe(catchError(() => of([])));
    }

    /* ─── Satisfaction ─── */
    getSatisfactionRates(): Observable<any[]> {
        return this.http
            .get<any[]>(`${baseUrl}/portail/satisfaction/region`)
            .pipe(catchError((err) => {
                console.error('Erreur getSatisfactionRates:', err);
                return of([]);
            }));
    }

    /* ─── Mod�le Partenariat ─── */
    getModelePartenariat(): Observable<any> {
        return this.http
            .get<any>(`${PUBLIC}/portail/modele-partenariat`)
            .pipe(catchError(() => of(null)));
    }
}
