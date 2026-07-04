import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, of, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    Avenant, ClientSummary360, DocumentModule, Page, Paiement, PevMarquage, Police, Modification,
    Questionnaireaventure, Questionnaireexcursion, QuestionnaireCulture,
    VisiteTechniqueaventure, VisiteTechniqueCulture
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

    getPortalModifications(clientId: number, page = 0, size = 10): Observable<any> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);
        return this.http.get<any>(`${environment.apiUrl}/modifications/portal/client/${clientId}`, { params });
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
     * circuit : GET /api/circuit/{policeId}/questionnaires  → Page<Questionnairecircuit>
     * On prend le premier �l�ment de la page.
     */
    getQuestionnairecircuit(policeId: number): Observable<any | null> {
        return this.http.get<Page<any>>(
            `${environment.apiUrl}/circuit/${policeId}/questionnaires`
        ).pipe(
            map(page => page?.content?.[0] ?? null),
            catchError(() => of(null))
        );
    }

    /**
     * aventure : GET /api/polices/aventure/{policeId}/questionnaires  → Page<Questionnaireaventure>
     * On prend le premier �l�ment.
     */
    getQuestionnaireaventure(policeId: number): Observable<Questionnaireaventure | null> {
        return this.http.get<Page<Questionnaireaventure>>(
            `${environment.apiUrl}/polices/aventure/${policeId}/questionnaires`
        ).pipe(
            map(page => page?.content?.[0] ?? null),
            catchError(() => of(null))
        );
    }

    /**
     * R�colte : GET /api/excursion/{policeId}/questionnaire  → Questionnaireexcursion (optional)
     */
    getQuestionnaireexcursion(policeId: number): Observable<Questionnaireexcursion | null> {
        return this.http.get<Questionnaireexcursion>(
            `${environment.apiUrl}/excursion/${policeId}/questionnaire`
        ).pipe(catchError(() => of(null)));
    }

    /**
     * Culture : GET /api/polices/Culture/{policeId}/questionnaire  → QuestionnaireCulture (optional)
     */
    getQuestionnaireCulture(policeId: number): Observable<QuestionnaireCulture | null> {
        return this.http.get<QuestionnaireCulture>(
            `${environment.apiUrl}/polices/Culture/${policeId}/questionnaire`
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
       VISITES TECHNIQUES  (aventure et Culture uniquement)
    ───────────────────────────────────────────────────────────────── */

    /**
     * aventure : GET /api/polices/aventure/{policeId}/visites  → Page<VisiteTechniqueaventure>
     */
    getVisitesaventure(policeId: number): Observable<VisiteTechniqueaventure[]> {
        return this.http.get<Page<VisiteTechniqueaventure>>(
            `${environment.apiUrl}/polices/aventure/${policeId}/visites`
        ).pipe(
            map(page => page?.content ?? []),
            catchError(() => of([]))
        );
    }

    /**
     * Culture : GET /api/polices/Culture/{policeId}/visites  → List<VisiteTechniqueCulture>
     */
    getVisitesCulture(policeId: number): Observable<VisiteTechniqueCulture[]> {
        return this.http.get<VisiteTechniqueCulture[]>(
            `${environment.apiUrl}/polices/Culture/${policeId}/visites`
        ).pipe(catchError(() => of([])));
    }
}
