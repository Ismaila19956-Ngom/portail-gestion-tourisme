import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ClientPortalService } from '../../../services/client-portal.service';
import { Paiement, pageInfo } from '../../../models/client-portal.models';

interface PaiementRow {
    id: number;
    numeroFacture: string;
    policeNum: string;
    produitNom: string;
    dateEmission: string;
    montantPaye: number;
    modeLabel: string;
    encaisse: boolean;
    statutLabel: string;
    statutDot: string;
    statutBg: string;
    statutColor: string;
}

@Component({
    selector: 'app-paiements',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    template: `
    <div class="pg">

        <!-- ══ EN-TÊTE ══ -->
        <div class="pg-header">
            <div>
                <h2 class="pg-title">
                    <i class="fa-solid fa-receipt" style="color:#538F6C;"></i>
                    Mes Paiements
                </h2>
                <p class="pg-sub">Historique de vos versements de primes Sénégal Excursions</p>
            </div>
            <div class="stats-row">
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-receipt" style="color:#538F6C;font-size:0.68rem;"></i></div>
                    <div><div class="stat-val">{{ total }}</div><div class="stat-lbl">Paiement(s)</div></div>
                </div>
                <div class="stat-chip">
                    <div class="stat-icon"><i class="fa-solid fa-circle-check" style="color:#27ae60;font-size:0.68rem;"></i></div>
                    <div><div class="stat-val">{{ encaisses }}</div><div class="stat-lbl">Encaiss�(s)</div></div>
                </div>
                <div class="stat-chip total-chip">
                    <div class="stat-icon"><i class="fa-solid fa-coins" style="color:#538F6C;font-size:0.68rem;"></i></div>
                    <div>
                        <div class="stat-val gold-val">{{ totalVerse | number:'1.0-0' }}</div>
                        <div class="stat-lbl">FCFA vers�s</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ══ SPINNER ══ -->
        <div *ngIf="loading" class="spin-box">
            <div class="spinner"></div>
        </div>

        <!-- ══ VIDE ══ -->
        <div *ngIf="!loading && !featuredRow" class="empty-box">
            <i class="fa-solid fa-receipt" style="font-size:2rem;color:#e0c97a;display:block;margin-bottom:10px;"></i>
            <p style="color:#1a1a1a;font-weight:700;font-size:0.88rem;margin:0 0 4px;">Aucun paiement enregistr�</p>
            <p style="color:#aaa;font-size:0.78rem;margin:0;">Vos versements appara�tront ici.</p>
        </div>

        <ng-container *ngIf="!loading && featuredRow">

            <!-- ══ PAIEMENT LE PLUS R�CENT ══ -->
            <div class="section">
                <div class="section-head">
                    <div class="section-title">
                        <span class="pulse-dot"></span>
                        Paiement le plus r�cent
                        <span class="recent-tag">Dernier versement</span>
                    </div>
                    <span class="sort-label"><i class="fa-solid fa-arrow-down-wide-short"></i> Tri�s par date d'�mission</span>
                </div>

                <!-- Carte vedette gradient (mod�le polices) -->
                <div class="featured-card">
                    <div class="fc-orb fc-orb-1"></div>
                    <div class="fc-orb fc-orb-2"></div>

                    <div class="fc-top">
                        <div class="fc-icon-wrap">
                            <div class="fc-icon">
                                <i class="fa-solid fa-money-bill-wave"></i>
                            </div>
                            <div>
                                <div class="fc-num">{{ featuredRow.numeroFacture }}</div>
                                <div class="fc-sub-prod">Police : {{ featuredRow.policeNum }} | Produit : {{ featuredRow.produitNom }}</div>
                            </div>
                        </div>
                        <span class="fc-statut"
                              [style.background]="featuredRow.statutBg"
                              [style.color]="featuredRow.statutColor"
                              [style.border]="'1px solid ' + featuredRow.statutDot + '44'">
                            <span class="dot-s" [style.background]="featuredRow.statutDot"></span>
                            {{ featuredRow.encaisse ? 'Encaiss�' : featuredRow.statutLabel }}
                        </span>
                    </div>

                    <div class="fc-grid">
                        <div class="fc-cell">
                            <div class="fc-lbl">Date d'�mission</div>
                            <div class="fc-val">{{ featuredRow.dateEmission | date:'dd MMMM yyyy' }}</div>
                        </div>
                        <div class="fc-cell">
                            <div class="fc-lbl">Mode de paiement</div>
                            <div class="fc-val">{{ featuredRow.modeLabel }}</div>
                        </div>
                        <div class="fc-cell">
                            <div class="fc-lbl">Montant vers�</div>
                            <div class="fc-val accent-val">{{ featuredRow.montantPaye | number:'1.0-0' }} <small>FCFA</small></div>
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
                        Historique des paiements
                        <span class="count-badge">{{ historyRows.length }}</span>
                    </div>
                    <span class="sort-label">Page {{ currentPage + 1 }} / {{ totalPages }}</span>
                </div>

                <div class="hist-table">
                    <div class="hist-head">
                        <span>N� Facture</span>
                        <span>Police</span>
                        <span>Produit</span>
                        <span>Date</span>
                        <span>Mode</span>
                        <span class="col-r">Montant</span>
                        <span class="col-c">Statut</span>
                    </div>
                    <div *ngFor="let r of historyRows; let even=even"
                         class="hist-row" [class.hist-even]="even">
                        <div class="hist-num-cell">
                            <div class="hist-icon">
                                <i class="fa-solid fa-receipt" style="font-size:0.58rem;color:#538F6C;"></i>
                            </div>
                            <span class="hist-num-text">{{ r.numeroFacture }}</span>
                        </div>
                        <div class="hist-sec-police" [title]="r.policeNum">{{ r.policeNum }}</div>
                        <div class="hist-sec-product" [title]="r.produitNom"><span class="prod-badge">{{ r.produitNom }}</span></div>
                        <div class="hist-date">{{ r.dateEmission | date:'dd/MM/yyyy' }}</div>
                        <div class="hist-date">{{ r.modeLabel }}</div>
                        <div class="col-r">
                            <div class="hist-amount">{{ r.montantPaye | number:'1.0-0' }}</div>
                            <div style="font-size:0.65rem;color:#bbb;">FCFA</div>
                        </div>
                        <div class="col-c">
                            <span class="hist-badge"
                                  [style.background]="r.statutBg"
                                  [style.color]="r.statutColor"
                                  [style.border]="'1px solid ' + r.statutDot + '44'">
                                <span class="dot-s" [style.background]="r.statutDot"></span>
                                {{ r.encaisse ? 'Encaiss�' : r.statutLabel }}
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
    .total-chip { border-color:#d4ac0d44; }
    .stat-icon { width:22px;height:22px;background:#f5f5f5;border-radius:6px;display:flex;align-items:center;justify-content:center; }
    .stat-val { font-size:0.85rem;font-weight:900;color:#1a1a1a;line-height:1; }
    .stat-val.gold-val { color:#538F6C; }
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
    @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(184,134,11,0.4)} 70%{box-shadow:0 0 0 6px rgba(184,134,11,0)} 100%{box-shadow:0 0 0 0 rgba(184,134,11,0)} }
    .recent-tag { font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:20px;background:#eef5f1;color:#3d7554;border:1px solid #b8d9c6; }

    .section-dot { width:7px;height:7px;border-radius:50%;background:#d1d1d1;flex-shrink:0; }
    .count-badge { font-size:0.62rem;font-weight:800;padding:1px 7px;border-radius:20px;background:#f5f5f5;color:#888; }

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
    .hist-head { display:grid;grid-template-columns:1.8fr 2.2fr 2fr 1fr 1.2fr 1.1fr 1.1fr;column-gap:16px;padding:8px 12px;background:#538F6C;border-radius:8px;font-size:0.62rem;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:0.6px;align-items:center;margin-bottom:4px; }
    .hist-row { display:grid;grid-template-columns:1.8fr 2.2fr 2fr 1fr 1.2fr 1.1fr 1.1fr;column-gap:16px;padding:10px 12px;border-radius:8px;align-items:center;transition:background 0.15s;border-bottom:1px solid #f0f0f0; }
    .hist-row:last-child { border-bottom:none; }
    .hist-row:hover { background:#fafafa; }
    .hist-even { background:#f9f9f9; }
    .hist-num-cell { display:flex;align-items:center;gap:7px; }
    .hist-icon { width:24px;height:24px;border-radius:6px;background:#eef5f1;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .hist-num-text { font-family:monospace;font-size:0.78rem;font-weight:700;color:#1a1a1a; }
    .hist-sec { font-size:0.76rem;color:#666; }
    .hist-sec-police { font-family:monospace;font-size:0.72rem;color:#444;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
    .hist-sec-product { font-size:0.74rem;font-weight:600;color:#2c5e43;line-height:1.25; }
    .hist-date { font-size:0.76rem;color:#888; }
    .hist-amount { font-size:0.8rem;font-weight:800;color:#538F6C; }
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
        .hist-head { min-width:768px;grid-template-columns:1.8fr 2.2fr 2fr 1fr 1.2fr 1.1fr 1.1fr;column-gap:16px; }
        .hist-row  { min-width:768px;grid-template-columns:1.8fr 2.2fr 2fr 1fr 1.2fr 1.1fr 1.1fr;column-gap:16px; }

        .pag-btn { padding:6px 10px;font-size:0.74rem; }
    }

    @media (max-width:480px) {
        .pg-title { font-size:0.88rem; }
        .featured-card { padding:12px; }
        .fc-grid { grid-template-columns:1fr; }
        .fc-cell { border-bottom:1px solid rgba(255,255,255,0.1); }
        .fc-val { font-size:0.76rem; }
        .accent-val { font-size:0.86rem !important; }
        .empty-box { padding: 24px 16px !important; }
    }
    </style>
    `,
})
export class PaiementsComponent implements OnInit {

