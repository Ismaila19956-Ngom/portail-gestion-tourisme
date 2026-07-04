import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ClientPortalService } from '../../../services/client-portal.service';
import { pageInfo } from '../../../models/client-portal.models';
import { Subscription } from 'rxjs';

interface PoliceRow {
    id:            number;
    slug:          string;
    num:           number;
    numeroPolice:  string;
    localisation:  string;
    produitNom:    string;
    produitIcon:   string;
    gradientFrom:  string;
    gradientTo:    string;
    dateEffet:     string;
    duree:         number | undefined;
    dateEcheance:  string;
    expiringSoon:  boolean;
    montantAssure: number;
    primeTotale:   number;
    montantEtat:   number | undefined;
    agenceNom:     string;
    agenceZone:    string;
    statutLabel:   string;
    statutBg:      string;
    statutColor:   string;
    statutDot:     string;
    active:        boolean;
}

const PAGE_SIZE = 8;

const GRADIENTS: [string, string][] = [
    ['#538F6C','#3d7554'],
    ['#4a8060','#375f48'],
    ['#5c9a74','#447a5a'],
    ['#3d7554','#2d5940'],
    ['#4e8a6a','#3a6b50'],
    ['#628f73','#4a7059'],
];

@Component({
    selector: 'app-polices',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="pg">

        <!-- ══ ERREUR ══ -->
        <div *ngIf="loadError && !loading" class="err-box">
            <i class="fa-solid fa-circle-exclamation" style="color:#e53935;font-size:1.2rem;flex-shrink:0;margin-top:2px;"></i>
            <div style="flex:1;">
                <div style="font-weight:800;color:#b71c1c;font-size:0.88rem;margin-bottom:4px;">Erreur de chargement</div>
                <div style="color:#c62828;font-size:0.82rem;">{{ loadError }}</div>
                <button (click)="loadPage(currentPage)" class="retry-btn">
                    <i class="fa-solid fa-rotate-right"></i> R�essayer
                </button>
            </div>
        </div>

        <!-- ══ EN-TÊTE ══ -->
        <div class="pg-header">
            <div>
                <h2 class="pg-title">
                    <i class="fa-solid fa-file-contract" style="color:#556B2F;"></i>
                    Mes Polices d'assurance
                </h2>
                <p class="pg-sub">Retrouvez l'ensemble de vos contrats d'assurance touristique Sénégal Excursions</p>
            </div>
            <div class="stats-row">
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-file-contract" style="color:#556B2F;font-size:0.75rem;"></i></div>
                    <div><div class="stat-val">{{ total }}</div><div class="stat-lbl">Police(s)</div></div>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-layer-group" style="color:#556B2F;font-size:0.75rem;"></i></div>
                    <div><div class="stat-val">{{ nbProduits }}</div><div class="stat-lbl">Produit(s)</div></div>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-circle-check" style="color:#27ae60;font-size:0.75rem;"></i></div>
                    <div><div class="stat-val">{{ totalActives }}</div><div class="stat-lbl">Active(s)</div></div>
                </div>
            </div>
        </div>

        <!-- ══ SPINNER ══ -->
        <div *ngIf="loading" class="spin-box">
            <div class="spinner"></div>
            <p style="color:#556B2F;font-weight:600;font-size:0.9rem;">Chargement de vos polices...</p>
        </div>

        <!-- ══ VIDE ══ -->
        <div *ngIf="!loading && !loadError && !featuredRow" class="empty-box">
            <div class="empty-icon"><i class="fa-solid fa-file-slash" style="font-size:2.2rem;color:#c8e6c9;"></i></div>
            <h4 style="color:#3E4F22;font-weight:800;margin-bottom:8px;">Aucune police trouv�e</h4>
            <p style="color:#aaa;font-size:0.88rem;margin:0;">Vous n'avez pas encore souscrit de police d'assurance.</p>
        </div>

        <ng-container *ngIf="!loading && !loadError && featuredRow">

            <!-- ══ POLICE LA PLUS R�CENTE ══ -->
            <div class="section featured-section">
                <div class="section-head">
                    <div class="section-title">
                        <span class="pulse-dot"></span>
                        Police la plus r�cente
                        <span class="recent-tag">Derni�re souscription</span>
                    </div>
                    <div class="section-title" style="gap:6px;font-size:0.75rem;font-weight:600;color:#aaa;">
                        <i class="fa-solid fa-arrow-down-wide-short" style="font-size:0.7rem;"></i>
                        Tri�es par date d'effet
                    </div>
                </div>

                <!-- Carte vedette gradient -->
                <div class="featured-card">
                    <div class="fc-orb fc-orb-1"></div>
                    <div class="fc-orb fc-orb-2"></div>

                    <div *ngIf="featuredRow.expiringSoon" class="expiry-badge">
                        <i class="fa-solid fa-triangle-exclamation"></i> Expire bient�t
                    </div>

                    <!-- Haut -->
                    <div class="fc-top">
                        <div class="fc-icon-wrap">
                            <div class="fc-icon"><i [class]="featuredRow.produitIcon"></i></div>
                            <div>
                                <div class="fc-num">{{ featuredRow.numeroPolice }}</div>
                                <div class="fc-sub-prod">{{ featuredRow.produitNom }}</div>
                            </div>
                        </div>
                        <span class="fc-statut"
                              [style.background]="featuredRow.statutBg"
                              [style.color]="featuredRow.statutColor">
                            <span class="dot-s" [style.background]="featuredRow.statutDot"></span>
                            {{ featuredRow.statutLabel }}
                        </span>
                    </div>

                    <!-- Grille infos -->
                    <div class="fc-grid">
                        <div class="fc-cell">
                            <div class="fc-lbl">Date d'effet</div>
                            <div class="fc-val">{{ featuredRow.dateEffet | date:'dd MMMM yyyy' }}</div>
                            <div *ngIf="featuredRow.duree" class="fc-sub">{{ featuredRow.duree }} mois</div>
                        </div>
                        <div class="fc-cell">
                            <div class="fc-lbl">échéance</div>
                            <div class="fc-val" [style.color]="featuredRow.expiringSoon ? '#FF8C42' : '#fff'">
                                {{ featuredRow.dateEcheance | date:'dd MMMM yyyy' }}
                            </div>
                            <div *ngIf="featuredRow.expiringSoon" class="fc-sub" style="color:#FF8C42;">⚠ Expire bient�t</div>
                        </div>
                        <div class="fc-cell">
                            <div class="fc-lbl">Capital assur�</div>
                            <div class="fc-val">{{ featuredRow.montantAssure | number:'1.0-0' }} <small>FCFA</small></div>
                        </div>
                        <div class="fc-cell">
                            <div class="fc-lbl">Prime TTC</div>
                            <div class="fc-val prime-val">{{ featuredRow.primeTotale | number:'1.0-0' }} <small>FCFA</small></div>
                            <div *ngIf="featuredRow.montantEtat" class="fc-sub">
                                <span class="etat-badge">−{{ featuredRow.montantEtat | number:'1.0-0' }} �tat</span>
                            </div>
                        </div>
                        <div class="fc-cell" *ngIf="featuredRow.agenceNom">
                            <div class="fc-lbl">Agence</div>
                            <div class="fc-val">{{ featuredRow.agenceNom }}</div>
                            <div *ngIf="featuredRow.agenceZone" class="fc-sub">{{ featuredRow.agenceZone }}</div>
                        </div>
                        <div class="fc-cell" *ngIf="featuredRow.localisation">
                            <div class="fc-lbl">Localisation</div>
                            <div class="fc-val">
                                <i class="fa-solid fa-location-pin" style="color:#FF8C42;margin-right:4px;"></i>
                                {{ featuredRow.localisation }}
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="fc-footer">
                        <a [routerLink]="['/mon-espace/polices', featuredRow.slug]" class="fc-btn">
                            Consulter le d�tail <i class="fa-solid fa-arrow-right"></i>
                        </a>
                        <div class="fc-star-badge">
                            <i class="fa-solid fa-star"></i> Plus r�cente
                        </div>
                    </div>
                </div>
            </div>

            <!-- ══ HISTORIQUE ══ -->
            <div class="section" *ngIf="historyRows.length > 0">
                <div class="section-head">
                    <div class="section-title">
                        <span class="section-dot"></span>
                        Historique des polices
                        <span class="count-badge">{{ historyRows.length }}</span>
                    </div>
                    <span style="font-size:0.75rem;color:#aaa;">Page {{ currentPage + 1 }} / {{ totalPages }}</span>
                </div>

                <div class="hist-table">
                    <div class="hist-head">
                        <span>N� Police</span>
                        <span>Produit</span>
                        <span>Date effet</span>
                        <span>échéance</span>
                        <span class="col-r">Capital</span>
                        <span class="col-r">Prime TTC</span>
                        <span class="col-c">Statut</span>
                        <span></span>
                    </div>
                    <div *ngFor="let r of historyRows; let even=even; let i=index"
                         class="hist-row" [class.hist-even]="even">

                        <!-- N� Police -->
                        <div class="hist-num">
                            <div class="hist-icon" [style.background]="r.gradientFrom + '22'">
                                <i [class]="r.produitIcon" style="font-size:0.6rem;" [style.color]="r.gradientFrom"></i>
                            </div>
                            <div>
                                <div class="hist-num-text">{{ r.numeroPolice }}</div>
                                <div *ngIf="r.localisation" class="hist-meta">
                                    <i class="fa-solid fa-location-pin" style="color:#e74c3c;font-size:0.55rem;"></i>
                                    {{ r.localisation }}
                                </div>
                            </div>
                        </div>

                    
                
                        <!-- --Produit -->
                        <div style="min-width: 0;">
                            <span class="prod-badge"
                                  [style.background]="r.gradientFrom + '15'"
                                  [style.color]="r.gradientFrom"
                                  [style.border]="'1px solid ' + r.gradientFrom + '40'">
                                {{ r.produitNom }}
                                
                            </span>
                        </div>

                        <!-- Date effet -->
                        <div>
                            <div class="hist-date">{{ r.dateEffet | date:'dd/MM/yyyy' }}</div>
                            <div *ngIf="r.duree" class="hist-meta">{{ r.duree }} jours</div>
                        </div>

                        <!-- échéance -->
                        <div>
                            <div class="hist-date" [style.color]="r.expiringSoon ? '#e67e22' : '#666'"
                                 [style.font-weight]="r.expiringSoon ? '700' : '400'">
                                <i *ngIf="r.expiringSoon" class="fa-solid fa-triangle-exclamation" style="font-size:0.65rem;"></i>
                                {{ r.dateEcheance | date:'dd/MM/yyyy' }}
                            </div>
                        </div>

                        <!-- Capital -->
                        <div class="col-r" style="display: flex; flex-direction: column; align-items: flex-end;">
                            <div>
                                <span class="hist-amount">{{ r.montantAssure | number:'1.0-0' }}</span>
                                <span class="hist-meta" style="margin-left: 4px; font-size: 0.6rem;">FCFA</span>
                            </div>
                        </div>

                        <!-- Prime TTC -->
                        <div class="col-r" style="display: flex; flex-direction: column; align-items: flex-end;">
                            <div>
                                <span class="hist-prime">{{ r.primeTotale | number:'1.0-0' }}</span>
                                <span class="hist-meta" style="margin-left: 4px; font-size: 0.6rem;">FCFA</span>
                            </div>
                        </div>

                        <!-- Statut -->
                        <div class="col-c">
                            <span class="hist-badge"
                                  [style.background]="r.statutDot + '15'"
                                  [style.color]="r.statutDot"
                                  [style.border]="'1px solid ' + r.statutDot + '40'">
                                <span class="dot-s" [style.background]="r.statutDot"></span>
                                {{ r.statutLabel }}
                            </span>
                        </div>

                        <!-- Action -->
                        <div class="col-c" style="display: flex; justify-content: flex-end;">
                            <a [routerLink]="['/mon-espace/polices', r.slug]"
                               class="eye-btn" title="Consulter">
                                <i class="fa-solid fa-chevron-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </ng-container>

        <!-- ══ PAGINATION ══ -->
        <div *ngIf="!loadError && totalPages > 1" class="pag-row">
            <button (click)="loadPage(currentPage - 1)" [disabled]="currentPage === 0" class="pag-btn">
                <i class="fa-solid fa-chevron-left"></i> Pr�c�dent
            </button>
            <span class="pag-cur">{{ currentPage + 1 }} / {{ totalPages }}</span>
            <button (click)="loadPage(currentPage + 1)" [disabled]="currentPage === totalPages - 1" class="pag-btn">
                Suivant <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>

    </div>

    <style>
    .pg { display:flex;flex-direction:column;gap:20px; }

    /* Header */
    .pg-header { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px; }
    .pg-title { color:#3E4F22;font-size:0.95rem;font-weight:900;margin:0 0 3px;display:flex;align-items:center;gap:8px; }
    .pg-sub { color:#bbb;font-size:0.74rem;margin:0; }
    .stats-row { display:flex;gap:6px;flex-wrap:wrap; }
    .stat-chip { background:#fff;border:1px solid #d1d1d1;border-radius:10px;padding:6px 12px;display:flex;align-items:center;gap:7px; }
    .stat-icon { width:22px;height:22px;background:#eef5f1;border-radius:6px;display:flex;align-items:center;justify-content:center; }
    .stat-val { font-size:0.85rem;font-weight:900;color:#3E4F22;line-height:1; }
    .stat-lbl { font-size:0.58rem;color:#aaa;font-weight:700;text-transform:uppercase; }

    /* Error */
    .err-box { background:#fff3f3;border:1px solid #ffcdd2;border-radius:14px;padding:20px 24px;display:flex;align-items:flex-start;gap:14px; }
    .retry-btn { margin-top:10px;background:#e53935;color:#fff;border:none;padding:7px 16px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px; }

    /* Spinner */
    .spin-box { text-align:center;padding:90px 0; }
    .spinner { width:48px;height:48px;border:4px solid #e8f4ec;border-top-color:#556B2F;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 18px; }
    @keyframes spin { to { transform:rotate(360deg); } }

    /* Empty */
    .empty-box { background:#fff;border-radius:18px;padding:72px 40px;text-align:center;border:1px solid #e8f4ec; }
    .empty-icon { width:76px;height:76px;background:#f0faf4;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px; }

    /* Section */
    .section { background:#fff;border-radius:14px;padding:16px 18px;border:1px solid #edf5ef;box-shadow:0 2px 12px rgba(85,107,47,0.04); }
    .featured-section { border-color:#c8e6d0; }
    .section-head { display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px; }
    .section-title { display:flex;align-items:center;gap:7px;font-weight:800;color:#3E4F22;font-size:0.82rem; }

    /* Pulse dot */
    .pulse-dot { width:8px;height:8px;border-radius:50%;background:#27ae60;flex-shrink:0;box-shadow:0 0 0 0 rgba(39,174,96,0.4);animation:pulse 2s infinite; }
    @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(39,174,96,0.5)} 70%{box-shadow:0 0 0 6px rgba(39,174,96,0)} 100%{box-shadow:0 0 0 0 rgba(39,174,96,0)} }
    .recent-tag { font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(39,174,96,0.12);color:#1a7a42;border:1px solid rgba(39,174,96,0.2); }

    .section-dot { width:7px;height:7px;border-radius:50%;background:#bbb;flex-shrink:0; }
    .count-badge { font-size:0.62rem;font-weight:800;padding:1px 7px;border-radius:20px;background:#f0f0f0;color:#999; }

    /* ── Featured card — gradient ── */
    .featured-card {
        background: linear-gradient(135deg,#538F6C 0%,#3d7554 100%);
        border-radius:14px; padding:14px 20px;
        position:relative; overflow:hidden;
        box-shadow:0 4px 20px rgba(61,117,84,0.25);
        display:flex; flex-direction:column; gap:10px;
    }
    .fc-orb { position:absolute;border-radius:50%;opacity:0.08;pointer-events:none; }
    .fc-orb-1 { width:200px;height:200px;background:#fff;top:-70px;right:40px; }
    .fc-orb-2 { width:120px;height:120px;background:#fff;bottom:-50px;right:-20px; }
    .expiry-badge { position:absolute;top:10px;right:10px;background:rgba(255,140,66,0.2);color:#FF8C42;font-size:0.58rem;font-weight:800;padding:3px 8px;border-radius:20px;border:1px solid rgba(255,140,66,0.35);display:flex;align-items:center;gap:3px; }
    .fc-top { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;position:relative;z-index:1; }
    .fc-icon-wrap { display:flex;align-items:center;gap:10px; }
    .fc-icon { width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:0.95rem;color:#fff;flex-shrink:0; }
    .fc-num { font-family:monospace;font-size:0.92rem;font-weight:900;color:#fff;letter-spacing:0.3px;line-height:1.1; }
    .fc-sub-prod { color:rgba(255,255,255,0.6);font-size:0.67rem;font-weight:600;margin-top:1px; }
    .fc-statut { font-size:0.6rem;font-weight:800;padding:4px 10px;border-radius:20px;text-transform:uppercase;display:flex;align-items:center;gap:4px;flex-shrink:0; }
    .dot-s { width:5px;height:5px;border-radius:50%;flex-shrink:0;display:inline-block; }

    .fc-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));background:rgba(255,255,255,0.1);border-radius:10px;border:1px solid rgba(255,255,255,0.15);overflow:hidden;position:relative;z-index:1; }
    .fc-cell { padding:9px 14px;border-right:1px solid rgba(255,255,255,0.12);display:flex;flex-direction:column;gap:3px; }
    .fc-cell:last-child { border-right:none; }
    .fc-lbl { color:rgba(255,255,255,0.5);font-size:0.55rem;font-weight:800;text-transform:uppercase;letter-spacing:0.7px; }
    .fc-val { color:#fff;font-size:0.8rem;font-weight:800; }
    .fc-val small { font-size:0.55rem;opacity:0.65;font-weight:600; }
    .fc-sub { color:rgba(255,255,255,0.5);font-size:0.6rem; }
    .prime-val { color:#F1B53B !important;font-size:0.86rem !important; }
    .etat-badge { background:rgba(255,255,255,0.15);color:#fff;font-size:0.57rem;font-weight:700;padding:1px 5px;border-radius:5px; }

    .fc-footer { display:flex;align-items:center;gap:8px;position:relative;z-index:1;flex-wrap:wrap; }
    .fc-btn { display:inline-flex;align-items:center;gap:6px;background:#fff;color:#3d7554;padding:7px 16px;border-radius:8px;font-size:0.74rem;font-weight:800;text-decoration:none;transition:all 0.2s;box-shadow:0 2px 10px rgba(0,0,0,0.1); }
    .fc-btn:hover { background:#f0faf4;transform:translateY(-1px); }
    .fc-star-badge { display:inline-flex;align-items:center;gap:5px;background:rgba(241,181,59,0.2);color:#F1B53B;padding:6px 12px;border-radius:8px;font-size:0.68rem;font-weight:800;border:1px solid rgba(241,181,59,0.35); }

    /* ── Historique table ── */
    .hist-table { display:flex;flex-direction:column;gap:4px; }
    .hist-head {
        display:grid; grid-template-columns: 2.2fr 1.6fr 1.1fr 1.1fr 1fr 1fr 1.2fr 0.4fr;
        padding:12px 16px; background:#e8f4ec; border-radius:10px;
        font-size:0.65rem; font-weight:800; color:#556B2F; text-transform:uppercase; letter-spacing:0.7px; align-items:center; gap:12px;
    }
    .hist-row {
        display:grid; grid-template-columns: 2.2fr 1.6fr 1.1fr 1.1fr 1fr 1fr 1.2fr 0.4fr;
        padding:14px 16px; border-radius:10px; align-items:center; gap:12px;
        transition:all 0.2s ease; border: 1px solid #f0f5f2; background: #fff;
    }
    .hist-row:hover { background:#f9fdfa; border-color: #d0e9d8; box-shadow: 0 4px 12px rgba(85,107,47,0.04); transform: translateY(-1px); }
    .hist-even { background:#fcfdfe; }
    
    .hist-num { display:flex;align-items:center;gap:10px; min-width: 0; }
    .hist-icon { width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .hist-num-text { font-family:monospace;font-size:0.85rem;font-weight:700;color:#3E4F22; word-break: break-all; line-height: 1.2; }
    .hist-meta { color:#888;font-size:0.65rem;margin-top:2px; display: inline-block; }
    
    .hist-produit { font-size:0.75rem;color:#444;font-weight:600; line-height: 1.3; min-width: 0; }
    .prod-badge { font-size:0.65rem; font-weight:800; padding:4px 8px; border-radius:6px; display:inline-block; line-height:1.3; word-break:break-word; }
    .hist-date { font-size:0.8rem;color:#555; font-weight: 500; }
    
    .hist-amount { font-size:0.85rem;font-weight:800;color:#3E4F22; }
    .hist-prime { font-size:0.88rem;font-weight:900;color:#556B2F; }
    
    .col-r { text-align:right; }
    .col-c { text-align:center; }
    
    .hist-badge { font-size:0.6rem;font-weight:800;padding:4px 10px;border-radius:20px;text-transform:uppercase;display:inline-flex;align-items:center;gap:4px;white-space:nowrap; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
    
    .eye-btn { width:36px;height:36px;border-radius:10px;background:#eef5f1;display:inline-flex;align-items:center;justify-content:center;color:#556B2F;text-decoration:none;font-size:0.9rem;transition:all 0.2s ease; border: 1px solid #d0e9d8; }
    .eye-btn:hover { background:#556B2F;color:#fff; border-color: #556B2F; transform: scale(1.05); box-shadow: 0 4px 10px rgba(85,107,47,0.15); }

    /* Pagination */
    .pag-row { display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap; }
    .pag-btn { border:1px solid #e8f4ec;background:#fff;padding:8px 16px;border-radius:10px;font-size:0.82rem;font-weight:700;cursor:pointer;color:#556B2F;display:flex;align-items:center;gap:5px;transition:all 0.18s; }
    .pag-btn:hover:not(:disabled) { background:#556B2F;color:#fff;border-color:#556B2F; }
    .pag-btn:disabled { opacity:0.4;cursor:not-allowed; }
    .pag-cur { background:#e8f4ec;color:#556B2F;font-size:0.82rem;font-weight:800;padding:7px 16px;border-radius:10px; }

    /* ── Responsive ── */
    @media (max-width:992px) {
        .hist-table { overflow-x:auto; padding-bottom: 8px; }
        .hist-head, .hist-row { min-width:800px; }
    }
    
    @media (max-width:768px) {
        .pg-header { flex-direction:column;align-items:flex-start;gap:10px; }
        .stats-row { overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;width:100%; }
        .stat-chip { flex-shrink:0; }

        .section { padding:12px 12px; }
        .section-head { flex-direction:column;align-items:flex-start;gap:4px; }

        /* Carte vedette */
        .featured-card { padding:14px 14px; }
        .fc-grid { grid-template-columns:1fr 1fr; }
        .fc-cell { border-right:none;border-bottom:1px solid rgba(255,255,255,0.1); }
        .fc-cell:last-child { border-bottom:none; }
        .fc-btn { font-size:0.75rem;padding:8px 14px; }
    }

    @media (max-width:480px) {
        .pg-title { font-size:0.88rem; }
        .featured-card { padding:12px; }
        .fc-grid { grid-template-columns:1fr; }
        .fc-cell { border-bottom:1px solid rgba(255,255,255,0.1); }
        .fc-num { font-size:0.82rem; }
        .fc-sub-prod { font-size:0.62rem; }
        .fc-val { font-size:0.76rem; }
        .fc-lbl { font-size:0.52rem; }
        .fc-btn { width:100%;justify-content:center; }
        .pag-btn { padding:6px 10px;font-size:0.74rem; }
        .empty-box { padding: 24px 16px !important; }
        .fc-cell { padding: 6px 8px !important; }
    }
    </style>
    `,
})
export class PolicesComponent implements OnInit, OnDestroy {

    featuredRow:  PoliceRow | null = null;
    historyRows:  PoliceRow[]      = [];
    loading       = true;
    loadError     = '';
    total         = 0;
    totalActives  = 0;
    nbProduits    = 0;
    totalPages    = 0;
    currentPage   = 0;

    private _sub:         Subscription | null = null;
    private _safetyTimer: any                 = null;

    constructor(
        private auth:   AuthService,
        private portal: ClientPortalService,
        private cdr:    ChangeDetectorRef,
        private zone:   NgZone,
    ) {}

    ngOnInit()    { this.loadPage(0); }
    ngOnDestroy() {
        this._sub?.unsubscribe();
        if (this._safetyTimer) clearTimeout(this._safetyTimer);
    }

    loadPage(page: number) {
        this._sub?.unsubscribe();
        if (this._safetyTimer) clearTimeout(this._safetyTimer);

        const clientId = this.auth.user()?.clientId;
        if (!clientId) {
            this.loading   = false;
            this.loadError = 'Session invalide : identifiant client introuvable.';
            this.cdr.detectChanges();
            return;
        }

        this.loading   = true;
        this.loadError = '';
        this.cdr.detectChanges();

        // Filet absolu 30 s
        this._safetyTimer = setTimeout(() => {
            this.zone.run(() => {
                if (this.loading) {
                    this.loading   = false;
                    this.loadError = 'Le serveur ne r�pond pas. R�essayez plus tard.';
                    this.cdr.detectChanges();
                }
            });
        }, 30_000);

        this._sub = this.portal.getPolices(clientId, page, PAGE_SIZE).subscribe({
            next: res => {
                clearTimeout(this._safetyTimer); this._safetyTimer = null;
                this.zone.run(() => {
                    try {
                        const pi      = pageInfo(res);
                        const polices = [...(res?.content ?? [])].sort((a, b) => {
                            // Trier par dateEffet DESC → la plus r�cente en premier
                            const da = a.dateEffet ? new Date(a.dateEffet).getTime() : 0;
                            const db = b.dateEffet ? new Date(b.dateEffet).getTime() : 0;
                            return db - da;
                        });

                        this.total        = pi.total;
                        this.totalPages   = pi.totalPages;
                        this.currentPage  = pi.page;
                        this.totalActives = polices.filter(p => {
                            const n = (p?.statut?.name || p?.statut || '').toUpperCase();
                            return n === 'VALIDER' || n === 'ACTIF' || n === 'EN_COURS';
                        }).length;
                        const prodCodes = new Set(polices.map(p => p.produit?.code || 'AUTRE'));
                        this.nbProduits = prodCodes.size;

                        const rows = polices.map((p, i) => this._toRow(p, i));
                        this.featuredRow = rows.length > 0 ? rows[0] : null;
                        this.historyRows = rows.slice(1);
                    } catch (e) {
                        console.error('[Polices] traitement r�ponse:', e);
                        this.featuredRow = null;
                        this.historyRows = [];
                    } finally {
                        this.loading = false;
                        this.cdr.detectChanges();
                    }
                });
            },
            error: err => {
                clearTimeout(this._safetyTimer); this._safetyTimer = null;
                this.zone.run(() => {
                    this.loading   = false;
                    this.loadError =
                        err?.name === 'TimeoutError'  ? 'D�lai d�pass� — le serveur est trop lent.' :
                        err?.status === 0             ? 'Impossible de contacter le serveur.' :
                        err?.status === 403           ? 'Accès refus� (403).' :
                        err?.status === 401           ? 'Session expir�e. Reconnectez-vous.' :
                        err?.status >= 500            ? `Erreur serveur (${err.status}).` :
                                                        `Erreur ${err?.status ?? 'r�seau'}.`;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    private _toRow(p: any, idx: number): PoliceRow {
        const [gFrom, gTo] = GRADIENTS[idx % GRADIENTS.length];
        const statut  = p.statut;
        const sN      = (statut?.name || statut || '').toUpperCase();
        const active  = sN === 'VALIDER' || sN === 'ACTIF' || sN === 'EN_COURS';
        const code    = p.produit?.code || '';
        const diff    = p.dateEcheance ? new Date(p.dateEcheance).getTime() - Date.now() : -1;

        const statutDot =
            active                                  ? '#4ade80' :
            sN === 'RESILIE' || sN === 'EXPIRE'     ? '#f87171' :
            sN === 'SUSPENDRE' || sN === 'SUSPENDU' ? '#fb923c' :
            '#94a3b8';

        return {
            id:            p.id,
            slug:          btoa(String(p.id)),
            num:           idx + 1,
            numeroPolice:  p.numeroPolice || '—',
            localisation:  p.localisationRisque || '',
            produitNom:    p.produit?.nom || '—',
            produitIcon:   this._icon(code),
            gradientFrom:  gFrom,
            gradientTo:    gTo,
            dateEffet:     p.dateEffet     || '',
            duree:         p.duree,
            dateEcheance:  p.dateEcheance  || '',
            expiringSoon:  diff > 0 && diff < 30 * 24 * 60 * 60 * 1000,
            montantAssure: p.circuit?.valeurAssuree ?? p.aventure?.prixUnitaire
                         ?? p.excursion?.totalMontantAssure ?? p.Culture?.valeurAssureeTotale
                         ?? p.equipement?.montantAssureTotal ?? p.multirisques?.valeurAssuree
                         ?? p.montantAssure ?? 0,
            primeTotale:   p.circuit?.primeTotale ?? p.excursion?.totalPrimeNetteHT
                         ?? p.equipement?.primeTotale ?? p.multirisques?.primeTotale
                         ?? p.primeTotale ?? p.primeNette ?? 0,
            montantEtat:   p.montantEtat,
            agenceNom:     p.agence?.nom           || '',
            agenceZone:    p.agence?.zone?.libelle || '',
            statutLabel:   statut?.description || statut?.libelle || statut?.name || String(statut || 'Brouillon'),
            statutBg:      active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)',
            statutColor:   active ? '#fff' : 'rgba(255,255,255,0.6)',
            statutDot,
            active,
        };
    }

    private _icon(code: string): string {
        const c = (code || '').toLowerCase();
        if (c.includes('bet') || c.includes('chep') || c.includes('bovin')) return 'fa-solid fa-cow';
        if (c.includes('avi') || c.includes('vol'))    return 'fa-solid fa-egg';
        if (c.includes('recol') || c.includes('cere')) return 'fa-solid fa-wheat-awn';
        if (c.includes('hort') || c.includes('marai')) return 'fa-solid fa-seedling';
        if (c.includes('equip') || c.includes('mate')) return 'fa-solid fa-tractor';
        if (c.includes('arbor'))                       return 'fa-solid fa-tree';
        if (c.includes('indic'))                       return 'fa-solid fa-satellite-dish';
        if (c.includes('stock'))                       return 'fa-solid fa-boxes-stacking';
        return 'fa-solid fa-shield-halved';
    }
}
