import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ClientPortalService } from '../../../services/client-portal.service';
import { Sinistre, pageInfo } from '../../../models/client-portal.models';

interface SinistreRow {
    id: number;
    numeroDossier: string;
    policeNum: string;
    produitNom: string;
    dateSurvenance: string;
    dateDeclaration: string;
    montantEvalue: number | null;
    statutLabel: string;
    statutDot: string;
    statutBg: string;
    statutColor: string;
}

@Component({
    selector: 'app-sinistres',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    template: `
    <div class="pg">

        <!-- ══ EN-TÊTE ══ -->
        <div class="pg-header">
            <div>
                <h2 class="pg-title">
                    <i class="fa-solid fa-triangle-exclamation" style="color:#e67e22;"></i>
                    Mes Sinistres
                </h2>
                <p class="pg-sub">Suivi de vos déclarations de sinistres locaux Sénégal Excursions</p>
            </div>
            <div class="stats-row">
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-triangle-exclamation" style="color:#e67e22;font-size:0.68rem;"></i></div>
                    <div><div class="stat-val">{{ total }}</div><div class="stat-lbl">Sinistre(s)</div></div>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-hourglass-half" style="color:#f0a500;font-size:0.68rem;"></i></div>
                    <div><div class="stat-val">{{ enCours }}</div><div class="stat-lbl">En cours</div></div>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-circle-check" style="color:#27ae60;font-size:0.68rem;"></i></div>
                    <div><div class="stat-val">{{ regles }}</div><div class="stat-lbl">R�gl�(s)</div></div>
                </div>
            </div>
        </div>

<!-- ══ SPINNER ══ -->
        <div *ngIf="loading" class="spin-box">
            <div class="spinner"></div>
        </div>

        <!-- ══ VIDE ══ -->
        <div *ngIf="!loading && !featuredRow" class="empty-box">
            <i class="fa-solid fa-check-circle" style="font-size:2rem;color:#27ae60;display:block;margin-bottom:10px;"></i>
            <p style="color:#3E4F22;font-weight:700;font-size:0.88rem;margin:0 0 4px;">Aucun sinistre d�clar�</p>
            <p style="color:#aaa;font-size:0.78rem;margin:0;">Continuez à prendre soin de votre exploitation !</p>
        </div>

        <ng-container *ngIf="!loading && featuredRow">

            <!-- ══ SINISTRE LE PLUS R�CENT ══ -->
            <div class="section">
                <div class="section-head">
                    <div class="section-title">
                        <span class="pulse-dot"></span>
                        Sinistre le plus r�cent
                        <span class="recent-tag">Derni�re déclaration</span>
                    </div>
                    <span class="sort-label"><i class="fa-solid fa-arrow-down-wide-short"></i> Tri�s par date de survenance</span>
                </div>

                <!-- Carte vedette gradient -->
                <div class="featured-card">
                    <div class="fc-orb fc-orb-1"></div>
                    <div class="fc-orb fc-orb-2"></div>

                    <div class="fc-top">
                        <div class="fc-icon-wrap">
                            <div class="fc-icon">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <div class="fc-num">{{ featuredRow.numeroDossier }}</div>
                                <div class="fc-sub-prod">
                                    <span>Police : {{ featuredRow.policeNum }}</span>
                                    <span style="margin:0 6px;opacity:0.6;">�</span>
                                    <span>{{ featuredRow.produitNom }}</span>
                                </div>
                            </div>
                        </div>
                        <span class="fc-statut"
                              [style.background]="featuredRow.statutBg"
                              [style.color]="featuredRow.statutColor">
                            <span class="dot-s" [style.background]="featuredRow.statutDot"></span>
                            {{ featuredRow.statutLabel }}
                        </span>
                    </div>

                    <div class="fc-grid">
                        <div class="fc-cell">
                            <div class="fc-lbl">Date de survenance</div>
                            <div class="fc-val">{{ featuredRow.dateSurvenance | date:'dd MMMM yyyy' }}</div>
                        </div>
                        <div class="fc-cell">
                            <div class="fc-lbl">Date de déclaration</div>
                            <div class="fc-val">{{ featuredRow.dateDeclaration | date:'dd MMMM yyyy' }}</div>
                        </div>
                        <div class="fc-cell" *ngIf="featuredRow.montantEvalue != null">
                            <div class="fc-lbl">Montant �valu�</div>
                            <div class="fc-val prime-val">{{ featuredRow.montantEvalue | number:'1.0-0' }} <small>FCFA</small></div>
                        </div>
                    </div>

                    <div class="fc-footer">
                        <span class="fc-star-badge"><i class="fa-solid fa-star"></i> Plus r�cent</span>
                    </div>
                </div>
            </div>

            <!-- ══ HISTORIQUE ══ -->
            <div class="section" *ngIf="historyRows.length > 0">
                <div class="section-head">
                    <div class="section-title">
                        <span class="section-dot"></span>
                        Historique des sinistres
                        <span class="count-badge">{{ historyRows.length }}</span>
                    </div>
                    <span class="sort-label">Page {{ currentPage + 1 }} / {{ totalPages }}</span>
                </div>

                <div class="hist-table">
                    <div class="hist-head">
                        <span>N� Dossier</span>
                        <span>Police</span>
                        <span>Produit</span>
                        <span>Survenance</span>
                        <span>Déclaration</span>
                        <span class="col-r">Montant �valu�</span>
                        <span class="col-c">Statut</span>
                    </div>
                    <div *ngFor="let r of historyRows; let even=even"
                         class="hist-row" [class.hist-even]="even">
                        <div class="hist-num-cell">
                            <div class="hist-icon">
                                <i class="fa-solid fa-triangle-exclamation" style="font-size:0.58rem;color:#e67e22;"></i>
                            </div>
                            <span class="hist-num-text">{{ r.numeroDossier }}</span>
                        </div>
                        <div class="hist-sec">{{ r.policeNum }}</div>
                        <div style="min-width: 0;">
                            <span class="prod-badge">
                                {{ r.produitNom }}
                            </span>
                        </div>
                        <div class="hist-date">{{ r.dateSurvenance | date:'dd/MM/yyyy' }}</div>
                        <div class="hist-date">{{ r.dateDeclaration | date:'dd/MM/yyyy' }}</div>
                        <div class="col-r">
                            <span *ngIf="r.montantEvalue != null" class="hist-amount">{{ r.montantEvalue | number:'1.0-0' }} <small>FCFA</small></span>
                            <span *ngIf="r.montantEvalue == null" style="color:#ccc;">—</span>
                        </div>
                        <div class="col-c">
                            <span class="hist-badge"
                                  [style.background]="r.statutBg"
                                  [style.color]="r.statutColor"
                                  [style.border]="'1px solid ' + r.statutDot + '44'">
                                <span class="dot-s" [style.background]="r.statutDot"></span>
                                {{ r.statutLabel }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </ng-container>

        <!-- ══ PAGINATION ══ -->
        <div *ngIf="totalPages > 1" class="pag-row">
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
    .pg { display:flex;flex-direction:column;gap:16px; }

    .pg-header { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px; }
    .pg-title { color:#1a1a1a;font-size:0.95rem;font-weight:900;margin:0 0 3px;display:flex;align-items:center;gap:8px; }
    .pg-sub { color:#bbb;font-size:0.74rem;margin:0; }

    .stats-row { display:flex;gap:6px;flex-wrap:wrap; }
    .stat-chip { background:#fff;border:1px solid #d1d1d1;border-radius:10px;padding:6px 12px;display:flex;align-items:center;gap:7px; }
    .stat-icon { width:22px;height:22px;background:#eef5f1;border-radius:6px;display:flex;align-items:center;justify-content:center; }
    .stat-val { font-size:0.85rem;font-weight:900;color:#1a1a1a;line-height:1; }
    .stat-lbl { font-size:0.58rem;color:#aaa;font-weight:700;text-transform:uppercase; }

.spin-box { text-align:center;padding:60px 0; }
    .spinner { width:36px;height:36px;border:3px solid #e8e8e8;border-top-color:#538F6C;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto; }
    @keyframes spin { to { transform:rotate(360deg); } }

    .empty-box { background:#fff;border-radius:14px;padding:48px;text-align:center;border:1px solid #d1d1d1; }

    /* Section */
    .section { background:#fff;border-radius:14px;padding:16px 18px;border:1px solid #d1d1d1;box-shadow:0 1px 6px rgba(0,0,0,0.04); }
    .section-head { display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px; }
    .section-title { display:flex;align-items:center;gap:7px;font-weight:800;color:#1a1a1a;font-size:0.82rem; }
    .sort-label { font-size:0.7rem;color:#bbb;display:flex;align-items:center;gap:4px; }

    .pulse-dot { width:8px;height:8px;border-radius:50%;background:#538F6C;flex-shrink:0;animation:pulse 2s infinite; }
    @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(83,143,108,0.4)} 70%{box-shadow:0 0 0 6px rgba(83,143,108,0)} 100%{box-shadow:0 0 0 0 rgba(83,143,108,0)} }
    .recent-tag { font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:20px;background:#eef5f1;color:#3d7554;border:1px solid #b8d9c6; }

    .section-dot { width:7px;height:7px;border-radius:50%;background:#d1d1d1;flex-shrink:0; }
    .count-badge { font-size:0.62rem;font-weight:800;padding:1px 7px;border-radius:20px;background:#eef5f1;color:#538F6C; }

    /* Featured card — gradient (mod�le polices) */
    .featured-card { background:linear-gradient(135deg,#538F6C 0%,#3d7554 100%);border-radius:14px;padding:14px 20px;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(61,117,84,0.25);display:flex;flex-direction:column;gap:10px; }
    .fc-orb { position:absolute;border-radius:50%;opacity:0.08;pointer-events:none; }
    .fc-orb-1 { width:200px;height:200px;background:#fff;top:-70px;right:40px; }
    .fc-orb-2 { width:120px;height:120px;background:#fff;bottom:-50px;right:-20px; }
    .fc-top { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px; }
    .fc-icon-wrap { display:flex;align-items:center;gap:10px; }
    .fc-icon { width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;color:#fff; }
    .fc-num { font-family:monospace;font-size:0.92rem;font-weight:900;color:#fff;line-height:1.1; }
    .fc-sub { color:rgba(255,255,255,0.6);font-size:0.67rem;margin-top:2px; }
    .fc-sub-prod { color:rgba(255,255,255,0.6);font-size:0.67rem; }
    .fc-statut { font-size:0.6rem;font-weight:800;padding:4px 10px;border-radius:20px;text-transform:uppercase;display:flex;align-items:center;gap:4px;flex-shrink:0; }
    .dot-s { width:5px;height:5px;border-radius:50%;flex-shrink:0;display:inline-block; }

    .fc-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));background:rgba(255,255,255,0.1);border-radius:10px;border:1px solid rgba(255,255,255,0.15);overflow:hidden; }
    .fc-cell { padding:10px 14px;border-right:1px solid rgba(255,255,255,0.12);display:flex;flex-direction:column;gap:4px; }
    .fc-cell:last-child { border-right:none; }
    .fc-lbl { color:rgba(255,255,255,0.5);font-size:0.55rem;font-weight:800;text-transform:uppercase;letter-spacing:0.7px; }
    .fc-val { color:#fff;font-size:0.82rem;font-weight:800; }
    .fc-val small { font-size:0.55rem;color:rgba(255,255,255,0.6);font-weight:600; }
    .prime-val { color:#F1B53B !important; }
    .accent-val { color:#F1B53B !important; }

    .fc-footer { display:flex;align-items:center;gap:8px; }
    .fc-star-badge { display:inline-flex;align-items:center;gap:5px;background:rgba(241,181,59,0.2);color:#F1B53B;padding:5px 12px;border-radius:8px;font-size:0.67rem;font-weight:800;border:1px solid rgba(241,181,59,0.35); }

    /* History table */
    .hist-table { display:flex;flex-direction:column;gap:0; }
    .hist-head { display:grid;grid-template-columns:2fr 1.5fr 1.8fr 1fr 1fr 1.2fr 1.2fr;padding:8px 12px;background:#538F6C;border-radius:8px;font-size:0.62rem;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:0.6px;align-items:center;margin-bottom:4px; }
    .hist-row { display:grid;grid-template-columns:2fr 1.5fr 1.8fr 1fr 1fr 1.2fr 1.2fr;padding:10px 12px;border-radius:8px;align-items:center;transition:background 0.15s;border-bottom:1px solid #f0f0f0; }
    .hist-row:last-child { border-bottom:none; }
    .hist-row:hover { background:#fafafa; }
    .hist-even { background:#f9f9f9; }
    .hist-num-cell { display:flex;align-items:center;gap:7px; }
    .hist-icon { width:24px;height:24px;border-radius:6px;background:#eef5f1;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .hist-num-text { font-family:monospace;font-size:0.78rem;font-weight:700;color:#1a1a1a; }
    .hist-sec { font-size:0.76rem;color:#666; }
    .hist-date { font-size:0.76rem;color:#888; }
    .hist-amount { font-size:0.78rem;font-weight:700;color:#538F6C; }
    .col-r { text-align:right; }
    .col-c { text-align:center; }
    .hist-badge { font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:20px;text-transform:uppercase;display:inline-flex;align-items:center;gap:3px;white-space:nowrap; }
    .prod-badge { font-size:0.65rem; font-weight:800; padding:4px 8px; border-radius:6px; display:inline-block; line-height:1.3; word-break:break-word; background: #eef5f1; color: #3d7554; border: 1px solid #d0e9d8; }

    .pag-row { display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap; }
    .pag-btn { border:1px solid #d1d1d1;background:#fff;padding:7px 14px;border-radius:9px;font-size:0.78rem;font-weight:700;cursor:pointer;color:#555;display:flex;align-items:center;gap:4px;transition:all 0.18s; }
    .pag-btn:hover:not(:disabled) { background:#538F6C;color:#fff;border-color:#538F6C; }
    .pag-btn:disabled { opacity:0.4;cursor:not-allowed; }
    .pag-cur { font-size:0.78rem;font-weight:800;padding:6px 14px;border-radius:9px;background:#f0f0f0;color:#555; }

    /* ── Responsive ── */
    @media (max-width:768px) {
        .pg-header { flex-direction:column;align-items:flex-start;gap:10px; }
        .stats-row { overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;width:100%; }
        .stat-chip { flex-shrink:0; }

        .section { padding:12px 12px; }
        .section-head { flex-direction:column;align-items:flex-start;gap:4px; }

        .featured-card { padding:14px 14px; }
        .fc-grid { grid-template-columns:1fr 1fr; }
        .fc-cell { border-right:none;border-bottom:1px solid rgba(255,255,255,0.1); }
        .fc-cell:last-child { border-bottom:none; }

        .hist-table { overflow-x:auto; }
        .hist-head { min-width:650px;grid-template-columns:2fr 1.2fr 1.5fr 1fr 1fr 1.2fr 1.2fr; }
        .hist-row  { min-width:650px;grid-template-columns:2fr 1.2fr 1.5fr 1fr 1fr 1.2fr 1.2fr; }

        .pag-btn { padding:6px 10px;font-size:0.74rem; }
    }

    @media (max-width:480px) {
        .pg-title { font-size:0.88rem; }
        .featured-card { padding:12px; }
        .fc-grid { grid-template-columns:1fr; }
        .fc-cell { border-bottom:1px solid rgba(255,255,255,0.1); }
        .fc-val { font-size:0.76rem; }
        .fc-btn { width:100%;justify-content:center; }
        .empty-box { padding: 24px 16px !important; }
    }
    </style>
    `,
})
export class SinistresComponent implements OnInit {