    featuredRow:  PaiementRow | null = null;
    historyRows:  PaiementRow[]      = [];
    loading     = true;
    total       = 0;
    encaisses   = 0;
    totalPages  = 0;
    currentPage = 0;

    get totalVerse() {
        const all = this.featuredRow ? [this.featuredRow, ...this.historyRows] : this.historyRows;
        return all.reduce((s, r) => s + (r.montantPaye || 0), 0);
    }

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
        this.portal.getPaiements(clientId, page).subscribe({
            next: res => {
                const pi = pageInfo(res);
                const all = [...(res?.content ?? [])].sort((a, b) => {
                    const da = a.dateEmission ? new Date(a.dateEmission).getTime() : 0;
                    const db = b.dateEmission ? new Date(b.dateEmission).getTime() : 0;
                    return db - da;
                });
                this.total       = pi.total;
                this.totalPages  = pi.totalPages;
                this.currentPage = pi.page;
                this.encaisses   = all.filter(p => p.encaisse || (p?.statut?.name||'').toUpperCase()==='ENCAISSE').length;
                const rows = all.map(p => this._toRow(p));
                this.featuredRow = rows[0] ?? null;
                this.historyRows = rows.slice(1);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => { this.loading = false; this.cdr.markForCheck(); }
        });
    }

