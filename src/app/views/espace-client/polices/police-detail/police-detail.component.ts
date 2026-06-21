import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientPortalService } from '../../../../services/client-portal.service';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
import {
    Avenant, DocumentModule, Police, PevMarquage, Paiement,
    QuestionnaireAviculture, QuestionnaireRecolte, QuestionnaireHorticulture,
    QuestionnaireBatimentAviculture,
    VisiteTechniqueAviculture, VisiteTechniqueHorticulture
} from '../../../../models/client-portal.models';

type TabId = 'info' | 'questionnaire' | 'pev' | 'avenants' | 'documents' | 'paiements' | 'membres';

@Component({
    selector: 'app-police-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div>
        <!-- RETOUR + EN-TÊTE -->
        <div style="margin-bottom:18px;">

            <!-- Breadcrumb : Retour / N° Police -->
            <div style="display:flex;align-items:center;gap:0;flex-wrap:wrap;margin-bottom:14px;">
                <a routerLink="/mon-espace/polices"
                   style="display:inline-flex;align-items:center;gap:6px;color:#538F6C;font-size:0.82rem;font-weight:600;text-decoration:none;opacity:0.85;transition:opacity 0.2s;"
                   onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.85'">
                    <i class="fa-solid fa-arrow-left"></i> Retour aux polices
                </a>
                <span *ngIf="!loading && police"
                      style="color:#d1d1d1;margin:0 10px;font-size:0.82rem;">/</span>
                <span *ngIf="!loading && police"
                      style="font-family:monospace;font-size:0.82rem;font-weight:700;color:#1a1a1a;">
                    Police N° {{ police.numeroPolice }}
                </span>
            </div>

            <!-- Sous-titre : produit + statut -->
            <div *ngIf="!loading && police" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="color:#888;font-size:0.78rem;">{{ police.produit?.nom || 'Produit inconnu' }}</span>
                <span [style.background]="statutBg(police.statut)"
                      [style.color]="statutColor(police.statut)"
                      style="font-size:0.65rem;font-weight:700;padding:2px 9px;border-radius:20px;text-transform:uppercase;border:1px solid rgba(0,0,0,0.06);">
                    {{ statutLabel(police.statut) }}
                </span>
            </div>
        </div>

        <!-- CHARGEMENT -->
        <div *ngIf="loading" style="text-align:center;padding:80px 0;">
            <div style="width:48px;height:48px;border:4px solid #e8f4ec;border-top-color:#538F6C;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 18px;"></div>
            <p style="color:#538F6C;font-weight:600;font-size:0.9rem;">Chargement de la police...</p>
        </div>

        <!-- ERREUR -->
        <div *ngIf="!loading && !police"
             style="background:#fff;border-radius:18px;padding:64px 40px;text-align:center;border:1px solid #ffe0e0;">
            <i class="fa-solid fa-circle-exclamation" style="font-size:2.5rem;color:#e74c3c;margin-bottom:16px;display:block;"></i>
            <h4 style="color:#3E4F22;font-weight:800;margin-bottom:8px;">Police introuvable</h4>
            <p style="color:#aaa;font-size:0.9rem;margin:0 0 20px;">Cette police n'existe pas ou vous n'y avez pas accès.</p>
            <a routerLink="/mon-espace/polices"
               style="display:inline-flex;align-items:center;gap:7px;background:#538F6C;color:#fff;font-size:0.82rem;font-weight:700;padding:10px 20px;border-radius:10px;text-decoration:none;">
                <i class="fa-solid fa-arrow-left"></i> Retour
            </a>
        </div>

        <!-- CONTENU POLICE -->
        <div *ngIf="!loading && police">

            <!-- ONGLETS -->
            <div class="tabs-scroll-wrap">
            <div style="display:flex;gap:3px;flex-wrap:nowrap;min-width:max-content;background:#f5faf7;padding:5px;border-radius:12px;border:1px solid #d1d1d1;">
                <ng-container *ngFor="let tab of tabs">
                <button *ngIf="tab.id !== 'membres' || membres().length > 0"
                        (click)="activeTab = tab.id"
                        [style.background]="activeTab === tab.id ? '#538F6C' : 'transparent'"
                        [style.color]="activeTab === tab.id ? '#fff' : '#555'"
                        [style.font-weight]="activeTab === tab.id ? '700' : '500'"
                        style="border:none;padding:7px 13px;border-radius:9px;font-size:0.78rem;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s;white-space:nowrap;">
                    <i [class]="tab.icon" style="font-size:0.78rem;"></i>
                    {{ tab.label }}
                    <span *ngIf="tab.id === 'paiements' && paiements.length > 0"
                          [style.background]="activeTab === 'paiements' ? 'rgba(255,255,255,0.25)' : '#eef5f1'"
                          [style.color]="activeTab === 'paiements' ? '#fff' : '#538F6C'"
                          style="font-size:0.62rem;font-weight:800;padding:1px 6px;border-radius:10px;">
                        {{ paiements.length }}
                    </span>
                    <span *ngIf="tab.id === 'pev' && pevs.length > 0"
                          [style.background]="activeTab === 'pev' ? 'rgba(255,255,255,0.25)' : '#eef5f1'"
                          [style.color]="activeTab === 'pev' ? '#fff' : '#538F6C'"
                          style="font-size:0.62rem;font-weight:800;padding:1px 6px;border-radius:10px;">
                        {{ pevs.length }}
                    </span>
                    <span *ngIf="tab.id === 'avenants' && avenants.length > 0"
                          [style.background]="activeTab === 'avenants' ? 'rgba(255,255,255,0.25)' : '#eef5f1'"
                          [style.color]="activeTab === 'avenants' ? '#fff' : '#538F6C'"
                          style="font-size:0.62rem;font-weight:800;padding:1px 6px;border-radius:10px;">
                        {{ avenants.length }}
                    </span>
                    <span *ngIf="tab.id === 'membres' && membres().length > 0"
                          [style.background]="activeTab === 'membres' ? 'rgba(255,255,255,0.25)' : '#eef5f1'"
                          [style.color]="activeTab === 'membres' ? '#fff' : '#538F6C'"
                          style="font-size:0.62rem;font-weight:800;padding:1px 6px;border-radius:10px;">
                        {{ membres().length }}
                    </span>
                </button>
                </ng-container>
            </div>
            </div><!-- /tabs-scroll-wrap -->

            <!-- TAB: INFORMATIONS GÉNÉRALES — CONDITIONS PARTICULIÈRES -->
            <div *ngIf="activeTab === 'info'" class="cp-wrap">

                <!-- -- CANAL DE DISTRIBUTION -- -->
                <div class="cp-section-title">Canal de distribution</div>
                <table class="cp-table">
                    <tr>
                        <td class="cp-lbl">Réseau</td>
                        <td class="cp-val">{{ police.agence?.zone?.libelle || '—' }}</td>
                        <td class="cp-lbl">Agence / bureau</td>
                        <td class="cp-val">{{ police.agence?.nom || '—' }}</td>
                    </tr>
                    <tr>
                        <td class="cp-lbl">Zone de couverture</td>
                        <td class="cp-val">{{ police.region?.libelle || '—' }}</td>
                        <td class="cp-lbl">Adresse agence</td>
                        <td class="cp-val">{{ police.localisationRisque || '—' }}</td>
                    </tr>
                    <tr>
                        <td class="cp-lbl">Garantie</td>
                        <td class="cp-val">{{ police.garantie?.libelle || '—' }}</td>
                        <td class="cp-lbl">Produit</td>
                        <td class="cp-val" style="color:#538F6C;font-weight:700;">{{ police.produit?.nom || '—' }}</td>
                    </tr>
                </table>

                <!-- -- IDENTIFICATION -- -->
                <div class="cp-section-title">Identification</div>
                <table class="cp-table">
                    <tr>
                        <td class="cp-lbl">N° inscription</td>
                        <td class="cp-val" style="color:#538F6C;font-weight:700;">{{ police.client?.numeroClient || '—' }}</td>
                        <td class="cp-lbl">N° client</td>
                        <td class="cp-val" style="color:#538F6C;font-weight:700;">{{ police.client?.numeroClient || '—' }}</td>
                    </tr>
                    <tr>
                        <td class="cp-lbl">N° police</td>
                        <td class="cp-val" colspan="3" style="color:#538F6C;font-weight:700;font-family:monospace;">{{ police.numeroPolice }}</td>
                    </tr>
                </table>

                <!-- -- SOUSCRIPTEUR -- -->
                <div class="cp-section-title cp-section-italic">Souscripteur</div>
                <table class="cp-table">
                    <tr>
                        <td class="cp-lbl">Prénom / Nom</td>
                        <td class="cp-val">{{ clientNom() }}</td>
                        <td class="cp-lbl">Téléphone</td>
                        <td class="cp-val">{{ police.client?.telephone || '—' }}</td>
                    </tr>
                    <tr>
                        <td class="cp-lbl">Pièce d'identité</td>
                        <td class="cp-val">—</td>
                        <td class="cp-lbl">Email</td>
                        <td class="cp-val">{{ police.client?.email || '—' }}</td>
                    </tr>
                    <tr>
                        <td class="cp-lbl">Adresse</td>
                        <td class="cp-val">{{ police.adresseComplete || police.commune?.libelle || '—' }}</td>
                        <td class="cp-lbl">Localité</td>
                        <td class="cp-val">{{ police.localite?.libelle || police.departement?.libelle || '—' }}</td>
                    </tr>
                </table>

                <!-- -- ASSURÉ -- -->
                <div class="cp-section-title cp-section-italic">Assuré</div>
                <table class="cp-table">
                    <tr>
                        <td class="cp-lbl">Situation du risque</td>
                        <td class="cp-val">{{ police.localisationRisque || police.localite?.libelle || '—' }}</td>
                        <td class="cp-lbl">Départ / Commune</td>
                        <td class="cp-val">{{ (police.departement?.libelle || '') + (police.commune?.libelle ? ' / ' + police.commune?.libelle : '') || '—' }}</td>
                    </tr>
                    <tr *ngIf="police.produit?.categorie?.libelle">
                        <td class="cp-lbl">Catégorie produit</td>
                        <td class="cp-val" colspan="3">{{ police.produit?.categorie?.libelle }}</td>
                    </tr>
                </table>

                <!-- -- EFFET ET DURÉE DU CONTRAT -- -->
                <div class="cp-section-title">Effet et durée du contrat</div>
                <table class="cp-table">
                    <tr>
                        <td class="cp-lbl">Date d'émission</td>
                        <td class="cp-val">{{ police.dateEmission | date:'dd/MM/yyyy' }}</td>
                        <td class="cp-lbl">Durée de couverture</td>
                        <td class="cp-val">{{ police.duree ? police.duree + ' mois' : '—' }}</td>
                    </tr>
                    <tr>
                        <td class="cp-lbl">Date d'effet</td>
                        <td class="cp-val">{{ police.dateEffet | date:'dd/MM/yyyy' }}</td>
                        <td class="cp-lbl">Date d'échéance</td>
                        <td class="cp-val" [style.color]="isExpiringSoon(police.dateEcheance) ? '#e67e22' : 'inherit'">
                            {{ police.dateEcheance | date:'dd/MM/yyyy' }}
                            <i *ngIf="isExpiringSoon(police.dateEcheance)" class="fa-solid fa-triangle-exclamation" style="font-size:0.7rem;margin-left:4px;"></i>
                        </td>
                    </tr>
                    <tr>
                        <td class="cp-lbl">Tacite reconduction</td>
                        <td class="cp-val">{{ police.taciteReconduction ? 'OUI' : 'NON' }}</td>
                        <td class="cp-lbl">Franchise</td>
                        <td class="cp-val">{{ police.betail?.franchiseTaux || police.equipement?.franchiseTaux || '—' }}</td>
                    </tr>
                </table>

                <!-- -- COÛT DE L'ASSURANCE -- -->
                <div class="cp-section-title">Coût de l'assurance</div>
                <table class="cp-table">
                    <tr>
                        <td class="cp-lbl">Capital assuré</td>
                        <td class="cp-val">{{ montantAssure(police) | number:'1.0-0' }} FCFA</td>
                        <td class="cp-lbl">Prime nette HT</td>
                        <td class="cp-val">{{ (police.primeNette || 0) | number:'1.0-0' }} FCFA</td>
                    </tr>
                    <tr *ngIf="police.montantTaxes || police.montantFrais">
                        <td class="cp-lbl">Taxes &amp; frais</td>
                        <td class="cp-val">{{ (police.montantTaxes || 0) | number:'1.0-0' }} FCFA</td>
                        <td class="cp-lbl">Frais de gestion</td>
                        <td class="cp-val">{{ (police.montantFrais || 0) | number:'1.0-0' }} FCFA</td>
                    </tr>
                    <tr *ngIf="police.montantEtat">
                        <td class="cp-lbl">Subvention État</td>
                        <td class="cp-val" style="color:#27ae60;font-weight:700;">- {{ police.montantEtat | number:'1.0-0' }} FCFA</td>
                        <td class="cp-lbl cp-total-lbl">Prime TTC</td>
                        <td class="cp-val cp-total-val">{{ primeTotale(police) | number:'1.0-0' }} FCFA</td>
                    </tr>
                    <tr *ngIf="!police.montantEtat">
                        <td class="cp-lbl cp-total-lbl" colspan="2">Prime TTC</td>
                        <td class="cp-val cp-total-val" colspan="2">{{ primeTotale(police) | number:'1.0-0' }} FCFA</td>
                    </tr>
                </table>


            </div>

            <style>
            .cp-wrap { background:#fff;border-radius:14px;border:1px solid #cdd8d1;overflow:hidden;box-shadow:0 2px 14px rgba(83,143,108,0.09); }

            /* Titres de section */
            .cp-section-title {
                background:linear-gradient(90deg,#538F6C 0%,#4a8060 100%);
                padding:7px 16px;
                font-size:0.7rem;font-weight:800;color:#fff;
                text-transform:uppercase;letter-spacing:1px;
                display:flex;align-items:center;justify-content:space-between;
            }
            .cp-section-italic { font-style:italic; }

            /* Table principale */
            .cp-table { width:100%;border-collapse:collapse;font-size:0.79rem; }
            .cp-table tr { border-bottom:1px solid #eaf0ec; }
            .cp-table tr:last-child { border-bottom:none; }
            .cp-table tr:nth-child(even) td { background:#f9fcfa; }
            .cp-lbl {
                background:#f3f8f5;color:#3d6b52;font-weight:700;
                padding:8px 14px;width:20%;
                border-right:1px solid #ddeae2;
                white-space:nowrap;font-size:0.74rem;
                vertical-align:top;
            }
            .cp-val {
                color:#1a1a1a;padding:8px 14px;width:30%;
                border-right:1px solid #eaf0ec;
                font-size:0.79rem;vertical-align:top;
            }
            .cp-val:last-child { border-right:none; }
            .cp-table tr:nth-child(even) .cp-lbl { background:#ecf5ef; }

            /* Ligne total */
            .cp-total-lbl { background:#3d7554 !important;color:#fff !important;font-weight:900 !important;border-right-color:rgba(255,255,255,0.2) !important; }
            .cp-total-val { background:#3d7554 !important;color:#fff !important;font-weight:900 !important;font-size:0.88rem !important; }

            /* Table membres */
            .cp-members-table { border:none; }
            .cp-th { background:#3d7554;color:#fff;font-size:0.67rem;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;padding:9px 13px;border-right:1px solid rgba(255,255,255,0.12);white-space:nowrap; }
            .cp-th:last-child { border-right:none; }
            .cp-td { padding:9px 13px;border-right:1px solid #eee;font-size:0.78rem;color:#333; }
            .cp-td:last-child { border-right:none; }

            .cp-empty { padding:32px;text-align:center;color:#bbb;font-size:0.82rem; }

            /* Onglets wrapper scrollable */
            .tabs-scroll-wrap {
                overflow-x:auto;
                margin-bottom:14px;
                -webkit-overflow-scrolling:touch;
                scrollbar-width:none;
            }
            .tabs-scroll-wrap::-webkit-scrollbar { display:none; }

            /* -- Responsive -- */
            @media (max-width:768px) {

                /* Table conditions particulières ? 2 colonnes (label + valeur) */
                .cp-table { display:block;overflow-x:auto; }
                .cp-table tr { display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #eaf0ec; }
                .cp-table tr td { border-right:none !important;border-bottom:none; }
                .cp-lbl { width:auto;white-space:normal;font-size:0.7rem;padding:6px 10px; }
                .cp-val { width:auto;font-size:0.76rem;padding:6px 10px; }

                /* Table membres : scroll horizontal */
                div[style*="overflow-x:auto"] { overflow-x:auto; }
                .cp-members-table { min-width:480px; }

                /* Breadcrumb */
                div[style*="margin-bottom:14px"] { flex-wrap:wrap;gap:4px; }
            }

            @media (max-width:480px) {
                .cp-section-title { font-size:0.65rem;padding:6px 10px; }
                .cp-lbl { font-size:0.65rem;padding:5px 8px; }
                .cp-val { font-size:0.72rem;padding:5px 8px; }
                .cp-table tr { grid-template-columns:1fr; }
                .cp-lbl { border-bottom:none; }
                .cp-val { padding-top:2px; }
            }
            </style>

            <!-- TAB: QUESTIONNAIRE (dynamique par produit) -->
            <div *ngIf="activeTab === 'questionnaire'">
                <div *ngIf="qLoading" style="text-align:center;padding:40px;">
                    <div style="width:36px;height:36px;border:3px solid #e8f4ec;border-top-color:#538F6C;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 12px;"></div>
                    <p style="color:#538F6C;font-size:0.85rem;">Chargement du questionnaire...</p>
                </div>

                <ng-container *ngIf="!qLoading">

                <!-- --------------------------------------------------
                     AVICULTURE
                -------------------------------------------------- -->
                <div *ngIf="qAviculture">
                    <!-- Header vert -->
                    <div style="background:linear-gradient(135deg,#538F6C,#3d7554);border-radius:12px;padding:14px 18px;margin-bottom:14px;color:#fff;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-solid fa-egg" style="font-size:1.2rem;"></i>
                            </div>
                            <div>
                                <div style="font-weight:900;font-size:1rem;">Questionnaire Assurance Aviculture</div>
                                <div style="opacity:0.75;font-size:0.76rem;margin-top:3px;">
                                    <i class="fa-solid fa-file-contract" style="margin-right:4px;"></i>Police N° {{ police?.numeroPolice }}
                                </div>
                            </div>
                        </div>
                        <span style="background:#F1B53B;color:#fff;font-size:0.72rem;font-weight:800;padding:7px 16px;border-radius:20px;display:flex;align-items:center;gap:6px;white-space:nowrap;">
                            <i class="fa-solid fa-circle-check"></i> ENREGISTRÉ
                        </span>
                    </div>

                    <!-- Section 1 : Identification -->
                    <div style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">1</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">Identification</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:18px 22px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;">
                            <div>
                                <div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Le soussigné</div>
                                <div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ clientNom() }}</div>
                            </div>
                            <div *ngIf="qAviculture.adresse">
                                <div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Adresse</div>
                                <div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ qAviculture.adresse }}</div>
                            </div>
                            <div *ngIf="qAviculture.qualite">
                                <div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Qualité</div>
                                <div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ qAviculture.qualite }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2 : Bâtiments -->
                    <div *ngIf="qAviculture.batiments && qAviculture.batiments.length > 0" style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">2</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">Bâtiments d'élevage</span>
                            <span style="background:#F1B53B22;color:#856404;font-size:0.7rem;font-weight:700;padding:2px 10px;border-radius:20px;">{{ qAviculture.batiments.length }} bâtiment(s)</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;overflow:hidden;">
                            <div style="overflow-x:auto;">
                                <table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
                                    <thead>
                                        <tr style="background:#538F6C;color:#fff;">
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;white-space:nowrap;">N° Bande</th>
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;white-space:nowrap;">Nature / Espèce</th>
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;white-space:nowrap;">Mode d'élevage</th>
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:center;white-space:nowrap;">Alarme Ventil.</th>
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;white-space:nowrap;">Lieu Alarme</th>
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:center;white-space:nowrap;">Groupe Élec.</th>
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:right;white-space:nowrap;">NB Animaux</th>
                                            <th style="padding:11px 14px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:right;white-space:nowrap;">Charg. Max</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr *ngFor="let b of qAviculture.batiments; let even = even"
                                            [style.background]="even ? '#fafffe' : '#fff'"
                                            style="border-bottom:1px solid #eef5f1;">
                                            <td style="padding:11px 14px;font-weight:800;color:#538F6C;font-family:monospace;">{{ b.numeroBande || '—' }}</td>
                                            <td style="padding:11px 14px;color:#333;font-weight:600;">{{ b.natureEspece?.libelle || '—' }}</td>
                                            <td style="padding:11px 14px;color:#555;">{{ b.typeElevage?.libelle || '—' }}</td>
                                            <td style="padding:11px 14px;text-align:center;">
                                                <span [style.background]="b.alarmeVentilation ? '#e8f4ec' : '#f5f5f5'"
                                                      [style.color]="b.alarmeVentilation ? '#538F6C' : '#999'"
                                                      style="font-size:0.68rem;font-weight:700;padding:3px 9px;border-radius:20px;">
                                                    {{ b.alarmeVentilation ? 'Oui' : 'Non' }}
                                                </span>
                                            </td>
                                            <td style="padding:11px 14px;color:#555;">{{ b.lieuAlarme || '—' }}</td>
                                            <td style="padding:11px 14px;text-align:center;">
                                                <span [style.background]="b.groupeElectrogene ? '#e8f4ec' : '#f5f5f5'"
                                                      [style.color]="b.groupeElectrogene ? '#538F6C' : '#999'"
                                                      style="font-size:0.68rem;font-weight:700;padding:3px 9px;border-radius:20px;">
                                                    {{ b.groupeElectrogene ? 'Oui' : 'Non' }}
                                                </span>
                                            </td>
                                            <td style="padding:11px 14px;text-align:right;font-weight:800;color:#3E4F22;">{{ b.nombreAnimaux | number:'1.0-0' }}</td>
                                            <td style="padding:11px 14px;text-align:right;color:#555;">{{ b.chargementMax | number:'1.0-0' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3 : Questions techniques -->
                    <div style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">3</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">Questions techniques de production</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;overflow:hidden;">
                            <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
                                <thead>
                                    <tr style="background:#538F6C;color:#fff;">
                                        <th style="padding:11px 16px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;width:35%;">Question</th>
                                        <th style="padding:11px 16px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">Réponse</th>
                                        <th style="padding:11px 16px;font-weight:700;font-size:0.68rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;width:25%;">Commentaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-bottom:1px solid #eef5f1;background:#fafffe;">
                                        <td style="padding:12px 16px;color:#3E4F22;font-weight:600;">1 — Catégorie(s) d'animaux élevés</td>
                                        <td style="padding:12px 16px;">
                                            <div *ngIf="qAviculture.categorieChair?.libelle" style="color:#333;font-size:0.8rem;">Chair : <strong>{{ qAviculture.categorieChair?.libelle }}</strong></div>
                                            <div *ngIf="qAviculture.categoriePoulettes?.libelle" style="color:#333;font-size:0.8rem;">Poulettes : <strong>{{ qAviculture.categoriePoulettes?.libelle }}</strong></div>
                                            <div *ngIf="qAviculture.categoriePondeuses?.libelle" style="color:#333;font-size:0.8rem;">Pondeuses : <strong>{{ qAviculture.categoriePondeuses?.libelle }}</strong></div>
                                            <span *ngIf="!qAviculture.categorieChair && !qAviculture.categoriePoulettes && !qAviculture.categoriePondeuses" style="color:#aaa;">—</span>
                                        </td>
                                        <td style="padding:12px 16px;color:#856404;font-style:italic;font-size:0.8rem;">{{ qAvicComments[0] || '—' }}</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #eef5f1;background:#fff;">
                                        <td style="padding:12px 16px;color:#3E4F22;font-weight:600;">2 — Nombre d'animaux par catégorie</td>
                                        <td style="padding:12px 16px;">
                                            <div *ngIf="qAviculture.nbAnimauxChair != null" style="color:#333;font-size:0.8rem;">Chair : <strong>{{ qAviculture.nbAnimauxChair | number:'1.0-0' }}</strong></div>
                                            <div *ngIf="qAviculture.nbAnimauxPoulettes != null" style="color:#333;font-size:0.8rem;">Poulettes : <strong>{{ qAviculture.nbAnimauxPoulettes | number:'1.0-0' }}</strong></div>
                                            <div *ngIf="qAviculture.nbAnimauxPondeuses != null" style="color:#333;font-size:0.8rem;">Pondeuses : <strong>{{ qAviculture.nbAnimauxPondeuses | number:'1.0-0' }}</strong></div>
                                        </td>
                                        <td style="padding:12px 16px;color:#856404;font-style:italic;font-size:0.8rem;">{{ qAvicComments[1] || '—' }}</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #eef5f1;background:#fafffe;">
                                        <td style="padding:12px 16px;color:#3E4F22;font-weight:600;">3 — Fréquence de renouvellement (jours)</td>
                                        <td style="padding:12px 16px;">
                                            <div *ngIf="qAviculture.frequenceChair != null" style="color:#333;font-size:0.8rem;">Chair : <strong>{{ qAviculture.frequenceChair }} j</strong></div>
                                            <div *ngIf="qAviculture.frequencePoulettes != null" style="color:#333;font-size:0.8rem;">Poulettes : <strong>{{ qAviculture.frequencePoulettes }} j</strong></div>
                                            <div *ngIf="qAviculture.frequencePondeuses != null" style="color:#333;font-size:0.8rem;">Pondeuses : <strong>{{ qAviculture.frequencePondeuses }} j</strong></div>
                                        </td>
                                        <td style="padding:12px 16px;color:#856404;font-style:italic;font-size:0.8rem;">{{ qAvicComments[2] || '—' }}</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #eef5f1;background:#fff;">
                                        <td style="padding:12px 16px;color:#3E4F22;font-weight:600;">4 — Numéro des bandes</td>
                                        <td style="padding:12px 16px;">
                                            <div *ngIf="qAviculture.numeroBandesChair" style="color:#333;font-size:0.8rem;">Chair : <strong>{{ qAviculture.numeroBandesChair }}</strong></div>
                                            <div *ngIf="qAviculture.numeroBandesPoulettes" style="color:#333;font-size:0.8rem;">Poulettes : <strong>{{ qAviculture.numeroBandesPoulettes }}</strong></div>
                                            <div *ngIf="qAviculture.numeroBandesPondeuses" style="color:#333;font-size:0.8rem;">Pondeuses : <strong>{{ qAviculture.numeroBandesPondeuses }}</strong></div>
                                        </td>
                                        <td style="padding:12px 16px;color:#856404;font-style:italic;font-size:0.8rem;">{{ qAvicComments[3] || '—' }}</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #eef5f1;background:#fafffe;">
                                        <td style="padding:12px 16px;color:#3E4F22;font-weight:600;">5 — Prix d'achat des pondeuses (FCFA)</td>
                                        <td style="padding:12px 16px;">
                                            <span *ngIf="qAviculture.prixAchatPondeuses != null" style="color:#538F6C;font-weight:800;font-size:0.88rem;">{{ qAviculture.prixAchatPondeuses | number:'1.0-0' }} FCFA</span>
                                            <span *ngIf="qAviculture.prixAchatPondeuses == null" style="color:#aaa;">—</span>
                                        </td>
                                        <td style="padding:12px 16px;color:#856404;font-style:italic;font-size:0.8rem;">{{ qAvicComments[4] || '—' }}</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #eef5f1;background:#fff;">
                                        <td style="padding:12px 16px;color:#3E4F22;font-weight:600;">6 — Prix de vente (FCFA)</td>
                                        <td style="padding:12px 16px;">
                                            <div *ngIf="qAviculture.prixVenteChair != null" style="color:#333;font-size:0.8rem;">Chair : <strong style="color:#538F6C;">{{ qAviculture.prixVenteChair | number:'1.0-0' }} FCFA</strong></div>
                                            <div *ngIf="qAviculture.prixVentePoulettes != null" style="color:#333;font-size:0.8rem;">Poulettes : <strong style="color:#538F6C;">{{ qAviculture.prixVentePoulettes | number:'1.0-0' }} FCFA</strong></div>
                                        </td>
                                        <td style="padding:12px 16px;color:#856404;font-style:italic;font-size:0.8rem;">{{ qAvicComments[5] || '—' }}</td>
                                    </tr>
                                    <tr style="border-bottom:1px solid #eef5f1;background:#fafffe;">
                                        <td style="padding:12px 16px;color:#3E4F22;font-weight:600;">7 — Période de production (semaines)</td>
                                        <td style="padding:12px 16px;">
                                            <div *ngIf="qAviculture.periodeChair != null" style="color:#333;font-size:0.8rem;">Chair : <strong>{{ qAviculture.periodeChair }} sem.</strong></div>
                                            <div *ngIf="qAviculture.periodePoulettes != null" style="color:#333;font-size:0.8rem;">Poulettes : <strong>{{ qAviculture.periodePoulettes }} sem.</strong></div>
                                            <div *ngIf="qAviculture.periodePondeuses != null" style="color:#333;font-size:0.8rem;">Pondeuses : <strong>{{ qAviculture.periodePondeuses }} sem.</strong></div>
                                        </td>
                                        <td style="padding:12px 16px;color:#856404;font-style:italic;font-size:0.8rem;">{{ qAvicComments[6] || '—' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- --------------------------------------------------
                     BÉTAIL
                -------------------------------------------------- -->
                <div *ngIf="qBetail">
                    <div style="background:linear-gradient(135deg,#538F6C,#3d7554);border-radius:12px;padding:14px 18px;margin-bottom:14px;color:#fff;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-solid fa-cow" style="font-size:1.2rem;"></i>
                            </div>
                            <div>
                                <div style="font-weight:900;font-size:1rem;">Questionnaire Assurance Bétail</div>
                                <div style="opacity:0.75;font-size:0.76rem;margin-top:3px;"><i class="fa-solid fa-file-contract" style="margin-right:4px;"></i>Police N° {{ police?.numeroPolice }}</div>
                            </div>
                        </div>
                        <span style="background:#F1B53B;color:#fff;font-size:0.72rem;font-weight:800;padding:7px 16px;border-radius:20px;display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-circle-check"></i> ENREGISTRÉ</span>
                    </div>
                    <!-- Section 1 : Identification -->
                    <div style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">1</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Identification</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:18px 22px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
                            <div><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Le soussigné</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ clientNom() }}</div></div>
                            <div *ngIf="qBetail.adresse"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Adresse</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ qBetail.adresse }}</div></div>
                            <div *ngIf="qBetail.qualite"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Qualité</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ qBetail.qualite }}</div></div>
                        </div>
                    </div>
                    <!-- Section 2 : Élevage -->
                    <div style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">2</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Informations sur l'élevage</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;overflow:hidden;">
                            <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
                                <thead><tr style="background:#538F6C;color:#fff;">
                                    <th style="padding:11px 16px;font-weight:700;font-size:0.68rem;text-transform:uppercase;text-align:left;">Question</th>
                                    <th style="padding:11px 16px;font-weight:700;font-size:0.68rem;text-transform:uppercase;text-align:left;">Réponse</th>
                                </tr></thead>
                                <tbody>
                                    <tr *ngIf="qBetail.typeElevage?.libelle" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Type d'élevage</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ qBetail.typeElevage?.libelle }}</td></tr>
                                    <tr *ngIf="qBetail.modeElevage" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Mode d'élevage</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ qBetail.modeElevage }}</td></tr>
                                    <tr *ngIf="qBetail.dureeEmbouche" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Durée embouche</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ qBetail.dureeEmbouche }}</td></tr>
                                    <tr *ngIf="qBetail.productionLait" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Production de lait</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ qBetail.productionLait }}</td></tr>
                                    <tr *ngIf="qBetail.distanceDomicileExploitation" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Distance domicile / exploitation</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ qBetail.distanceDomicileExploitation }}</td></tr>
                                    <tr *ngIf="qBetail.elevageSimple" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Élevage simple</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ qBetail.elevageSimple }}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- Section 3 : Vétérinaire -->
                    <div *ngIf="qBetail.nomVeterinaire || qBetail.telephoneVeterinaire || qBetail.frequenceIntervention" style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">3</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Suivi vétérinaire</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:18px 22px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
                            <div *ngIf="qBetail.nomVeterinaire"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Vétérinaire</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ qBetail.nomVeterinaire }}</div></div>
                            <div *ngIf="qBetail.telephoneVeterinaire"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Téléphone</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ qBetail.telephoneVeterinaire }}</div></div>
                            <div *ngIf="qBetail.frequenceIntervention"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Fréquence d'intervention</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ qBetail.frequenceIntervention }}</div></div>
                        </div>
                        <div *ngIf="qBetail.commentaireVeterinaire" style="background:#fff8e8;border-radius:10px;border:1px solid #f1e8c8;padding:12px 16px;margin-top:12px;font-size:0.83rem;color:#856404;font-style:italic;">
                            <i class="fa-solid fa-comment-dots" style="margin-right:6px;"></i>{{ qBetail.commentaireVeterinaire }}
                        </div>
                    </div>
                </div>

                <!-- --------------------------------------------------
                     RÉCOLTE
                -------------------------------------------------- -->
                <div *ngIf="qRecolte">
                    <ng-container [ngTemplateOutlet]="qRecolteTpl" [ngTemplateOutletContext]="{q: qRecolte, titre: 'Récolte / Céréales', icon: 'fa-solid fa-wheat-awn'}"></ng-container>
                </div>

                <!-- --------------------------------------------------
                     HORTICULTURE
                -------------------------------------------------- -->
                <div *ngIf="qHorticulture">
                    <ng-container [ngTemplateOutlet]="qRecolteTpl" [ngTemplateOutletContext]="{q: qHorticulture, titre: 'Horticulture / Maraîchage', icon: 'fa-solid fa-seedling'}"></ng-container>
                </div>

                <!-- --------------------------------------------------
                     ÉQUIPEMENT / MULTIRISQUES / STOCK (générique)
                -------------------------------------------------- -->
                <div *ngIf="qEquipement || qMultirisques || qStock">
                    <div style="background:linear-gradient(135deg,#538F6C,#3d7554);border-radius:12px;padding:14px 18px;margin-bottom:14px;color:#fff;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-solid fa-clipboard-list" style="font-size:1.2rem;"></i>
                            </div>
                            <div>
                                <div style="font-weight:900;font-size:1rem;">{{ qTabLabel }}</div>
                                <div style="opacity:0.75;font-size:0.76rem;margin-top:3px;"><i class="fa-solid fa-file-contract" style="margin-right:4px;"></i>Police N° {{ police?.numeroPolice }}</div>
                            </div>
                        </div>
                        <span style="background:#F1B53B;color:#fff;font-size:0.72rem;font-weight:800;padding:7px 16px;border-radius:20px;display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-circle-check"></i> ENREGISTRÉ</span>
                    </div>
                    <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:20px;">
                        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">
                            <ng-container *ngFor="let entry of (qEquipement || qMultirisques || qStock) | keyvalue">
                                <div *ngIf="entry.value != null && entry.key !== 'id' && entry.key !== 'police'" class="q-item">
                                    <span class="q-label">{{ entry.key }}</span>
                                    <span class="q-value">{{ entry.value }}</span>
                                </div>
                            </ng-container>
                        </div>
                    </div>
                </div>

                <!-- Aucun questionnaire -->
                <div *ngIf="!qBetail && !qAviculture && !qRecolte && !qHorticulture && !qEquipement && !qMultirisques && !qStock"
                     style="text-align:center;padding:64px;color:#aaa;">
                    <i class="fa-solid fa-clipboard" style="font-size:2.5rem;margin-bottom:16px;display:block;opacity:0.4;"></i>
                    <h4 style="color:#3E4F22;font-weight:700;margin-bottom:8px;">Questionnaire non rempli</h4>
                    <p style="font-size:0.9rem;margin:0;">Aucun questionnaire n'a été enregistré pour cette police.</p>
                </div>

                </ng-container>

                <!-- Template Récolte / Horticulture partagé -->
                <ng-template #qRecolteTpl let-q="q" let-titre="titre" let-icon="icon">
                    <div style="background:linear-gradient(135deg,#538F6C,#3d7554);border-radius:12px;padding:14px 18px;margin-bottom:14px;color:#fff;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i [class]="icon" style="font-size:1.2rem;"></i>
                            </div>
                            <div>
                                <div style="font-weight:900;font-size:1rem;">Questionnaire Assurance {{ titre }}</div>
                                <div style="opacity:0.75;font-size:0.76rem;margin-top:3px;"><i class="fa-solid fa-file-contract" style="margin-right:4px;"></i>Police N° {{ police?.numeroPolice }}</div>
                            </div>
                        </div>
                        <span style="background:#F1B53B;color:#fff;font-size:0.72rem;font-weight:800;padding:7px 16px;border-radius:20px;display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-circle-check"></i> ENREGISTRÉ</span>
                    </div>
                    <!-- Section 1 : Identification -->
                    <div style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">1</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Identification</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:18px 22px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;">
                            <div *ngIf="q?.nomPrenomProfession"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Nom / Profession</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ q.nomPrenomProfession }}</div></div>
                            <div *ngIf="q?.adresseDomicile"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Adresse domicile</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ q.adresseDomicile }}</div></div>
                            <div *ngIf="q?.qualite"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Qualité</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ q.qualite }}</div></div>
                            <div *ngIf="q?.telephone"><div style="color:#aaa;font-size:0.67rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Téléphone</div><div style="color:#3E4F22;font-weight:700;font-size:0.88rem;">{{ q.telephone }}</div></div>
                        </div>
                    </div>
                    <!-- Section 2 : Exploitation -->
                    <div style="margin-bottom:10px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <div style="width:26px;height:26px;background:#F1B53B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.78rem;flex-shrink:0;">2</div>
                            <span style="font-weight:800;color:#3E4F22;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Exploitation touristique</span>
                            <div style="flex:1;height:1.5px;background:linear-gradient(to right,#F1B53B44,transparent);"></div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;overflow:hidden;">
                            <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
                                <thead><tr style="background:#538F6C;color:#fff;">
                                    <th style="padding:11px 16px;font-weight:700;font-size:0.68rem;text-transform:uppercase;text-align:left;width:45%;">Question</th>
                                    <th style="padding:11px 16px;font-weight:700;font-size:0.68rem;text-transform:uppercase;text-align:left;">Réponse</th>
                                </tr></thead>
                                <tbody>
                                    <tr *ngIf="q?.situationRisque" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Situation du risque</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.situationRisque }}</td></tr>
                                    <tr *ngIf="q?.dureeMois" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Durée (mois)</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.dureeMois }}</td></tr>
                                    <tr *ngIf="q?.dateDebut" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Date de début</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.dateDebut | date:'dd/MM/yyyy' }}</td></tr>
                                    <tr *ngIf="q?.superficieCultivee" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Superficie cultivée (ha)</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.superficieCultivee }}</td></tr>
                                    <tr *ngIf="q?.superficieAssuree" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Superficie assurée (ha)</td><td style="padding:11px 16px;color:#538F6C;font-weight:800;">{{ q.superficieAssuree }}</td></tr>
                                    <tr *ngIf="q?.speculation" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Spéculation / Culture</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.speculation }}</td></tr>
                                    <tr *ngIf="q?.chargesProduction" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Charges de production</td><td style="padding:11px 16px;color:#538F6C;font-weight:800;">{{ q.chargesProduction | number:'1.0-0' }} FCFA</td></tr>
                                    <tr *ngIf="q?.productionEscomptee" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Production escomptée</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.productionEscomptee }}</td></tr>
                                    <tr *ngIf="q?.assurancePrecedente" style="border-bottom:1px solid #eef5f1;background:#fafffe;"><td style="padding:11px 16px;color:#555;font-weight:600;">Assurance précédente</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.assurancePrecedente }}</td></tr>
                                    <tr *ngIf="q?.sinistrePrecedent" style="border-bottom:1px solid #eef5f1;background:#fff;"><td style="padding:11px 16px;color:#555;font-weight:600;">Sinistre précédent</td><td style="padding:11px 16px;color:#3E4F22;font-weight:700;">{{ q.sinistrePrecedent }}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ng-template>
            </div>

            <!-- TAB: PV / VISITES (dynamique par produit) -->
            <!-- TAB: VISITES / PEV — PAGE UNIFIÉE SANS CARDS -->
            <div *ngIf="activeTab === 'pev'">

                <!-- Spinner -->
                <div *ngIf="pevLoading" style="text-align:center;padding:60px;">
                    <div style="width:40px;height:40px;border:3px solid #e8f4ec;border-top-color:#538F6C;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 14px;"></div>
                    <p style="color:#538F6C;font-size:0.85rem;font-weight:600;">Chargement des visites...</p>
                </div>

                <ng-container *ngIf="!pevLoading">

                <!-- Vide -->
                <div *ngIf="pevs.length === 0 && visitesAviculture.length === 0 && visitesHort.length === 0"
                     style="background:#fff;border-radius:18px;border:1px solid #e8f4ec;padding:72px 40px;text-align:center;">
                    <i class="fa-solid fa-clipboard-check" style="font-size:2.8rem;color:#d1e7dd;margin-bottom:10px;display:block;"></i>
                    <h4 style="color:#3E4F22;font-weight:800;margin-bottom:8px;">Aucune visite enregistrée</h4>
                    <p style="color:#aaa;font-size:0.87rem;margin:0;">Aucune visite d'inspection n'a été saisie pour cette police.</p>
                </div>

                <!-- -- PV DE MARQUAGE BÉTAIL -- -->
                <div *ngIf="pevs.length > 0"
                     style="background:#fff;border-radius:18px;border:1px solid #e8f4ec;overflow:hidden;box-shadow:0 2px 16px rgba(85,107,47,0.06);margin-bottom:20px;">

                    <!-- En-tête page -->
                    <div style="background:linear-gradient(135deg,#538F6C,#3d7554);padding:22px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:42px;height:42px;background:rgba(255,255,255,0.15);border-radius:12px;border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-solid fa-stamp" style="color:#fff;font-size:1.1rem;"></i>
                            </div>
                            <div>
                                <div style="color:#fff;font-weight:900;font-size:0.95rem;">Procès-verbaux de marquage</div>
                                <div style="color:rgba(255,255,255,0.65);font-size:0.73rem;margin-top:3px;">Inspection vétérinaire — Bétail</div>
                            </div>
                        </div>
                        <span style="background:rgba(255,255,255,0.18);color:#fff;font-size:0.72rem;font-weight:800;padding:4px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.25);">
                            {{ pevs.length }} PV
                        </span>
                    </div>

                    <!-- Liste PV -->
                    <div *ngFor="let pv of pevs; let i = index; let last = last"
                         [style.border-bottom]="!last ? '1px solid #eef5f1' : 'none'">

                        <!-- Bandeau PV -->
                        <div style="padding:16px 28px;background:#f8fdf9;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;border-bottom:1px solid #eef5f1;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="width:32px;height:32px;background:#538F6C;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.8rem;flex-shrink:0;">{{ i+1 }}</div>
                                <div>
                                    <div style="font-weight:900;color:#3E4F22;font-size:0.88rem;">PV N° {{ pv.numeroPv }}</div>
                                    <div style="color:#888;font-size:0.72rem;margin-top:1px;display:flex;align-items:center;gap:4px;">
                                        <i class="fa-solid fa-calendar" style="font-size:0.62rem;"></i> {{ pv.dateInspection | date:'dd MMMM yyyy' }}
                                    </div>
                                </div>
                            </div>
                            <span style="background:#e8f4ec;color:#538F6C;font-size:0.7rem;font-weight:700;padding:3px 12px;border-radius:20px;display:flex;align-items:center;gap:5px;">
                                <i class="fa-solid fa-stethoscope"></i> Inspection vétérinaire
                            </span>
                        </div>

                        <!-- Champs en grille -->
                        <div style="padding:20px 28px;">
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:x 28px;gap-y:16px;gap:16px 28px;">
                                <div *ngIf="pv.nomVeterinaire">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Vétérinaire</div>
                                    <div style="color:#3E4F22;font-weight:800;font-size:0.86rem;">{{ pv.nomVeterinaire }}</div>
                                </div>
                                <div *ngIf="pv.lieuExploitation">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Lieu d'exploitation</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ pv.lieuExploitation }}</div>
                                </div>
                                <div *ngIf="pv.modeElevage">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Mode d'élevage</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ pv.modeElevage }}</div>
                                </div>
                                <div *ngIf="pv.hygiene">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Hygiène</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ pv.hygiene }}</div>
                                </div>
                                <div *ngIf="pv.vaccins">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Vaccins</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ pv.vaccins }}</div>
                                </div>
                            </div>

                            <!-- Observation -->
                            <div *ngIf="pv.observation"
                                 style="margin-top:16px;background:#fffdf0;border-left:3px solid #F1B53B;border-radius:0 10px 10px 0;padding:12px 16px;">
                                <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Observation</div>
                                <div style="color:#666;font-size:0.83rem;line-height:1.6;">{{ pv.observation }}</div>
                            </div>

                            <!-- Tableau animaux inspectés -->
                            <div *ngIf="pv.animaux && pv.animaux.length > 0" style="margin-top:20px;">
                                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                                    <div style="width:4px;height:16px;background:#538F6C;border-radius:2px;"></div>
                                    <span style="font-weight:800;color:#3E4F22;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.6px;">
                                        Animaux inspectés — {{ pv.animaux.length }}
                                    </span>
                                </div>
                                <div style="overflow-x:auto;">
                                    <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
                                        <thead>
                                            <tr style="background:#f8fdf9;border-bottom:2px solid #e8f4ec;">
                                                <th style="padding:10px 14px;color:#538F6C;font-weight:800;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">Espèce</th>
                                                <th style="padding:10px 14px;color:#538F6C;font-weight:800;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">Race</th>
                                                <th style="padding:10px 14px;color:#538F6C;font-weight:800;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">N° Boucle</th>
                                                <th style="padding:10px 14px;color:#538F6C;font-weight:800;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">Sexe</th>
                                                <th style="padding:10px 14px;color:#538F6C;font-weight:800;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;text-align:left;">ge</th>
                                                <th style="padding:10px 14px;color:#538F6C;font-weight:800;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;text-align:right;">Poids (kg)</th>
                                                <th style="padding:10px 14px;color:#538F6C;font-weight:800;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;text-align:right;">Val. unitaire</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr *ngFor="let a of pv.animaux; let even = even"
                                                [style.background]="even ? '#fafffe' : '#fff'"
                                                style="border-bottom:1px solid #eef5f1;">
                                                <td style="padding:10px 14px;font-weight:800;color:#3E4F22;">{{ a.espece || '—' }}</td>
                                                <td style="padding:10px 14px;color:#555;">{{ a.race || '—' }}</td>
                                                <td style="padding:10px 14px;font-family:monospace;color:#538F6C;font-weight:700;">{{ a.numeroBoucle || '—' }}</td>
                                                <td style="padding:10px 14px;color:#555;">{{ a.sexe || '—' }}</td>
                                                <td style="padding:10px 14px;color:#555;">{{ a.age || '—' }}</td>
                                                <td style="padding:10px 14px;text-align:right;color:#3E4F22;font-weight:700;">{{ a.poidsVif ?? '—' }}</td>
                                                <td style="padding:10px 14px;text-align:right;color:#538F6C;font-weight:800;white-space:nowrap;">{{ a.valeurUnitaire ? (a.valeurUnitaire | number:'1.0-0') + ' F' : '—' }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- -- VISITES AVICULTURE -- -->
                <div *ngIf="visitesAviculture.length > 0"
                     style="background:#fff;border-radius:18px;border:1px solid #e8f4ec;overflow:hidden;box-shadow:0 2px 16px rgba(85,107,47,0.06);margin-bottom:20px;">

                    <!-- En-tête page -->
                    <div style="background:linear-gradient(135deg,#538F6C,#3d7554);padding:22px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:42px;height:42px;background:rgba(255,255,255,0.15);border-radius:12px;border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-solid fa-egg" style="color:#fff;font-size:1.1rem;"></i>
                            </div>
                            <div>
                                <div style="color:#fff;font-weight:900;font-size:0.95rem;">Visites techniques aviculture</div>
                                <div style="color:rgba(255,255,255,0.65);font-size:0.73rem;margin-top:3px;">Inspection des bâtiments et du cheptel</div>
                            </div>
                        </div>
                        <span style="background:rgba(255,255,255,0.18);color:#fff;font-size:0.72rem;font-weight:800;padding:4px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.25);">
                            {{ visitesAviculture.length }} visite(s)
                        </span>
                    </div>

                    <!-- Liste visites -->
                    <div *ngFor="let v of visitesAviculture; let i = index; let last = last"
                         [style.border-bottom]="!last ? '1px solid #eef5f1' : 'none'">

                        <!-- Bandeau visite -->
                        <div style="padding:16px 28px;background:#f8fdf9;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;border-bottom:1px solid #eef5f1;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="width:32px;height:32px;background:#538F6C;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.8rem;flex-shrink:0;">{{ i+1 }}</div>
                                <div>
                                    <div style="font-weight:900;color:#3E4F22;font-size:0.88rem;">Visite technique #{{ v.id }}</div>
                                    <div style="color:#888;font-size:0.72rem;margin-top:1px;display:flex;align-items:center;gap:4px;">
                                        <i class="fa-solid fa-calendar" style="font-size:0.62rem;"></i> {{ v.dateVisite | date:'dd MMMM yyyy' }}
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                <span *ngIf="v.categorieVolaille?.libelle" style="background:#e8f4ec;color:#538F6C;font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:20px;">{{ v.categorieVolaille.libelle }}</span>
                                <span *ngIf="v.souche?.libelle" style="background:#eef5f1;color:#538F6C;font-size:0.7rem;font-weight:600;padding:3px 10px;border-radius:20px;">{{ v.souche.libelle }}</span>
                            </div>
                        </div>

                        <!-- Champs -->
                        <div style="padding:20px 28px;">

                            <!-- Identification -->
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px 28px;margin-bottom:20px;">
                                <div *ngIf="v.nomVeterinaire">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Vétérinaire / Expert</div>
                                    <div style="color:#3E4F22;font-weight:800;font-size:0.86rem;">{{ v.nomVeterinaire }}</div>
                                </div>
                                <div *ngIf="v.souscripteur">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Souscripteur</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.souscripteur }}</div>
                                </div>
                                <div *ngIf="v.situationRisque">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Situation du risque</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.situationRisque }}</div>
                                </div>
                                <div *ngIf="v.tauxMortalite != null">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Taux de mortalité</div>
                                    <div style="color:#e74c3c;font-weight:800;font-size:0.9rem;">{{ v.tauxMortalite }} %</div>
                                </div>
                                <div *ngIf="v.dureeVideSanitaire != null">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Durée vide sanitaire</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.dureeVideSanitaire }} jour(s)</div>
                                </div>
                                <div *ngIf="v.produitsDesinfection">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Produits désinfection</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.produitsDesinfection }}</div>
                                </div>
                                <div *ngIf="v.avisGeneral">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Avis général</div>
                                    <div style="color:#538F6C;font-weight:800;font-size:0.86rem;">{{ v.avisGeneral }}</div>
                                </div>
                            </div>

                            <!-- Indicateurs booléens -->
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:16px;">
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.existenceFicheElevage ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.existenceFicheElevage ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Fiche d'élevage</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.existencePlanAlimentation ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.existencePlanAlimentation ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Plan alimentation</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.existenceSuiviSanitaire ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.existenceSuiviSanitaire ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Suivi sanitaire</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.respectNormeAliment ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.respectNormeAliment ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Normes alimentation</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.respectCourbePoids ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.respectCourbePoids ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Courbe de poids</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.respectCalendrierVaccinal ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.respectCalendrierVaccinal ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Calendrier vaccinal</span>
                                </div>
                            </div>

                            <!-- Observations -->
                            <div *ngIf="v.observations"
                                 style="background:#fffdf0;border-left:3px solid #F1B53B;border-radius:0 10px 10px 0;padding:12px 16px;">
                                <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Observations</div>
                                <div style="color:#666;font-size:0.83rem;line-height:1.6;">{{ v.observations }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- -- VISITES HORTICULTURE -- -->
                <div *ngIf="visitesHort.length > 0"
                     style="background:#fff;border-radius:18px;border:1px solid #e8f4ec;overflow:hidden;box-shadow:0 2px 16px rgba(85,107,47,0.06);">

                    <!-- En-tête page -->
                    <div style="background:linear-gradient(135deg,#538F6C,#3d7554);padding:22px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                        <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:42px;height:42px;background:rgba(255,255,255,0.15);border-radius:12px;border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-solid fa-seedling" style="color:#fff;font-size:1.1rem;"></i>
                            </div>
                            <div>
                                <div style="color:#fff;font-weight:900;font-size:0.95rem;">Visites de risque horticulture</div>
                                <div style="color:rgba(255,255,255,0.65);font-size:0.73rem;margin-top:3px;">Inspection des parcelles et systèmes d'irrigation</div>
                            </div>
                        </div>
                        <span style="background:rgba(255,255,255,0.18);color:#fff;font-size:0.72rem;font-weight:800;padding:4px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.25);">
                            {{ visitesHort.length }} visite(s)
                        </span>
                    </div>

                    <!-- Liste visites -->
                    <div *ngFor="let v of visitesHort; let i = index; let last = last"
                         [style.border-bottom]="!last ? '1px solid #eef5f1' : 'none'">

                        <!-- Bandeau visite -->
                        <div style="padding:16px 28px;background:#f8fdf9;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;border-bottom:1px solid #eef5f1;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="width:32px;height:32px;background:#538F6C;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.8rem;flex-shrink:0;">{{ i+1 }}</div>
                                <div>
                                    <div style="font-weight:900;color:#3E4F22;font-size:0.88rem;">Visite de risque #{{ v.id }}</div>
                                    <div style="color:#888;font-size:0.72rem;margin-top:1px;display:flex;align-items:center;gap:4px;">
                                        <i class="fa-solid fa-calendar" style="font-size:0.62rem;"></i> {{ v.dateVisite | date:'dd MMMM yyyy' }}
                                    </div>
                                </div>
                            </div>
                            <span *ngIf="v.campagne?.libelle" style="background:#e8f4ec;color:#538F6C;font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:20px;">
                                Campagne : {{ v.campagne.libelle }}
                            </span>
                        </div>

                        <!-- Champs -->
                        <div style="padding:20px 28px;">
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px 28px;margin-bottom:20px;">
                                <div *ngIf="v.nomExpert">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Expert</div>
                                    <div style="color:#3E4F22;font-weight:800;font-size:0.86rem;">{{ v.nomExpert }}</div>
                                </div>
                                <div *ngIf="v.souscripteur">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Souscripteur</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.souscripteur }}</div>
                                </div>
                                <div *ngIf="v.situationRisque">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Situation du risque</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.situationRisque }}</div>
                                </div>
                                <div *ngIf="v.sourceEau">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Source d'eau</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.sourceEau }}</div>
                                </div>
                                <div *ngIf="v.typeIrrigation">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Type d'irrigation</div>
                                    <div style="color:#3E4F22;font-weight:700;font-size:0.86rem;">{{ v.typeIrrigation }}</div>
                                </div>
                                <div *ngIf="v.avisGeneral">
                                    <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Avis général</div>
                                    <div style="color:#538F6C;font-weight:800;font-size:0.86rem;">{{ v.avisGeneral }}</div>
                                </div>
                            </div>

                            <!-- Indicateurs booléens -->
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:16px;">
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.systemeIrrigationFonctionnel ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.systemeIrrigationFonctionnel ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Irrigation fonctionnelle</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.existenceCloture ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.existenceCloture ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Clôture existante</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;">
                                    <i [class]="v.existenceAbri ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                                       [style.color]="v.existenceAbri ? '#538F6C' : '#e74c3c'" style="font-size:1rem;flex-shrink:0;"></i>
                                    <span style="color:#3E4F22;font-size:0.78rem;font-weight:700;">Abri présent</span>
                                </div>
                            </div>

                            <!-- Observations -->
                            <div *ngIf="v.observations"
                                 style="background:#fffdf0;border-left:3px solid #F1B53B;border-radius:0 10px 10px 0;padding:12px 16px;">
                                <div style="color:#aaa;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Observations</div>
                                <div style="color:#666;font-size:0.83rem;line-height:1.6;">{{ v.observations }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                </ng-container>
            </div>

            <!-- TAB: AVENANTS -->
            <div *ngIf="activeTab === 'avenants'">
                <div *ngIf="avenantLoading" style="text-align:center;padding:40px;">
                    <div style="width:36px;height:36px;border:3px solid #e8f4ec;border-top-color:#538F6C;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 12px;"></div>
                    <p style="color:#538F6C;font-size:0.85rem;">Chargement des avenants...</p>
                </div>
                <ng-container *ngIf="!avenantLoading">
                    <div *ngIf="avenants.length === 0" style="text-align:center;padding:64px;color:#aaa;">
                        <i class="fa-solid fa-file-pen" style="font-size:2.5rem;margin-bottom:16px;display:block;opacity:0.4;"></i>
                        <h4 style="color:#3E4F22;font-weight:700;margin-bottom:8px;">Aucun avenant</h4>
                        <p style="font-size:0.9rem;margin:0;">Aucun avenant n'a été enregistré pour cette police.</p>
                    </div>
                    <div *ngIf="avenants.length > 0" style="display:flex;flex-direction:column;gap:14px;">
                        <div *ngFor="let a of avenants; let i = index"
                             style="background:#fff;border-radius:16px;border:1px solid #e8f4ec;padding:22px;box-shadow:0 2px 10px rgba(85,107,47,0.04);">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eef5f1;flex-wrap:wrap;gap:10px;">
                                <div style="display:flex;align-items:center;gap:10px;">
                                    <div style="width:34px;height:34px;background:#538F6C;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.8rem;font-weight:800;flex-shrink:0;">{{ i+1 }}</div>
                                    <div>
                                        <div style="font-weight:800;color:#3E4F22;font-size:0.9rem;">Avenant N° {{ a.numeroAvenant || ('AV-' + a.id) }}</div>
                                        <div style="color:#888;font-size:0.75rem;margin-top:2px;">{{ a.dateEmission | date:'dd/MM/yyyy' }}</div>
                                    </div>
                                </div>
                                <span [style.background]="statutBg(a.statut)"
                                      [style.color]="statutColor(a.statut)"
                                      style="font-size:0.68rem;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;">
                                    {{ statutLabel(a.statut) }}
                                </span>
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">
                                <div *ngIf="a.dateEffet" class="q-item"><span class="q-label">Date d'effet</span><span class="q-value">{{ a.dateEffet | date:'dd/MM/yyyy' }}</span></div>
                                <div *ngIf="a.dateEcheance" class="q-item"><span class="q-label">Date échéance</span><span class="q-value">{{ a.dateEcheance | date:'dd/MM/yyyy' }}</span></div>
                                <div *ngIf="a.typeAvenant" class="q-item"><span class="q-label">Type</span><span class="q-value">{{ a.typeAvenant?.libelle || a.typeAvenant }}</span></div>
                                <div *ngIf="a.motif" class="q-item"><span class="q-label">Motif</span><span class="q-value">{{ a.motif }}</span></div>
                                <div *ngIf="a.montantPrime != null" class="q-item"><span class="q-label">Prime avenant</span><span class="q-value" style="color:#538F6C;">{{ a.montantPrime | number:'1.0-0' }} FCFA</span></div>
                            </div>
                            <div *ngIf="a.observations" style="margin-top:12px;background:#f8fdf9;border-radius:8px;border:1px solid #e8f4ec;padding:10px 14px;font-size:0.82rem;color:#555;font-style:italic;">
                                <i class="fa-solid fa-circle-info" style="margin-right:5px;color:#538F6C;"></i>{{ a.observations }}
                            </div>
                            <!-- Bouton télécharger l'avenant -->
                            <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
                                <a [href]="documentUrl('avenant', a.id, 'pdf')" target="_blank"
                                   style="display:inline-flex;align-items:center;gap:6px;background:#538F6C;color:#fff;font-size:0.75rem;font-weight:700;padding:7px 14px;border-radius:8px;text-decoration:none;">
                                    <i class="fa-solid fa-file-pdf"></i> Télécharger PDF
                                </a>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>

            <!-- TAB: MEMBRES -->
            <div *ngIf="activeTab === 'membres'">
                <!-- Résumé -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
                    <div>
                        <h4 style="margin:0 0 4px;font-size:0.95rem;font-weight:800;color:#3E4F22;">Membres adhérents à la police</h4>
                        <p style="margin:0;font-size:0.8rem;color:#888;">Liste des membres enregistrés pour cette police collective</p>
                    </div>
                    <span style="background:#538F6C;color:#fff;font-size:0.75rem;font-weight:800;padding:5px 14px;border-radius:20px;white-space:nowrap;">
                        <i class="fa-solid fa-users" style="margin-right:6px;"></i>{{ membres().length }} membre(s)
                    </span>
                </div>

                <!-- Tableau membres -->
                <div *ngIf="membres().length > 0" style="overflow-x:auto;border-radius:12px;border:1px solid #e8f4ec;box-shadow:0 2px 10px rgba(85,107,47,0.05);">
                    <table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
                        <thead>
                            <tr style="background:#538F6C;">
                                <th style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:left;">N°</th>
                                <th style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:left;">Nom du membre</th>
                                <th *ngIf="isBetail" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:left;">Catégorie</th>
                                <th *ngIf="isBetail" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Nb animaux</th>
                                <th *ngIf="isBetail" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Valeur totale</th>
                                <th *ngIf="isBetail" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Prime</th>
                                <th *ngIf="isAviculture" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:left;">N° Bâtiment</th>
                                <th *ngIf="isAviculture" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Nb animaux</th>
                                <th *ngIf="isAviculture" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Val. assurée</th>
                                <th *ngIf="isAviculture" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Prime</th>
                                <th *ngIf="isRecolte || isHorticulture" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Superficie (ha)</th>
                                <th *ngIf="isRecolte || isHorticulture" style="padding:11px 14px;color:#fff;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:.06em;text-align:right;">Prime</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let m of membres(); let i = index"
                                [style.background]="i % 2 === 0 ? '#fffdf0' : '#f3faf6'">
                                <td style="padding:11px 14px;color:#538F6C;font-weight:800;border-bottom:1px solid #eef5f0;">{{ i + 1 }}</td>
                                <td style="padding:11px 14px;border-bottom:1px solid #eef5f0;">
                                    <div style="font-weight:700;color:#3E4F22;">{{ m.nomMembre || m.nom || '—' }}</div>
                                    <div *ngIf="m.prenom" style="color:#888;font-size:0.72rem;">{{ m.prenom }}</div>
                                    <div *ngIf="m.numeroCni" style="color:#aaa;font-size:0.7rem;font-family:monospace;">CNI : {{ m.numeroCni }}</div>
                                </td>
                                <td *ngIf="isBetail" style="padding:11px 14px;border-bottom:1px solid #eef5f0;">{{ m.categorieLibelle || '—' }}</td>
                                <td *ngIf="isBetail" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;">{{ m.nombre ?? '—' }}</td>
                                <td *ngIf="isBetail" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;white-space:nowrap;">{{ m.valeurTotale ? (m.valeurTotale | number:'1.0-0') + ' F' : '—' }}</td>
                                <td *ngIf="isBetail" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;color:#538F6C;font-weight:700;white-space:nowrap;">{{ m.prime ? (m.prime | number:'1.0-0') + ' F' : '—' }}</td>
                                <td *ngIf="isAviculture" style="padding:11px 14px;border-bottom:1px solid #eef5f0;font-family:monospace;font-size:0.8rem;">{{ m.numeroBatiment || '—' }}</td>
                                <td *ngIf="isAviculture" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;">{{ m.nombreAnimaux ?? '—' }}</td>
                                <td *ngIf="isAviculture" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;white-space:nowrap;">{{ m.valeurAssuree ? (m.valeurAssuree | number:'1.0-0') + ' F' : '—' }}</td>
                                <td *ngIf="isAviculture" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;color:#538F6C;font-weight:700;white-space:nowrap;">{{ m.prime ? (m.prime | number:'1.0-0') + ' F' : '—' }}</td>
                                <td *ngIf="isRecolte || isHorticulture" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;">{{ m.superficie ?? '—' }}</td>
                                <td *ngIf="isRecolte || isHorticulture" style="padding:11px 14px;border-bottom:1px solid #eef5f0;text-align:right;color:#538F6C;font-weight:700;white-space:nowrap;">{{ m.prime ? (m.prime | number:'1.0-0') + ' F' : '—' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Aucun membre -->
                <div *ngIf="membres().length === 0"
                     style="text-align:center;padding:48px 20px;background:#f8fdf9;border-radius:14px;border:1.5px dashed #d1e7dd;">
                    <i class="fa-solid fa-users" style="font-size:2rem;color:#cde0d6;display:block;margin-bottom:12px;"></i>
                    <p style="color:#aaa;font-size:0.84rem;margin:0;">Aucun membre adhérent enregistré pour cette police.</p>
                </div>
            </div>

            <!-- TAB: DOCUMENTS -->
            <div *ngIf="activeTab === 'documents'">
                <!-- Spinner -->
                <div *ngIf="docLoading" style="text-align:center;padding:40px;">
                    <div style="width:36px;height:36px;border:3px solid #e8f4ec;border-top-color:#538F6C;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 12px;"></div>
                    <p style="color:#538F6C;font-size:0.85rem;">Chargement des documents...</p>
                </div>
                <ng-container *ngIf="!docLoading">

                <!-- -- Section 1 : Documents générés par la police (DocumentController) -- -->
                <div style="margin-bottom:14px;">
                    <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px;">
                        <i class="fa-solid fa-file-contract" style="color:#538F6C;"></i>
                        <span style="font-weight:800;color:#3E4F22;font-size:0.88rem;text-transform:uppercase;letter-spacing:0.5px;">Documents contractuels</span>
                        <span style="background:#e8f4ec;color:#538F6C;font-size:0.7rem;font-weight:700;padding:2px 10px;border-radius:20px;">Police N° {{ police?.numeroPolice }}</span>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:10px;">

                        <!-- Conditions particulières (police principale) -->
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;box-shadow:0 1px 6px rgba(85,107,47,0.04);">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="width:40px;height:40px;background:#ffe4e4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <i class="fa-solid fa-file-pdf" style="color:#e74c3c;font-size:1.05rem;"></i>
                                </div>
                                <div>
                                    <div style="font-weight:800;color:#3E4F22;font-size:0.85rem;">Conditions particulières</div>
                                    <div style="color:#888;font-size:0.71rem;margin-top:2px;">
                                        <span style="font-family:monospace;background:#f8f8f8;padding:1px 7px;border-radius:8px;">{{ policeDocType() }}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;">
                                <button (click)="downloadDoc(documentUrl(policeDocType(), police!.id, 'pdf'), policeDocType()+'.pdf')"
                                   style="display:inline-flex;align-items:center;gap:5px;background:#e74c3c;color:#fff;font-size:0.72rem;font-weight:700;padding:7px 12px;border-radius:8px;border:none;cursor:pointer;">
                                    <i class="fa-solid fa-file-pdf"></i> PDF
                                </button>
                                <button (click)="downloadDoc(documentUrl(policeDocType(), police!.id, 'word'), policeDocType()+'.docx')"
                                   style="display:inline-flex;align-items:center;gap:5px;background:#2b5eb0;color:#fff;font-size:0.72rem;font-weight:700;padding:7px 12px;border-radius:8px;border:none;cursor:pointer;">
                                    <i class="fa-solid fa-file-word"></i> Word
                                </button>
                                <button (click)="openDoc(documentUrl(policeDocType(), police!.id, 'pdf'), 'Conditions particulières')"
                                   style="display:inline-flex;align-items:center;gap:5px;background:#27ae60;color:#fff;font-size:0.72rem;font-weight:700;padding:7px 12px;border-radius:8px;border:none;cursor:pointer;">
                                    <i class="fa-solid fa-eye"></i> Consulter
                                </button>
                            </div>
                        </div>

                        <!-- Documents additionnels (questionnaire, attestation, annexe…) -->
                        <div *ngFor="let d of extraDocTypes()"
                             style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;box-shadow:0 1px 6px rgba(85,107,47,0.04);">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="width:40px;height:40px;background:#eef5f1;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <i [class]="d.icon" style="color:#538F6C;font-size:1.05rem;"></i>
                                </div>
                                <div>
                                    <div style="font-weight:800;color:#3E4F22;font-size:0.85rem;">{{ d.label }}</div>
                                    <div style="color:#888;font-size:0.71rem;margin-top:2px;">
                                        <span style="font-family:monospace;background:#f8f8f8;padding:1px 7px;border-radius:8px;">{{ d.type }}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;">
                                <button (click)="downloadDoc(documentUrl(d.type, police!.id, 'pdf'), d.type+'.pdf')"
                                   style="display:inline-flex;align-items:center;gap:5px;background:#e74c3c;color:#fff;font-size:0.72rem;font-weight:700;padding:7px 12px;border-radius:8px;border:none;cursor:pointer;">
                                    <i class="fa-solid fa-file-pdf"></i> PDF
                                </button>
                                <button (click)="downloadDoc(documentUrl(d.type, police!.id, 'word'), d.type+'.docx')"
                                   style="display:inline-flex;align-items:center;gap:5px;background:#2b5eb0;color:#fff;font-size:0.72rem;font-weight:700;padding:7px 12px;border-radius:8px;border:none;cursor:pointer;">
                                    <i class="fa-solid fa-file-word"></i> Word
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- -- Section 2 : Documents de référence (DocumentModuleController, filtrés par category) -- -->
                <div>
                    <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px;">
                        <i class="fa-solid fa-folder-open" style="color:#538F6C;"></i>
                        <span style="font-weight:800;color:#3E4F22;font-size:0.88rem;text-transform:uppercase;letter-spacing:0.5px;">Documents de référence du produit</span>
                        <span style="background:#e8f4ec;color:#538F6C;font-size:0.7rem;font-weight:700;padding:2px 10px;border-radius:20px;">{{ documents.length }}</span>
                    </div>

                    <!-- Liste des documents -->
                    <div *ngIf="documents.length > 0" style="display:flex;flex-direction:column;gap:10px;">
                        <div *ngFor="let doc of documents"
                             style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;box-shadow:0 1px 6px rgba(85,107,47,0.04);">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="width:40px;height:40px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <i class="fa-solid fa-file-pdf" style="color:#e74c3c;font-size:1rem;"></i>
                                </div>
                                <div>
                                    <div style="font-weight:700;color:#3E4F22;font-size:0.84rem;">{{ doc.libelle || doc.typeDocument?.libelle || 'Document' }}</div>
                                    <div style="color:#888;font-size:0.71rem;display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:3px;">
                                        <span *ngIf="doc.typeDocument?.libelle"
                                              style="background:#e8f4ec;color:#538F6C;font-size:0.67rem;font-weight:700;padding:1px 8px;border-radius:10px;">
                                            {{ doc.typeDocument?.libelle }}
                                        </span>
                                        <span *ngIf="doc.filename" style="font-family:monospace;font-size:0.67rem;">{{ doc.filename }}</span>
                                        <span *ngIf="doc.marquerParDefault"
                                              style="background:#fff3cd;color:#856404;font-size:0.67rem;font-weight:700;padding:1px 8px;border-radius:10px;">
                                            Par défaut
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button (click)="openDoc(apiUrl + '/document-modules/' + doc.id + '/view', doc.libelle || doc.typeDocument?.libelle || 'Document')"
                               style="display:inline-flex;align-items:center;gap:6px;background:#538F6C;color:#fff;font-size:0.72rem;font-weight:700;padding:8px 14px;border-radius:9px;border:none;cursor:pointer;white-space:nowrap;flex-shrink:0;">
                                <i class="fa-solid fa-eye"></i> Voir
                            </button>
                        </div>
                    </div>

                    <!-- Aucun document de référence -->
                    <div *ngIf="documents.length === 0"
                         style="background:#f8fdf9;border-radius:14px;border:1px dashed #d1e7dd;padding:32px;text-align:center;color:#aaa;font-size:0.84rem;">
                        <i class="fa-solid fa-folder-open" style="font-size:1.6rem;margin-bottom:10px;display:block;opacity:0.35;color:#538F6C;"></i>
                        Aucun document de référence pour ce produit.
                    </div>
                </div>

                </ng-container>
            </div>

            <!-- TAB: PAIEMENTS -->
            <div *ngIf="activeTab === 'paiements'">
                <div *ngIf="paiementsLoading" style="text-align:center;padding:40px;">
                    <div style="width:36px;height:36px;border:3px solid #e8f4ec;border-top-color:#538F6C;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 12px;"></div>
                    <p style="color:#538F6C;font-size:0.85rem;">Chargement des paiements...</p>
                </div>

                <div *ngIf="!paiementsLoading">
                    <!-- Résumé -->
                    <div *ngIf="paiements.length > 0"
                         style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:20px;">
                        <div style="background:linear-gradient(135deg,#538F6C,#27ae60);border-radius:14px;padding:18px;text-align:center;color:#fff;">
                            <div style="font-size:0.72rem;font-weight:600;text-transform:uppercase;opacity:0.85;margin-bottom:6px;">Total versé</div>
                            <div style="font-size:1.2rem;font-weight:900;">{{ totalVerse() | number:'1.0-0' }} FCFA</div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:18px;text-align:center;">
                            <div style="color:#888;font-size:0.72rem;font-weight:600;text-transform:uppercase;margin-bottom:6px;">Paiements</div>
                            <div style="color:#3E4F22;font-size:1.2rem;font-weight:900;">{{ paiements.length }}</div>
                        </div>
                        <div style="background:#fff;border-radius:14px;border:1px solid #e8f4ec;padding:18px;text-align:center;">
                            <div style="color:#888;font-size:0.72rem;font-weight:600;text-transform:uppercase;margin-bottom:6px;">Encaissés</div>
                            <div style="color:#27ae60;font-size:1.2rem;font-weight:900;">{{ nbEncaisses() }}</div>
                        </div>
                    </div>

                    <!-- Tableau des paiements -->
                    <div *ngIf="paiements.length > 0"
                         style="background:#fff;border-radius:16px;border:1px solid #e8f4ec;overflow:hidden;box-shadow:0 2px 10px rgba(85,107,47,0.04);">
                        <div style="overflow-x:auto;">
                            <table style="width:100%;border-collapse:collapse;font-size:0.84rem;">
                                <thead>
                                    <tr style="background:#f8fdf9;">
                                        <th style="padding:11px 16px;color:#538F6C;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e8f4ec;">N° Facture</th>
                                        <th style="padding:11px 16px;color:#538F6C;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e8f4ec;">Date</th>
                                        <th style="padding:11px 16px;color:#538F6C;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e8f4ec;">Montant</th>
                                        <th style="padding:11px 16px;color:#538F6C;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e8f4ec;">Mode</th>
                                        <th style="padding:11px 16px;color:#538F6C;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e8f4ec;">Statut</th>
                                        <th style="padding:11px 16px;color:#538F6C;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e8f4ec;">Encaissé</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let p of paiements; let even = even"
                                        [style.background]="even ? '#fafffe' : '#fff'"
                                        style="border-bottom:1px solid #eef5f1;">
                                        <td style="padding:12px 16px;font-family:monospace;font-weight:700;color:#3E4F22;font-size:0.82rem;">
                                            {{ p.numeroFacture || '—' }}
                                        </td>
                                        <td style="padding:12px 16px;color:#555;white-space:nowrap;">
                                            {{ p.dateEmission | date:'dd/MM/yyyy' }}
                                        </td>
                                        <td style="padding:12px 16px;white-space:nowrap;">
                                            <span style="color:#538F6C;font-weight:800;">{{ p.montantPaye | number:'1.0-0' }} FCFA</span>
                                        </td>
                                        <td style="padding:12px 16px;color:#555;font-size:0.8rem;">{{ modeLabel(p.modePaiement) }}</td>
                                        <td style="padding:12px 16px;">
                                            <span [style.background]="paiStatutBg(p.statut)"
                                                  [style.color]="paiStatutColor(p.statut)"
                                                  style="font-size:0.66rem;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;white-space:nowrap;">
                                                {{ paiStatutLabel(p.statut) }}
                                            </span>
                                        </td>
                                        <td style="padding:12px 16px;text-align:center;">
                                            <span *ngIf="p.encaisse"
                                                  style="display:inline-flex;align-items:center;gap:4px;background:#e8f4ec;color:#538F6C;font-size:0.7rem;font-weight:700;padding:3px 9px;border-radius:20px;">
                                                <i class="fa-solid fa-check"></i> Oui
                                            </span>
                                            <span *ngIf="!p.encaisse"
                                                  style="display:inline-flex;align-items:center;gap:4px;background:#f5f5f5;color:#999;font-size:0.7rem;font-weight:700;padding:3px 9px;border-radius:20px;">
                                                <i class="fa-solid fa-clock"></i> Non
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div *ngIf="paiements.length === 0"
                         style="text-align:center;padding:64px;color:#aaa;">
                        <i class="fa-solid fa-receipt" style="font-size:2.5rem;margin-bottom:16px;display:block;opacity:0.4;"></i>
                        <h4 style="color:#3E4F22;font-weight:700;margin-bottom:8px;">Aucun paiement enregistré</h4>
                        <p style="font-size:0.9rem;margin:0;">Aucun paiement n'a été effectué pour cette police.</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <!-- -- MODAL PDF VIEWER -- -->
    <div *ngIf="pdfModal.open"
         style="position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;"
         (click)="closeDoc()">

      <!-- Overlay -->
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(4px);"></div>

      <!-- Fenêtre -->
      <div style="position:relative;z-index:1;width:100%;max-width:960px;height:90vh;
                  background:#1a1a2e;border-radius:16px;overflow:hidden;
                  display:flex;flex-direction:column;
                  box-shadow:0 24px 80px rgba(0,0,0,0.5);"
           (click)="$event.stopPropagation()">

        <!-- Header modal -->
        <div style="display:flex;align-items:center;gap:12px;padding:14px 20px;
                    background:#3E4F22;border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0;">
          <div style="width:36px;height:36px;border-radius:10px;background:rgba(241,181,59,0.15);
                      border:1px solid rgba(241,181,59,0.3);display:grid;place-items:center;">
            <i class="fa-solid fa-file-pdf" style="color:#F1B53B;font-size:14px;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              {{ pdfModal.title }}
            </div>
            <div style="font-size:11px;color:rgba(255,255,255,0.45);">Document confidentiel · Sénégal Excursions</div>
          </div>
          <button (click)="closeDoc()"
                  style="width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,0.1);
                         border:none;color:#fff;cursor:pointer;display:grid;place-items:center;
                         font-size:14px;transition:background .18s;"
                  onmouseover="this.style.background='rgba(255,255,255,0.2)'"
                  onmouseout="this.style.background='rgba(255,255,255,0.1)'">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Corps : spinner / erreur / iframe -->
        <div style="flex:1;min-height:0;position:relative;">

          <!-- Spinner -->
          <div *ngIf="pdfModal.loading"
               style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
                      justify-content:center;gap:14px;background:#1a1a2e;">
            <div style="width:44px;height:44px;border:3px solid rgba(241,181,59,0.2);
                        border-top-color:#F1B53B;border-radius:50%;animation:spin 0.9s linear infinite;"></div>
            <span style="color:rgba(255,255,255,0.55);font-size:13px;">Chargement du document…</span>
          </div>

          <!-- Erreur -->
          <div *ngIf="pdfModal.error && !pdfModal.loading"
               style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
                      justify-content:center;gap:14px;background:#1a1a2e;padding:32px;text-align:center;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size:2.2rem;color:#e74c3c;"></i>
            <div>
              <div style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:700;margin-bottom:6px;">Impossible de charger le document</div>
              <div style="color:rgba(255,255,255,0.4);font-size:12px;font-family:monospace;">{{ pdfModal.errorMsg }}</div>
            </div>
            <a [href]="pdfModal.url" target="_blank"
               style="display:inline-flex;align-items:center;gap:8px;background:#F1B53B;color:#3E4F22;
                      font-size:13px;font-weight:700;padding:10px 20px;border-radius:10px;text-decoration:none;margin-top:4px;">
              <i class="fa-solid fa-external-link-alt"></i> Ouvrir dans un nouvel onglet
            </a>
          </div>

          <!-- PDF iframe -->
          <iframe *ngIf="pdfModal.safeUrl && !pdfModal.loading"
                  [src]="pdfModal.safeUrl"
                  style="width:100%;height:100%;border:none;"
                  type="application/pdf">
          </iframe>
        </div>
      </div>
    </div>

    <style>
        @keyframes spin { to { transform:rotate(360deg); } }
        .q-item { display:flex;flex-direction:column;gap:4px;padding:12px 14px;background:#f8fdf9;border-radius:10px;border:1px solid #e8f4ec; }
        .q-label { color:#888;font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.4px; }
        .q-value { color:#3E4F22;font-size:0.86rem;font-weight:700; }
    </style>
    `,
})
export class PoliceDetailComponent implements OnInit, OnDestroy {
    police:    Police | null = null;
    paiements: Paiement[]   = [];

    /* Visites / PV (selon produit) */
    pevs:              PevMarquage[]              = [];
    visitesAviculture: VisiteTechniqueAviculture[] = [];
    visitesHort:       VisiteTechniqueHorticulture[] = [];

    /* Questionnaires (selon produit) */
    qBetail:       any = null;
    qAviculture:   QuestionnaireAviculture    | null = null;
    qRecolte:      QuestionnaireRecolte       | null = null;
    qHorticulture: QuestionnaireHorticulture  | null = null;
    qEquipement:   any = null;
    qMultirisques: any = null;
    qStock:        any = null;

    avenants:          Avenant[]        = [];
    documents:         DocumentModule[] = [];
    /* Commentaires aviculture parsés (index 0=Q1 … 6=Q7) */
    qAvicComments:     string[]         = [];

    loading           = true;
    pevLoading        = false;
    qLoading          = false;
    paiementsLoading  = false;
    avenantLoading    = false;
    docLoading        = false;

    activeTab: TabId = 'info';

    /* Type du produit — calculé une seule fois */
    isBetail       = false;
    isAviculture   = false;
    isRecolte      = false;
    isHorticulture = false;
    isEquipement   = false;
    isMultirisques = false;
    isStock        = false;
    pevTabLabel = 'Visite de risque';
    qTabLabel   = 'Questionnaire';

    /* Onglets — propriété stable (jamais recréée, pas de getter) */
    tabs: { id: TabId; label: string; icon: string }[] = [
        { id: 'info',          label: 'Informations',     icon: 'fa-solid fa-circle-info' },
        { id: 'membres',       label: 'Membres',          icon: 'fa-solid fa-users' },
        { id: 'questionnaire', label: 'Questionnaire',    icon: 'fa-solid fa-clipboard-list' },
        { id: 'pev',           label: 'Visite de risque', icon: 'fa-solid fa-clipboard-check' },
        { id: 'avenants',      label: 'Avenants',         icon: 'fa-solid fa-file-pen' },
        { id: 'documents',     label: 'Documents',        icon: 'fa-solid fa-file-pdf' },
        { id: 'paiements',     label: 'Paiements',        icon: 'fa-solid fa-receipt' },
    ];

    private buildFlags(policeId: number) {
        const code = (this.police?.produit?.code || '').toLowerCase();
        const nom  = (this.police?.produit?.nom  || '').toLowerCase();

        this.isBetail       = code.includes('bet') || code.includes('chep') || code.includes('bovin')
                           || nom.includes('bétail') || nom.includes('betail') || nom.includes('cheptel');
        this.isAviculture   = !this.isBetail
                           && (code.includes('avi') || nom.includes('avicul') || nom.includes('volaille'));
        this.isRecolte      = code.includes('recol') || nom.includes('récolte') || nom.includes('recolte');
        this.isHorticulture = code.includes('hort') || nom.includes('horticul') || nom.includes('maraich');
        this.isEquipement   = code.includes('equip') || code.includes('mater') || nom.includes('équipement') || nom.includes('equipement');
        this.isMultirisques = code.includes('multi') || nom.includes('multirisque');
        this.isStock        = code.includes('stock') || nom.includes('stock');

        /* Labels des onglets */
        this.pevTabLabel = this.isBetail ? 'PV de marquage' : 'Visite de risque';
        if      (this.isBetail)       this.qTabLabel = 'Questionnaire bétail';
        else if (this.isAviculture)   this.qTabLabel = 'Questionnaire aviculture';
        else if (this.isRecolte)      this.qTabLabel = 'Questionnaire récolte';
        else if (this.isHorticulture) this.qTabLabel = 'Questionnaire horticulture';
        else if (this.isEquipement)   this.qTabLabel = 'Questionnaire équipement';
        else if (this.isMultirisques) this.qTabLabel = 'Questionnaire multirisques';
        else if (this.isStock)        this.qTabLabel = 'Questionnaire stock';
        else                          this.qTabLabel = 'Questionnaire';

        this.tabs = this.tabs.map(t => {
            if (t.id === 'pev')           return { ...t, label: this.pevTabLabel };
            if (t.id === 'questionnaire') return { ...t, label: this.qTabLabel };
            return t;
        });

        /* Charger questionnaire + visites adaptés */
        this.loadQuestionnaire(policeId);
        this.loadVisites(policeId);
    }

    constructor(
        private route:     ActivatedRoute,
        private portal:    ClientPortalService,
        private auth:      AuthService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        const ref = this.route.snapshot.paramMap.get('ref') ?? '';
        let id = 0;
        try { id = Number(atob(ref)); } catch { id = 0; }
        if (!id) { this.loading = false; return; }

        this.portal.getPolice(id).subscribe({
            next: p => {
                this.police  = p;
                this.loading = false;
                this.buildFlags(id);
                this.loadPaiements(id);
                this.loadAvenants(id);
                this.loadDocuments();
            },
            error: () => { this.loading = false; }
        });
    }

    private loadQuestionnaire(policeId: number) {
        this.qLoading = true;
        const done = () => { this.qLoading = false; };

        if (this.isBetail) {
            this.portal.getQuestionnaireBetail(policeId).subscribe({
                next: q => { this.qBetail = q; done(); }, error: done
            });
        } else if (this.isAviculture) {
            this.portal.getQuestionnaireAviculture(policeId).subscribe({
                next: q => {
                    this.qAviculture = q;
                    this.qAvicComments = this.parseQComments(q?.commentaire, 7);
                    done();
                }, error: done
            });
        } else if (this.isRecolte) {
            this.portal.getQuestionnaireRecolte(policeId).subscribe({
                next: q => { this.qRecolte = q; done(); }, error: done
            });
        } else if (this.isHorticulture) {
            this.portal.getQuestionnaireHorticulture(policeId).subscribe({
                next: q => { this.qHorticulture = q; done(); }, error: done
            });
        } else if (this.isEquipement) {
            this.portal.getQuestionnaireEquipement(policeId).subscribe({
                next: q => { this.qEquipement = q; done(); }, error: done
            });
        } else if (this.isMultirisques) {
            this.portal.getQuestionnaireMultirisques(policeId).subscribe({
                next: q => { this.qMultirisques = q; done(); }, error: done
            });
        } else if (this.isStock) {
            this.portal.getQuestionnaireStock(policeId).subscribe({
                next: q => { this.qStock = q; done(); }, error: done
            });
        } else {
            done();
        }
    }

    private loadVisites(policeId: number) {
        this.pevLoading = true;
        if (this.isBetail) {
            this.portal.getPevMarquage(policeId).subscribe({
                next: data => { this.pevs = data; this.pevLoading = false; },
                error: ()   => { this.pevLoading = false; }
            });
        } else if (this.isAviculture) {
            this.portal.getVisitesAviculture(policeId).subscribe({
                next: data => { this.visitesAviculture = data; this.pevLoading = false; },
                error: ()   => { this.pevLoading = false; }
            });
        } else if (this.isHorticulture) {
            this.portal.getVisitesHorticulture(policeId).subscribe({
                next: data => { this.visitesHort = data; this.pevLoading = false; },
                error: ()   => { this.pevLoading = false; }
            });
        } else {
            this.pevLoading = false;
        }
    }

    private loadPaiements(policeId: number) {
        this.paiementsLoading = true;
        this.portal.getPaiementsByPolice(policeId).subscribe({
            next: page => { this.paiements = page.content; this.paiementsLoading = false; },
            error: ()  => { this.paiementsLoading = false; }
        });
    }

    private loadAvenants(policeId: number) {
        this.avenantLoading = true;
        this.portal.getAvenants(policeId).subscribe({
            next: list => { this.avenants = list; this.avenantLoading = false; },
            error: ()   => { this.avenantLoading = false; }
        });
    }

    private loadDocuments() {
        const product = this.police?.produit?.code;
        if (!product) return;
        const category   = this.docCategoryCode(product);
        this.docLoading  = true;
        this.portal.getDocumentModules(product, category).subscribe({
            next: docs => { this.documents = docs; this.docLoading = false; },
            error: ()   => { this.docLoading = false; }
        });
    }

    /** Mappe le code produit vers le code catégorie document du backend */
    private docCategoryCode(productCode: string): string | undefined {
        const c = (productCode || '').toUpperCase();
        if (c.includes('AVI'))                          return 'DOC_AVICULTURE';
        if (c.includes('BET') || c.includes('CHEP'))   return 'DOC_BETAIL';
        if (c.includes('RECOL'))                        return 'DOC_RECOLTE';
        if (c.includes('HORT'))                        return 'DOC_RECOLTE';   // horticulture partage la catégorie récolte si pas de catégorie propre
        if (c.includes('INDIC'))                        return 'DOC_INDICIELLE';
        if (c.includes('STOCK'))                        return 'DOC_STOCK';
        if (c.includes('EQUIP'))                        return 'ÉQUIPEMENT_DOC';
        if (c.includes('ARBOR'))                        return 'DOC_ARBORICULTURE';
        return undefined;   // pas de filtre catégorie ? renvoie tous les docs du produit
    }

    /**
     * Parse un champ commentaire formaté "Q1 : texte Q2 : texte ..."
     * Retourne un tableau de `count` éléments (index 0 = Q1).
     */
    private parseQComments(commentaire: string | undefined, count: number): string[] {
        const result: string[] = Array(count).fill('');
        if (!commentaire) return result;
        for (let i = 1; i <= count; i++) {
            const next = i < count ? `Q${i + 1}` : '$';
            const pattern = new RegExp(`Q${i}\\s*:\\s*(.+?)(?=\\s*Q${i + 1}\\s*:|$)`, 'is');
            const m = commentaire.match(pattern);
            result[i - 1] = m?.[1]?.trim() ?? '';
        }
        return result;
    }

    /** Nom du client : raison sociale OU prénom + nom */
    clientNom(): string {
        const c = this.police?.client;
        if (!c) return '—';
        return c.raisonSociale || `${c.prenom ?? ''} ${c.nom ?? ''}`.trim() || '—';
    }

    /**
     * Détecte si le client est un Opérateur / Groupement.
     * Critères : raisonSociale renseignée sur la police OU clientRaisonSociale dans la session.
     */
    isOperateur(): boolean {
        return !!(this.police?.client?.raisonSociale || this.auth.user()?.clientRaisonSociale);
    }

    /**
     * Retourne la liste des membres selon le produit de la police.
     * Les membres sont inclus dans les sous-entités produit du DTO Police.
     */
    membres(): any[] {
        if (this.isAviculture)   return this.police?.aviculture?.membres  ?? [];
        if (this.isBetail)       return this.police?.betail?.membres       ?? [];
        if (this.isRecolte)      return this.police?.recolte?.membres      ?? [];
        if (this.isHorticulture) return this.police?.horticulture?.membres ?? [];
        if (this.isEquipement)   return this.police?.equipement?.membres   ?? [];
        return [];
    }

    readonly apiUrl = environment.apiUrl;

    documentUrl(type: string, id: number, format: 'pdf' | 'word' = 'pdf'): string {
        return `${this.apiUrl}/documents/${type}/${id}/${format}`;
    }

    /** TypeDocument enum pour la police (ex: POLICE_AVICULTURE) selon le produit */
    policeDocType(): string {
        const c = (this.police?.produit?.code || '').toUpperCase();
        if (c.includes('AVI'))                        return 'POLICE_AVICULTURE';
        if (c.includes('BET') || c.includes('CHEP')) return 'POLICE_BETAIL';
        if (c.includes('RECOL'))                      return 'POLICE_RECOLTE';
        if (c.includes('HORT'))                       return 'POLICE_HORTICULTURE';
        if (c.includes('EQUIP'))                      return 'POLICE_EQUIPEMENT';
        if (c.includes('STOCK'))                      return 'POLICE_STOCK';
        if (c.includes('ARBOR'))                      return 'POLICE_ARBORICULTURE';
        if (c.includes('INDIC'))                      return 'POLICE_INDICIELLE';
        return 'POLICE_AVICULTURE';
    }

    /** Documents additionnels générés (questionnaire, attestation, annexe…) selon le produit */
    extraDocTypes(): Array<{ type: string; label: string; icon: string }> {
        const c = (this.police?.produit?.code || '').toUpperCase();
        const docs: Array<{ type: string; label: string; icon: string }> = [];
        if (c.includes('AVI')) {
            docs.push({ type: 'QUESTIONNAIRE_AVICULTURE', label: 'Questionnaire',  icon: 'fa-solid fa-clipboard-list' });
            docs.push({ type: 'ATTESTATION_AVICULTURE',  label: 'Attestation',     icon: 'fa-solid fa-certificate' });
            docs.push({ type: 'PROPOSITION_AVICULTURE',  label: 'Proposition',     icon: 'fa-solid fa-file-lines' });
        } else if (c.includes('BET') || c.includes('CHEP')) {
            docs.push({ type: 'QUESTIONNAIRE_BETAIL',    label: 'Questionnaire',   icon: 'fa-solid fa-clipboard-list' });
            docs.push({ type: 'ATTESTATION_BETAIL',      label: 'Attestation',     icon: 'fa-solid fa-certificate' });
            docs.push({ type: 'ANNEXE_BETAIL',           label: 'Annexe',          icon: 'fa-solid fa-paperclip' });
            docs.push({ type: 'PV_MARQUAGE_BETAIL',      label: 'PV de marquage',  icon: 'fa-solid fa-stamp' });
        } else if (c.includes('RECOL')) {
            docs.push({ type: 'QUESTIONNAIRE_RECOLTE',   label: 'Questionnaire',   icon: 'fa-solid fa-clipboard-list' });
            docs.push({ type: 'PROPOSITION_RECOLTE',     label: 'Proposition',     icon: 'fa-solid fa-file-lines' });
            docs.push({ type: 'ANNEXE_RECOLTE',          label: 'Annexe',          icon: 'fa-solid fa-paperclip' });
        } else if (c.includes('HORT')) {
            docs.push({ type: 'PROPOSITION_HORTICULTURE', label: 'Proposition',    icon: 'fa-solid fa-file-lines' });
        } else if (c.includes('EQUIP')) {
            docs.push({ type: 'QUESTIONNAIRE_EQUIPEMENT', label: 'Questionnaire',  icon: 'fa-solid fa-clipboard-list' });
            docs.push({ type: 'PROPOSITION_EQUIPEMENT',  label: 'Proposition',     icon: 'fa-solid fa-file-lines' });
        } else if (c.includes('STOCK')) {
            docs.push({ type: 'QUESTIONNAIRE_STOCK',     label: 'Questionnaire',   icon: 'fa-solid fa-clipboard-list' });
            docs.push({ type: 'PROPOSITION_STOCK',       label: 'Proposition',     icon: 'fa-solid fa-file-lines' });
        } else if (c.includes('ARBOR')) {
            docs.push({ type: 'PROPOSITION_ARBORICULTURE', label: 'Proposition',   icon: 'fa-solid fa-file-lines' });
        } else if (c.includes('INDIC')) {
            docs.push({ type: 'PROPOSITION_INDICIELLE',  label: 'Proposition',     icon: 'fa-solid fa-file-lines' });
            docs.push({ type: 'ANNEXE_INDICIELLE',       label: 'Annexe',          icon: 'fa-solid fa-paperclip' });
        }
        return docs;
    }

    montantAssure(p: Police): number {
        return p.betail?.valeurAssuree ?? p.aviculture?.prixUnitaire ?? p.recolte?.totalMontantAssure
            ?? p.horticulture?.valeurAssureeTotale ?? p.equipement?.montantAssureTotal
            ?? p.multirisques?.valeurAssuree ?? p.montantAssure ?? 0;
    }

    primeTotale(p: Police): number {
        return p.betail?.primeTotale ?? p.recolte?.totalPrimeNetteHT ?? p.equipement?.primeTotale
            ?? p.multirisques?.primeTotale ?? p.primeTotale ?? p.primeNette ?? 0;
    }

    totalVerse(): number {
        return this.paiements.reduce((s, p) => s + (p.montantPaye || 0), 0);
    }

    nbEncaisses(): number {
        return this.paiements.filter(p => p.encaisse).length;
    }

    isExpiringSoon(date: string): boolean {
        if (!date) return false;
        const diff = new Date(date).getTime() - Date.now();
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
    }

    statutLabel(s: any): string {
        if (!s) return 'Brouillon';
        return s.description || s.libelle || s.name || s || 'Brouillon';
    }
    statutBg(s: any): string {
        const n = (s?.name || s || '').toUpperCase();
        if (n === 'VALIDER' || n === 'ACTIF')   return '#e8f4ec';
        if (n === 'REFUSER' || n === 'RESILIE') return '#ffe0e0';
        if (n === 'SUSPENDRE')                  return '#fff3cd';
        return '#f0f0f0';
    }
    statutColor(s: any): string {
        const n = (s?.name || s || '').toUpperCase();
        if (n === 'VALIDER' || n === 'ACTIF')   return '#538F6C';
        if (n === 'REFUSER' || n === 'RESILIE') return '#c0392b';
        if (n === 'SUSPENDRE')                  return '#856404';
        return '#666';
    }
    paiStatutLabel(s: any): string {
        if (!s) return '—';
        return s.description || s.name || String(s);
    }
    modeLabel(m: any): string {
        if (!m) return '—';
        if (typeof m === 'string') return m;
        return m.description || m.libelle || m.name || String(m);
    }
    paiStatutBg(s: any): string {
        const n = (s?.name || s || '').toUpperCase();
        if (n === 'ENCAISSE' || n === 'VALIDE') return '#e8f4ec';
        if (n === 'ANNULE'  || n === 'ECHOUE') return '#ffe0e0';
        if (n === 'EN_ATTENTE')                return '#fff3cd';
        return '#f0f0f0';
    }
    paiStatutColor(s: any): string {
        const n = (s?.name || s || '').toUpperCase();
        if (n === 'ENCAISSE' || n === 'VALIDE') return '#538F6C';
        if (n === 'ANNULE'  || n === 'ECHOUE') return '#c0392b';
        if (n === 'EN_ATTENTE')                return '#856404';
        return '#666';
    }
    getProductIcon(code?: string): string {
        const c = (code || '').toLowerCase();
        if (c.includes('bet') || c.includes('chep') || c.includes('bovin')) return 'fa-solid fa-cow';
        if (c.includes('avi') || c.includes('vol'))  return 'fa-solid fa-egg';
        if (c.includes('recol') || c.includes('cereal')) return 'fa-solid fa-wheat-awn';
        if (c.includes('hort') || c.includes('marai')) return 'fa-solid fa-seedling';
        if (c.includes('equip') || c.includes('mater')) return 'fa-solid fa-tractor';
        if (c.includes('indic')) return 'fa-solid fa-satellite-dish';
        return 'fa-solid fa-shield-halved';
    }

    /* -- Modal PDF viewer -------------------------------- */
    pdfModal: {
        open: boolean; title: string; url: string;
        blobUrl: string; safeUrl: SafeResourceUrl | null;
        loading: boolean; error: boolean; errorMsg: string;
    } = { open: false, title: '', url: '', blobUrl: '', safeUrl: null, loading: false, error: false, errorMsg: '' };

    /** Ouvre le document dans le modal via fetch natif + Authorization header */
    openDoc(url: string, title: string): void {
        this.pdfModal = { open: true, title, url, blobUrl: '', safeUrl: null, loading: true, error: false, errorMsg: '' };
        document.body.style.overflow = 'hidden';

        const token = this.auth.accessToken;
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error(`Erreur ${res.status} — ${res.statusText}`);
                return res.blob();
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                this.pdfModal = { ...this.pdfModal, blobUrl, safeUrl, loading: false };
            })
            .catch((err: Error) => {
                console.error('[PDF Modal]', url, err);
                this.pdfModal = { ...this.pdfModal, loading: false, error: true, errorMsg: err.message };
            });
    }

    /** Télécharge le document directement */
    downloadDoc(url: string, filename: string): void {
        const token = this.auth.accessToken;
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                return res.blob();
            })
            .then(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 5000);
            })
            .catch(err => console.error('[Download]', err));
    }

    closeDoc(): void {
        if (this.pdfModal.blobUrl) URL.revokeObjectURL(this.pdfModal.blobUrl);
        this.pdfModal = { open: false, title: '', url: '', blobUrl: '', safeUrl: null, loading: false, error: false, errorMsg: '' };
        document.body.style.overflow = '';
    }

    ngOnDestroy(): void {
        if (this.pdfModal?.blobUrl) URL.revokeObjectURL(this.pdfModal.blobUrl);
        document.body.style.overflow = '';
    }
}