    featuredRow:  SinistreRow | null = null;
    historyRows:  SinistreRow[]      = [];
    loading     = true;
    total       = 0;
    enCours     = 0;
    regles      = 0;
    totalPages  = 0;
    currentPage = 0;

    constructor(
        private auth: AuthService,
        private portal: ClientPortalService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() { this.loadPage(0); }

    loadPage(page: number) {
        const clientId = this.auth.user()?.clientId;
        if (!clientId) { this.loading = false; return; }
        this.loading = true;
        this.cdr.markForCheck();
        this.portal.getPortalSinistres(clientId, page).subscribe({
            next: res => {
                const pageData = res?.page;
                const pi = pageInfo(pageData);
                const all = [...(pageData?.content ?? [])].sort((a, b) => {
                    const da = a.dateSurvenance  ? new Date(a.dateSurvenance).getTime()  : 0;
                    const db = b.dateSurvenance  ? new Date(b.dateSurvenance).getTime()  : 0;
                    return db - da;
                });
                
                this.total       = res?.total || 0;
                this.enCours     = res?.enCours || 0;
                this.regles      = res?.regles || 0;
                this.totalPages  = pi.totalPages;
                this.currentPage = pi.page;
                
                const rows = all.map(s => this._toRow(s));
                this.featuredRow = rows[0] ?? null;
                this.historyRows = rows.slice(1);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => { this.loading = false; this.cdr.markForCheck(); }
        });
    }

    private _toRow(s: any): SinistreRow {
        const sN    = (s?.statut?.name || s?.statut || '').toUpperCase();
        const isOk  = sN === 'REGLER' || sN === 'PAYER' || sN === 'CLOTURER';
        const isKo  = sN === 'REFUSER';
        const isCrs = sN === 'DECLARER' || sN === 'EN_COURS';
        const statutDot = isOk ? '#27ae60' : isKo ? '#e74c3c' : isCrs ? '#e67e22' : '#aaa';
        return {
            id:              s.id,
            numeroDossier:   s.numeroDossier || '—',
            policeNum:       s.police?.numeroPolice || '—',
            produitNom:      s.police?.produit?.nom || '—',
            dateSurvenance:  s.dateSurvenance  || '',
            dateDeclaration: s.dateDeclaration || '',
            montantEvalue:   s.montantEvalue ?? null,
            statutLabel:     s.statut?.description || s.statut?.name || String(s.statut || '—'),
            statutDot,
            statutBg:    statutDot + '18',
            statutColor: isOk ? '#1a6b3c' : isKo ? '#c0392b' : isCrs ? '#c05a00' : '#666',
        };
    }
}
