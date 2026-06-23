import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, of, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    Avenant, ClientSummary360, DocumentModule, Page, Paiement, PevMarquage, Police, Sinistre,
    QuestionnaireAviculture, QuestionnaireRecolte, QuestionnaireHorticulture,
    VisiteTechniqueAviculture, VisiteTechniqueHorticulture
} from '../models/client-portal.models';

@Injectable({ providedIn: 'root' })
export class ClientPortalService {

    constructor(private http: HttpClient) {}

    getSummary360(clientId: number): Observable<ClientSummary360> {
        return this.http.get<ClientSummary360>(`${environment.apiUrl}/clients/client/${clientId}/summary360`);
    }

    getPolices(clientId: number, page = 0, size = 10): Observable<Page<Police>> {
        const params = new HttpParams()
            .set('clientId', clientId)
            .set('page', page)
            .set('size', size);
        return this.http.get<Page<Police>>(`${environment.apiUrl}/polices`, { params }).pipe(
            timeout(25_000),             // 25 s max — apr�s on l�ve TimeoutError
            catchError(err => throwError(() => err))
        );
    }

    getPolice(id: number): Observable<Police> {
        return this.http.get<Police>(`${environment.apiUrl}/polices/${id}`);
    }

    getPortalSinistres(clientId: number, page = 0, size = 10): Observable<any> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);
        return this.http.get<any>(`${environment.apiUrl}/sinistres/portal/client/${clientId}`, { params });
    }

    getPaiements(clientId: number, page = 0, size = 10): Observable<Page<Paiement>> {
        const params = new HttpParams()
            .set('clientId', clientId)
            .set('page', page)
            .set('size', size);
        return this.http.get<Page<Paiement>>(`${environment.apiUrl}/paiements`, { params });
    }

    getPaiementsByPolice(policeId: number): Observable<Page<Paiement>> {
        const params = new HttpParams().set('policeId', policeId).set('page', 0).set('size', 50);
        return this.http.get<Page<Paiement>>(`${environment.apiUrl}/paiements`, { params });
    }

    getDocumentModules(product: string, category?: string, typeDocumentCode?: string): Observable<DocumentModule[]> {
        let params = new HttpParams()
            .set('product', product)
            .set('page', 0)
            .set('size', 50);
        if (category)           params = params.set('category', category);
        if (typeDocumentCode)   params = params.set('typeDocumentCode', typeDocumentCode);
        return this.http.get<Page<DocumentModule>>(`${environment.apiUrl}/document-modules`, { params }).pipe(
            map(page => page?.content ?? []),
            catchError(() => of([]))
        );
    }

    /** T�l�charge n'importe quel document (PDF/Word) comme Blob — le token JWT est ajout� par l'intercepteur */
    getBlob(url: string): Observable<Blob> {
        return this.http.get(url, { responseType: 'blob' });
    }

    getAvenants(policeId: number): Observable<Avenant[]> {
        const params = new HttpParams().set('policeId', policeId).set('page', 0).set('size', 50);
        return this.http.get<Page<Avenant>>(`${environment.apiUrl}/avenants`, { params }).pipe(
            map(page => page?.content ?? []),
            catchError(() => of([]))
        );
    }

    getPevMarquage(policeId: number): Observable<PevMarquage[]> {
        return this.http.get<PevMarquage[]>(`${environment.apiUrl}/pev-marquage/by-police/${policeId}`)
            .pipe(catchError(() => of([])));
    }

    /* ─────────────────────────────────────────────────────────────────
       QUESTIONNAIRES  (un par type de produit)
    ───────────────────────────────────────────────────────────────── */

    /**
     * Bétail : GET /api/betail/{policeId}/questionnaires  → Page<QuestionnaireBetail>
     * On prend le premier �l�ment de la page.
     */
    getQuestionnaireBetail(policeId: number): Observable<any | null> {
        return this.http.get<Page<any>>(
            `${environment.apiUrl}/betail/${policeId}/questionnaires`
        ).pipe(
            map(page => page?.content?.[0] ?? null),
            catchError(() => of(null))
        );
    }

    /**
     * Aviculture : GET /api/polices/aviculture/{policeId}/questionnaires  → Page<QuestionnaireAviculture>
     * On prend le premier �l�ment.
     */
    getQuestionnaireAviculture(policeId: number): Observable<QuestionnaireAviculture | null> {
        return this.http.get<Page<QuestionnaireAviculture>>(
            `${environment.apiUrl}/polices/aviculture/${policeId}/questionnaires`
        ).pipe(
            map(page => page?.content?.[0] ?? null),
            catchError(() => of(null))
        );
    }

    /**
     * R�colte : GET /api/recolte/{policeId}/questionnaire  → QuestionnaireRecolte (optional)
     */
    getQuestionnaireRecolte(policeId: number): Observable<QuestionnaireRecolte | null> {
        return this.http.get<QuestionnaireRecolte>(
            `${environment.apiUrl}/recolte/${policeId}/questionnaire`
        ).pipe(catchError(() => of(null)));
    }

    /**
     * Horticulture : GET /api/polices/horticulture/{policeId}/questionnaire  → QuestionnaireHorticulture (optional)
     */
    getQuestionnaireHorticulture(policeId: number): Observable<QuestionnaireHorticulture | null> {
        return this.http.get<QuestionnaireHorticulture>(
            `${environment.apiUrl}/polices/horticulture/${policeId}/questionnaire`
        ).pipe(catchError(() => of(null)));
    }

    /**
     * équipement : GET /api/polices/equipement/{policeId}/questionnaire  → QuestionnaireEquipement (optional)
     */
    getQuestionnaireEquipement(policeId: number): Observable<any | null> {
        return this.http.get<any>(
            `${environment.apiUrl}/polices/equipement/${policeId}/questionnaire`
        ).pipe(catchError(() => of(null)));
    }

    /**
     * Multirisques : GET /api/polices/multirisques/{policeId}/questionnaires  → Page<QuestionnaireMultirisques>
     * On prend le premier �l�ment.
     */
    getQuestionnaireMultirisques(policeId: number): Observable<any | null> {
        return this.http.get<Page<any>>(
            `${environment.apiUrl}/polices/multirisques/${policeId}/questionnaires`
        ).pipe(
            map(page => page?.content?.[0] ?? null),
            catchError(() => of(null))
        );
    }

    /**
     * Stock : GET /api/polices/stock/{policeId}/questionnaire  → QuestionnaireStock (optional)
     */
    getQuestionnaireStock(policeId: number): Observable<any | null> {
        return this.http.get<any>(
            `${environment.apiUrl}/polices/stock/${policeId}/questionnaire`
        ).pipe(catchError(() => of(null)));
    }

    /* ─────────────────────────────────────────────────────────────────
       VISITES TECHNIQUES  (aviculture et horticulture uniquement)
    ───────────────────────────────────────────────────────────────── */

    /**
     * Aviculture : GET /api/polices/aviculture/{policeId}/visites  → Page<VisiteTechniqueAviculture>
     */
    getVisitesAviculture(policeId: number): Observable<VisiteTechniqueAviculture[]> {
        return this.http.get<Page<VisiteTechniqueAviculture>>(
            `${environment.apiUrl}/polices/aviculture/${policeId}/visites`
        ).pipe(
            map(page => page?.content ?? []),
            catchError(() => of([]))
        );
    }

    /**
     * Horticulture : GET /api/polices/horticulture/{policeId}/visites  → List<VisiteTechniqueHorticulture>
     */
    getVisitesHorticulture(policeId: number): Observable<VisiteTechniqueHorticulture[]> {
        return this.http.get<VisiteTechniqueHorticulture[]>(
            `${environment.apiUrl}/polices/horticulture/${policeId}/visites`
        ).pipe(catchError(() => of([])));
    }
}
