import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ClientPortalService } from '../../../services/client-portal.service';
import { Police, Paiement, pageInfo } from '../../../models/client-portal.models';

interface PoliceCard {
    id: number; numeroPolice: string; produitNom: string; produitCode: string;
    icon: string; iconBg: string; gradientFrom: string; gradientTo: string;
    dateEffet: string; dateEcheance: string; montant: number; prime: number;
    statutLabel: string; statutBg: string; statutColor: string; statutDot: string;
    expiringSoon: boolean; active: boolean;
}

interface AlertItem { icon: string; color: string; bg: string; message: string; routerLink: string; }

@Component({
    selector: 'app-dashboard',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="dash">

        <!-- â•â• ALERTE PANEL (cloche) â•â• -->
        <div *ngIf="alertsOpen && alerts.length > 0" class="alert-panel">
            <div class="alert-panel-header">
                <span style="font-weight:800;color:#3E4F22;font-size:0.9rem;">
                    <i class="fa-solid fa-bell" style="color:#F1B53B;"></i> Notifications ({{ alerts.length }})
                </span>
                <button (click)="alertsOpen=false" style="background:none;border:none;cursor:pointer;color:#aaa;font-size:1.1rem;">âœ•</button>
            </div>
            <div *ngFor="let a of alerts" class="alert-item" [routerLink]="a.routerLink" (click)="alertsOpen=false">
                <div class="alert-icon" [style.background]="a.bg">
                    <i [class]="a.icon" [style.color]="a.color"></i>
                </div>
                <span style="font-size:0.82rem;color:#333;flex:1;">{{ a.message }}</span>
                <i class="fa-solid fa-chevron-right" style="color:#ccc;font-size:0.7rem;"></i>
            </div>
        </div>

        <!-- â•â• HERO â•â• -->
        <div class="hero">
            <div class="hero-orb hero-orb-1"></div>
            <div class="hero-orb hero-orb-2"></div>
            <div class="hero-left">
                <div class="hero-greeting">Bonjour ðŸ‘‹</div>
                <h1 class="hero-name">{{ displayName }}</h1>
                <p class="hero-sub">Votre espace Sénégal Excursions â€” {{ today }}</p>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <span class="hero-stat-val">{{ featuredCard ? 1 : 0 }}</span>
                        <span class="hero-stat-lbl">Dernière police</span>
                    </div>
                    <div class="hero-stat-sep"></div>
                    <div class="hero-stat">
                        <span class="hero-stat-val">{{ historyCards.length }}</span>
                        <span class="hero-stat-lbl">En historique</span>
                    </div>
                    <div class="hero-stat-sep"></div>
                    <div class="hero-stat">
                        <span class="hero-stat-val">{{ paiements.length }}</span>
                        <span class="hero-stat-lbl">Paiement(s)</span>
                    </div>
                </div>
            </div>
            <div class="hero-right">
                <button class="bell-btn" (click)="alertsOpen=!alertsOpen" [title]="alerts.length + ' alerte(s)'">
                    <i class="fa-solid fa-bell"></i>
                    <span *ngIf="alerts.length > 0" class="bell-badge">{{ alerts.length }}</span>
                </button>
                <div class="hero-shield"><i class="fa-solid fa-shield-halved"></i></div>
            </div>
        </div>

        <!-- â•â• CHARGEMENT â•â• -->
        <div *ngIf="loading" class="loading-box">
            <div class="spinner"></div>
            <p>Chargement de vos données...</p>
        </div>

        <ng-container *ngIf="!loading">

            <!-- â•â• POLICE LA PLUS RÉCENTE (vedette) â•â• -->
            <section *ngIf="featuredCard" class="section featured-section">
                <div class="section-head">
                    <div class="section-title">
                        <span class="pulse-dot"></span>
                        Police la plus récente
                        <span class="recent-tag">Dernière souscription</span>
                    </div>
                    <a routerLink="/mon-espace/polices" class="see-all">Toutes mes polices <i class="fa-solid fa-arrow-right"></i></a>
                </div>

                <!-- Card vedette pleine largeur -->
                <div class="featured-card" [style.background]="'linear-gradient(135deg,' + featuredCard.gradientFrom + ' 0%,' + featuredCard.gradientTo + ' 100%)'">
                    <!-- Orbes déco -->
                    <div class="fc-orb fc-orb-1"></div>
                    <div class="fc-orb fc-orb-2"></div>

                    <!-- Badge expiration -->
                    <div *ngIf="featuredCard.expiringSoon" class="expiry-badge">
                        <i class="fa-solid fa-triangle-exclamation"></i> Expire bientôt
                    </div>

                    <!-- Rangée haut -->
                    <div class="fc-top">
                        <div class="fc-icon-wrap">
                            <div class="fc-icon"><i [class]="featuredCard.icon"></i></div>
                            <div>
                                <div class="fc-num">{{ featuredCard.numeroPolice }}</div>
                                <div class="fc-produit">{{ featuredCard.produitNom }}</div>
                            </div>
                        </div>
                        <span class="fc-statut" [style.background]="featuredCard.statutBg" [style.color]="featuredCard.statutColor">
                            <span class="dot-statut" [style.background]="featuredCard.statutDot"></span>
                            {{ featuredCard.statutLabel }}
                        </span>
                    </div>

                    <!-- Infos centrales -->
                    <div class="fc-body">
                        <div class="fc-info-grid">
                            <div class="fc-info-block">
                                <div class="fc-info-lbl">Date d'effet</div>
                                <div class="fc-info-val">{{ featuredCard.dateEffet | date:'dd MMMM yyyy' }}</div>
                            </div>
                            <div class="fc-info-block">
                                <div class="fc-info-lbl">Échéance</div>
                                <div class="fc-info-val" [style.color]="featuredCard.expiringSoon ? '#FF8C42' : '#fff'">
                                    {{ featuredCard.dateEcheance | date:'dd MMMM yyyy' }}
                                </div>
                            </div>
                            <div class="fc-info-block">
                                <div class="fc-info-lbl">Capital assuré</div>
                                <div class="fc-info-val">{{ featuredCard.montant | number:'1.0-0' }} <small>FCFA</small></div>
                            </div>
                            <div class="fc-info-block">
                                <div class="fc-info-lbl">Prime TTC</div>
                                <div class="fc-info-val prime-val">{{ featuredCard.prime | number:'1.0-0' }} <small>FCFA</small></div>
                            </div>
                        </div>
                    </div>

                    <!-- Bouton -->
                    <div class="fc-footer">
                        <a [routerLink]="['/mon-espace/polices', featuredCard.id]" class="fc-btn">
                            <i class="fa-solid fa-eye"></i> Consulter le détail
                        </a>
                        <div class="fc-badge-new">
                            <i class="fa-solid fa-star"></i> Plus récente
                        </div>
                    </div>
                </div>
            </section>

            <!-- â•â• AUCUNE POLICE â•â• -->
            <div *ngIf="!featuredCard && historyCards.length === 0" class="empty-box section">
                <i class="fa-solid fa-file-slash"></i>
                <p>Aucune police souscrite pour le moment.</p>
            </div>

            <!-- â•â• HISTORIQUE â•â• -->
            <section *ngIf="historyCards.length > 0" class="section">
                <div class="section-head">
                    <div class="section-title">
                        <span class="section-dot dot-gray"></span>
                        Historique des polices
                        <span class="section-count gray">{{ historyCards.length }}</span>
                    </div>
                    <a routerLink="/mon-espace/polices" class="see-all">Voir tout <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div class="history-table">
                    <div class="history-header">
                        <span>N° Police</span>
                        <span>Produit</span>
                        <span>Date effet</span>
                        <span>Échéance</span>
                        <span>Statut</span>
                        <span></span>
                    </div>
                    <div *ngFor="let c of historyCards; let even=even" class="history-row" [class.history-even]="even">
                        <span class="history-num">
                            <div class="history-icon" [style.background]="c.gradientFrom + '33'">
                                <i [class]="c.icon" style="font-size:0.65rem;" [style.color]="c.gradientFrom"></i>
                            </div>
                            {{ c.numeroPolice }}
                        </span>
                        <span class="history-produit">{{ c.produitNom }}</span>
                        <span class="history-date">{{ c.dateEffet | date:'dd/MM/yy' }}</span>
                        <span class="history-date">{{ c.dateEcheance | date:'dd/MM/yy' }}</span>
                        <span>
                            <span class="history-badge" [style.background]="c.statutDot + '22'" [style.color]="c.statutDot">{{ c.statutLabel }}</span>
                        </span>
                        <a [routerLink]="['/mon-espace/polices', c.id]" class="history-eye" title="Consulter">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                    </div>
                </div>
            </section>

            <!-- â•â• PAIEMENTS RÉCENTS â•â• -->
            <section class="section" *ngIf="paiements.length > 0">
                <div class="section-head">
                    <div class="section-title">
                        <span class="section-dot dot-gold"></span>
                        Paiements récents
                        <span class="section-count gold">{{ paiements.length }}</span>
                    </div>
                    <a routerLink="/mon-espace/paiements" class="see-all">Voir tout <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div class="pay-list">
                    <div *ngFor="let p of paiements; let i = index" class="pay-item">
                        <div class="pay-timeline">
                            <div class="pay-dot"></div>
                            <div class="pay-line" *ngIf="i < paiements.length - 1"></div>
                        </div>
                        <div class="pay-content">
                            <div class="pay-top">
                                <div>
                                    <div class="pay-ref">{{ p.numeroFacture || 'Paiement #' + p.id }}</div>
                                    <div class="pay-meta">{{ p.dateEmission | date:'dd MMM yyyy' }} · {{ modeLabel(p.modePaiement) }}</div>
                                </div>
                                <div class="pay-amount">{{ p.montantPaye | number:'1.0-0' }} <small>FCFA</small></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </ng-container>
    </div>

    <style>
    .dash { display:flex; flex-direction:column; gap:20px; }

    /* â”€â”€ Hero â”€â”€ */
    .hero {
        background: linear-gradient(135deg,#0a3d1f 0%,#556B2F 60%,#0d6e30 100%);
        border-radius: 22px; padding: 32px 36px;
        display: flex; align-items: center; justify-content: space-between;
        position: relative; overflow: hidden; gap: 20px;
        box-shadow: 0 8px 32px rgba(85,107,47,0.22);
    }
    .hero-orb { position:absolute; border-radius:50%; opacity:0.07; }
    .hero-orb-1 { width:260px;height:260px; background:#F1B53B; top:-80px; right:80px; }
    .hero-orb-2 { width:160px;height:160px; background:#fff; bottom:-60px; right:20px; }
    .hero-left  { position:relative; z-index:1; }
    .hero-greeting { color:rgba(255,255,255,0.6); font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:6px; }
    .hero-name  { color:#fff; font-size:1.7rem; font-weight:900; margin:0 0 6px; line-height:1.1; }
    .hero-sub   { color:rgba(255,255,255,0.5); font-size:0.82rem; margin:0 0 22px; }
    .hero-stats { display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
    .hero-stat  { display:flex; flex-direction:column; }
    .hero-stat-val  { color:#F1B53B; font-size:1.5rem; font-weight:900; line-height:1; }
    .hero-stat-lbl  { color:rgba(255,255,255,0.5); font-size:0.67rem; font-weight:600; text-transform:uppercase; margin-top:3px; }
    .hero-stat-sep  { width:1px; height:32px; background:rgba(255,255,255,0.15); }
    .hero-right { display:flex; align-items:center; gap:16px; position:relative; z-index:1; flex-shrink:0; }
    .hero-shield { width:80px;height:80px; background:rgba(255,255,255,0.08); border-radius:50%;
        display:flex;align-items:center;justify-content:center; font-size:2.2rem; color:rgba(255,255,255,0.2);
        border:2px solid rgba(255,255,255,0.1); }

    /* Cloche */
    .bell-btn {
        position:relative; width:46px;height:46px; background:rgba(255,255,255,0.12);
        border:1px solid rgba(255,255,255,0.2); border-radius:12px; cursor:pointer;
        display:flex;align-items:center;justify-content:center; color:#fff; font-size:1rem;
        transition:background 0.18s;
    }
    .bell-btn:hover { background:rgba(255,255,255,0.2); }
    .bell-badge {
        position:absolute; top:-6px; right:-6px;
        background:#e53935; color:#fff; font-size:0.6rem; font-weight:900;
        width:18px;height:18px; border-radius:50%; display:flex;align-items:center;justify-content:center;
        border:2px solid #556B2F;
    }

    /* Alert panel */
    .alert-panel {
        position:fixed; top:70px; right:24px; width:320px;
        background:#fff; border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.15);
        border:1px solid #e8f4ec; z-index:500; overflow:hidden;
        animation: fadeSlide 0.2s ease;
    }
    @keyframes fadeSlide { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
    .alert-panel-header { display:flex;align-items:center;justify-content:space-between; padding:14px 16px; border-bottom:1px solid #f0f0f0; }
    .alert-item {
        display:flex;align-items:center;gap:10px; padding:12px 16px;
        border-bottom:1px solid #f9f9f9; cursor:pointer; transition:background 0.15s;
        text-decoration:none;
    }
    .alert-item:hover { background:#f8fdf9; }
    .alert-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.82rem;flex-shrink:0; }

    /* Loading */
    .loading-box { text-align:center;padding:80px 0;color:#556B2F; }
    .spinner { width:48px;height:48px;border:4px solid #e8f4ec;border-top-color:#556B2F;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto 16px; }
    @keyframes spin { to{transform:rotate(360deg)} }

    /* Section */
    .section { background:#fff;border-radius:18px;padding:22px 24px;border:1px solid #edf5ef;box-shadow:0 2px 16px rgba(85,107,47,0.05); }
    .featured-section { border-color:#c8e6d0; }
    .section-head { display:flex;align-items:center;justify-content:space-between;margin-bottom:18px; }
    .section-title { display:flex;align-items:center;gap:8px;font-weight:800;color:#3E4F22;font-size:0.95rem; }
    .section-dot { width:9px;height:9px;border-radius:50%;flex-shrink:0; }
    .dot-gray  { background:#bbb; }
    .dot-gold  { background:#F1B53B; }
    .section-count { font-size:0.72rem;font-weight:800;padding:2px 9px;border-radius:20px;background:#e8f4ec;color:#556B2F; }
    .section-count.gray { background:#f0f0f0;color:#999; }
    .section-count.gold { background:rgba(241,181,59,0.15);color:#a07700; }
    .see-all { font-size:0.78rem;color:#556B2F;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:5px;opacity:0.8;transition:opacity 0.18s;white-space:nowrap; }
    .see-all:hover { opacity:1; }

    /* Pulse dot (police récente) */
    .pulse-dot {
        width:10px;height:10px;border-radius:50%;background:#27ae60;flex-shrink:0;
        box-shadow:0 0 0 0 rgba(39,174,96,0.4);
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0%   { box-shadow: 0 0 0 0 rgba(39,174,96,0.5); }
        70%  { box-shadow: 0 0 0 8px rgba(39,174,96,0); }
        100% { box-shadow: 0 0 0 0 rgba(39,174,96,0); }
    }
    .recent-tag {
        font-size:0.68rem;font-weight:700;padding:2px 10px;border-radius:20px;
        background:rgba(39,174,96,0.12);color:#1a7a42;border:1px solid rgba(39,174,96,0.2);
    }

    /* â”€â”€ Featured card (pleine largeur) â”€â”€ */
    .featured-card {
        border-radius:18px; padding:28px 32px;
        position:relative; overflow:hidden;
        box-shadow:0 8px 36px rgba(85,107,47,0.22);
        display:flex; flex-direction:column; gap:20px;
    }
    .fc-orb { position:absolute;border-radius:50%;opacity:0.08; pointer-events:none; }
    .fc-orb-1 { width:300px;height:300px;background:#F1B53B;top:-100px;right:60px; }
    .fc-orb-2 { width:180px;height:180px;background:#fff;bottom:-70px;right:-30px; }
    .expiry-badge {
        position:absolute;top:20px;right:20px;
        background:rgba(255,140,66,0.18);color:#FF8C42;
        font-size:0.65rem;font-weight:800;padding:5px 12px;border-radius:20px;
        border:1px solid rgba(255,140,66,0.3);display:flex;align-items:center;gap:5px;
    }
    .fc-top { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;position:relative;z-index:1; }
    .fc-icon-wrap { display:flex;align-items:center;gap:14px; }
    .fc-icon {
        width:52px;height:52px;border-radius:14px;
        background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.2);
        display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#fff;flex-shrink:0;
    }
    .fc-num { font-family:monospace;font-size:1.25rem;font-weight:900;color:#fff;letter-spacing:0.5px;line-height:1.1; }
    .fc-produit { color:rgba(255,255,255,0.6);font-size:0.82rem;font-weight:600;margin-top:3px; }
    .fc-statut {
        font-size:0.72rem;font-weight:800;padding:6px 14px;border-radius:20px;
        text-transform:uppercase;display:flex;align-items:center;gap:5px;flex-shrink:0;
    }
    .dot-statut { width:6px;height:6px;border-radius:50%;flex-shrink:0; }

    .fc-body { position:relative;z-index:1; }
    .fc-info-grid {
        display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0;
        background:rgba(255,255,255,0.08);border-radius:14px;border:1px solid rgba(255,255,255,0.12);
        overflow:hidden;
    }
    .fc-info-block {
        padding:16px 20px;display:flex;flex-direction:column;gap:6px;
        border-right:1px solid rgba(255,255,255,0.1);
    }
    .fc-info-block:last-child { border-right:none; }
    .fc-info-lbl { color:rgba(255,255,255,0.45);font-size:0.62rem;font-weight:800;text-transform:uppercase;letter-spacing:0.8px; }
    .fc-info-val { color:#fff;font-size:0.95rem;font-weight:800; }
    .fc-info-val small { font-size:0.62rem;opacity:0.7;font-weight:600; }
    .prime-val { color:#F1B53B !important;font-size:1.05rem !important; }

    .fc-footer {
        display:flex;align-items:center;gap:14px;position:relative;z-index:1;flex-wrap:wrap;
    }
    .fc-btn {
        display:inline-flex;align-items:center;gap:8px;
        background:#fff;color:#556B2F;
        padding:11px 24px;border-radius:12px;font-size:0.84rem;font-weight:800;
        text-decoration:none;transition:all 0.2s;
        box-shadow:0 4px 16px rgba(0,0,0,0.12);
    }
    .fc-btn:hover { background:#f0faf4;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,0.16); }
    .fc-badge-new {
        display:inline-flex;align-items:center;gap:6px;
        background:rgba(241,181,59,0.2);color:#F1B53B;
        padding:9px 16px;border-radius:12px;font-size:0.78rem;font-weight:800;
        border:1px solid rgba(241,181,59,0.3);
    }

    /* Historique */
    .history-table { display:flex;flex-direction:column;gap:2px; }
    .history-header {
        display:grid;grid-template-columns:2fr 2fr 1fr 1fr 1.2fr 0.4fr;
        padding:8px 14px;background:#f8fdf9;border-radius:8px;
        font-size:0.67rem;font-weight:800;color:#556B2F;text-transform:uppercase;letter-spacing:0.6px;
    }
    .history-row {
        display:grid;grid-template-columns:2fr 2fr 1fr 1fr 1.2fr 0.4fr;
        padding:11px 14px;border-radius:8px;align-items:center;
        transition:background 0.15s;
    }
    .history-row:hover { background:#f0faf4; }
    .history-even { background:#f9fdfb; }
    .history-num { display:flex;align-items:center;gap:8px;font-family:monospace;font-size:0.83rem;font-weight:700;color:#3E4F22; }
    .history-icon { width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .history-produit { font-size:0.8rem;color:#555;font-weight:500; }
    .history-date { font-size:0.78rem;color:#888; }
    .history-badge { font-size:0.65rem;font-weight:800;padding:3px 9px;border-radius:20px;text-transform:uppercase;display:inline-block; }
    .history-eye {
        width:30px;height:30px;border-radius:7px;background:#e8f4ec;
        display:flex;align-items:center;justify-content:center;
        color:#556B2F;text-decoration:none;font-size:0.82rem;transition:all 0.18s;
    }
    .history-eye:hover { background:#556B2F;color:#fff; }

    /* Paiements timeline */
    .pay-list { display:flex;flex-direction:column; }
    .pay-item { display:flex;gap:14px; }
    .pay-timeline { display:flex;flex-direction:column;align-items:center;flex-shrink:0; }
    .pay-dot { width:12px;height:12px;border-radius:50%;background:#F1B53B;border:2px solid #fff;box-shadow:0 0 0 2px rgba(241,181,59,0.3);margin-top:4px;flex-shrink:0; }
    .pay-line { flex:1;width:2px;background:linear-gradient(to bottom,#F1B53B,rgba(241,181,59,0.1));margin:4px 0;min-height:28px; }
    .pay-content { flex:1;padding-bottom:18px; }
    .pay-top { display:flex;align-items:flex-start;justify-content:space-between;gap:10px; }
    .pay-ref  { font-size:0.86rem;font-weight:700;color:#3E4F22; }
    .pay-meta { font-size:0.74rem;color:#aaa;margin-top:3px; }
    .pay-amount { font-size:0.95rem;font-weight:900;color:#556B2F;white-space:nowrap; }

    /* Empty */
    .empty-box { text-align:center;padding:40px 20px;color:#bbb; }
    .empty-box i { font-size:2rem;display:block;margin-bottom:10px; }
    .empty-box p { font-size:0.88rem;margin:0; }

    @media (max-width:640px) {
        .featured-card { padding:20px 18px; }
        .fc-info-grid { grid-template-columns:1fr 1fr; }
        .fc-info-block { border-right:none; border-bottom:1px solid rgba(255,255,255,0.1); }
        .history-header, .history-row { grid-template-columns:2fr 2fr 1.2fr 0.4fr; }
        .history-header span:nth-child(3),
        .history-row span:nth-child(3) { display:none; }
        .history-header span:nth-child(4),
        .history-row span:nth-child(4) { display:none; }
    }
    </style>
    `
})
export class DashboardComponent implements OnInit {

    featuredCard: PoliceCard | null = null;
    historyCards: PoliceCard[]      = [];
    paiements:    Paiement[]        = [];
    alerts:       AlertItem[]       = [];
    alertsOpen    = false;
    loading       = true;
    today         = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    private static readonly GRADIENTS: [string, string][] = [
        ['#556B2F','#0d6e30'],  // vert Sénégal Excursions
        ['#3E4F22','#556B2F'],  // vert profond
        ['#1a6b3c','#0f4d26'],  // vert forêt
        ['#2e7d32','#1b5e20'],  // vert foncé
        ['#006064','#00838f'],  // teal
        ['#1565c0','#0d47a1'],  // bleu
    ];

    constructor(
        private auth: AuthService,
        private portal: ClientPortalService,
        private cdr: ChangeDetectorRef,
    ) {}

    get displayName() {
        const u = this.auth.user();
        if (!u) return '';
        return u.displayName || u.clientRaisonSociale || `${u.clientPrenom || ''} ${u.clientNom || ''}`.trim();
    }

    ngOnInit() {
        const clientId = this.auth.user()?.clientId;
        if (!clientId) { this.loading = false; this.cdr.markForCheck(); return; }

        let done = 0;
        const check = () => { if (++done >= 2) { this.loading = false; this.cdr.markForCheck(); } };

        this.portal.getPolices(clientId, 0, 8).subscribe({
            next: res => {
                // Trier par dateEffet DESC â†’ la plus récente en premier
                const polices = [...(res?.content ?? [])].sort((a, b) => {
                    const da = a.dateEffet ? new Date(a.dateEffet).getTime() : 0;
                    const db = b.dateEffet ? new Date(b.dateEffet).getTime() : 0;
                    return db - da;
                });
                const cards = polices.map((p, i) => this.toCard(p, i % DashboardComponent.GRADIENTS.length));
                this.featuredCard = cards.length > 0 ? cards[0] : null;  // la plus récente
                this.historyCards = cards.slice(1);                        // toutes les autres
                this.buildAlerts();
                check();
            },
            error: () => check()
        });

        this.portal.getPaiements(clientId, 0, 5).subscribe({
            next: res => { this.paiements = res?.content ?? []; check(); },
            error: () => check()
        });
    }

    private toCard(p: any, gi: number): PoliceCard {
        const [gFrom, gTo] = DashboardComponent.GRADIENTS[gi];
        const sN     = (p?.statut?.name || p?.statut || '').toUpperCase();
        const active = sN === 'VALIDER' || sN === 'ACTIF' || sN === 'EN_COURS';
        const code   = p.produit?.code || '';
        const diff   = p.dateEcheance ? new Date(p.dateEcheance).getTime() - Date.now() : -1;
        // Couleur dot statut selon état
        const statutDot = active ? '#4ade80'
            : sN === 'RESILIE' || sN === 'EXPIRE' ? '#f87171'
            : sN === 'SUSPENDU' ? '#fb923c'
            : '#94a3b8';
        return {
            id: p.id, numeroPolice: p.numeroPolice || 'â€”',
            produitNom: p.produit?.nom || 'â€”', produitCode: code,
            icon: this.icon(code), iconBg: 'rgba(255,255,255,0.18)',
            gradientFrom: gFrom, gradientTo: gTo,
            dateEffet: p.dateEffet || '', dateEcheance: p.dateEcheance || '',
            montant: p.betail?.valeurAssuree ?? p.aviculture?.prixUnitaire
                     ?? p.recolte?.totalMontantAssure ?? p.horticulture?.valeurAssureeTotale
                     ?? p.equipement?.montantAssureTotal ?? p.multirisques?.valeurAssuree
                     ?? p.montantAssure ?? 0,
            prime: p.betail?.primeTotale ?? p.recolte?.totalPrimeNetteHT
                   ?? p.equipement?.primeTotale ?? p.multirisques?.primeTotale
                   ?? p.primeTotale ?? p.primeNette ?? 0,
            statutLabel: p.statut?.description || p.statut?.libelle || p.statut?.name || String(p.statut || 'Brouillon'),
            statutBg:    active ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
            statutColor: active ? '#fff' : 'rgba(255,255,255,0.55)',
            statutDot,
            expiringSoon: diff > 0 && diff < 30 * 24 * 60 * 60 * 1000,
            active,
        };
    }

    private buildAlerts() {
        const a: AlertItem[] = [];
        const all = this.featuredCard ? [this.featuredCard, ...this.historyCards] : this.historyCards;
        for (const c of all) {
            if (c.expiringSoon) {
                a.push({ icon:'fa-solid fa-clock', color:'#e67e22', bg:'rgba(230,126,34,0.12)',
                    message: `Police ${c.numeroPolice} expire bientôt`, routerLink: `/mon-espace/polices/${c.id}` });
            }
        }
        this.alerts = a;
    }

    modeLabel(m: any): string {
        if (!m) return 'â€”';
        return m.description || m.libelle || m.name || String(m);
    }

    private icon(code: string): string {
        const c = (code || '').toLowerCase();
        if (c.includes('bet') || c.includes('chep')) return 'fa-solid fa-cow';
        if (c.includes('avi') || c.includes('vol'))  return 'fa-solid fa-egg';
        if (c.includes('recol'))                     return 'fa-solid fa-wheat-awn';
        if (c.includes('hort') || c.includes('marai')) return 'fa-solid fa-seedling';
        if (c.includes('equip'))                     return 'fa-solid fa-tractor';
        if (c.includes('arbor'))                     return 'fa-solid fa-tree';
        if (c.includes('indic'))                     return 'fa-solid fa-satellite-dish';
        if (c.includes('stock'))                     return 'fa-solid fa-boxes-stacking';
        return 'fa-solid fa-shield-halved';
    }
}