    private _toRow(p: any): PaiementRow {
        const sN    = (p?.statut?.name || p?.statut || '').toUpperCase();
        const isOk  = p.encaisse || sN === 'ENCAISSE' || sN === 'VALIDE';
        const isKo  = sN === 'ANNULE' || sN === 'ECHOUE';
        const isPnd = sN === 'EN_ATTENTE';
        const statutDot = isOk ? '#27ae60' : isKo ? '#e74c3c' : isPnd ? '#e67e22' : '#aaa';
        const m = p.modePaiement;
        return {
            id:            p.id,
            numeroFacture: p.numeroFacture || `Paiement #${p.id}`,
            policeNum:     p.numeroPolice || p.police?.numeroPolice || '—',
            produitNom:    p.nomPolice || p.police?.produit?.nom || '—',
            dateEmission:  p.dateEmission || '',
            montantPaye:   p.montantPaye  || 0,
            modeLabel:     m ? (m.description || m.libelle || m.name || String(m)) : '—',
            encaisse:      !!p.encaisse,
            statutLabel:   p.statut?.description || p.statut?.name || String(p.statut || '—'),
            statutDot,
            statutBg:    statutDot + '18',
            statutColor: isOk ? '#1a6b3c' : isKo ? '#c0392b' : isPnd ? '#c05a00' : '#666',
        };
    }
}
