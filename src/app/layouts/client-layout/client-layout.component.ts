import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-client-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="portal-root">

        <!-- ══════════════════════════════════════════
             SIDEBAR
        ══════════════════════════════════════════ -->
        <!-- Overlay mobile -->
        <div class="sidebar-overlay" [class.visible]="sidebarOpen() && isMobile()" (click)="sidebarOpen.set(false)"></div>

        <aside class="sidebar" [class.collapsed]="!sidebarOpen()" [class.mobile-open]="sidebarOpen() && isMobile()">

            <!-- Logo + toggle -->
            <div class="sidebar-header">
                <div class="sidebar-logo" *ngIf="sidebarOpen()">
                    <img src="assets/images/logo/senegal-excursions-logo.jpg" alt="S�n�gal Excursions">
                    <div class="sidebar-logo-text">
                        <span class="sidebar-brand">S�n�gal Excursions</span>
                        <span class="sidebar-tagline">Espace Assur�</span>
                    </div>
                </div>
                <div class="sidebar-logo-icon" *ngIf="!sidebarOpen()">
                    <img src="assets/images/logo/senegal-excursions-logo.jpg" alt="S�n�gal Excursions">
                </div>
                <button class="hamburger-btn" (click)="toggle()" [title]="sidebarOpen() ? 'R�duire' : 'D�velopper'">
                    <span class="ham-line" [class.open]="sidebarOpen()"></span>
                    <span class="ham-line" [class.open]="sidebarOpen()"></span>
                    <span class="ham-line" [class.open]="sidebarOpen()"></span>
                </button>
            </div>

            <!-- Profil utilisateur -->
            <div class="sidebar-user" *ngIf="sidebarOpen()">
                <div class="user-avatar">{{ initiales }}</div>
                <div class="user-info">
                    <div class="user-name">{{ displayName }}</div>
                    <div class="user-num">{{ user?.clientNumero }}</div>
                </div>
            </div>
            <div class="sidebar-user-icon" *ngIf="!sidebarOpen()" [title]="displayName">
                <div class="user-avatar">{{ initiales }}</div>
            </div>

            <!-- Nav items -->
            <nav class="sidebar-nav">
                <div class="nav-section-label" *ngIf="sidebarOpen()">MENU</div>

                <a routerLink="/mon-espace/polices" routerLinkActive="nav-active" class="nav-item"
                   (click)="closeMobile()" [title]="!sidebarOpen() ? 'Mes Polices' : ''">
                    <div class="nav-icon"><i class="fa-solid fa-file-contract"></i></div>
                    <span class="nav-label" *ngIf="sidebarOpen()">Mes Polices</span>
                    <div class="nav-indicator" *ngIf="sidebarOpen()"></div>
                </a>

                <a routerLink="/mon-espace/sinistres" routerLinkActive="nav-active" class="nav-item"
                   (click)="closeMobile()" [title]="!sidebarOpen() ? 'Mes Sinistres' : ''">
                    <div class="nav-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <span class="nav-label" *ngIf="sidebarOpen()">Mes Sinistres</span>
                    <div class="nav-indicator" *ngIf="sidebarOpen()"></div>
                </a>

                <a routerLink="/mon-espace/paiements" routerLinkActive="nav-active" class="nav-item"
                   (click)="closeMobile()" [title]="!sidebarOpen() ? 'Mes Paiements' : ''">
                    <div class="nav-icon"><i class="fa-solid fa-receipt"></i></div>
                    <span class="nav-label" *ngIf="sidebarOpen()">Mes Paiements</span>
                    <div class="nav-indicator" *ngIf="sidebarOpen()"></div>
                </a>

                <div class="nav-divider"></div>

                <a routerLink="/home-1" class="nav-item nav-item-secondary"
                   (click)="closeMobile()" [title]="!sidebarOpen() ? 'Portail public' : ''">
                    <div class="nav-icon"><i class="fa-solid fa-house"></i></div>
                    <span class="nav-label" *ngIf="sidebarOpen()">Portail public</span>
                </a>
            </nav>

            <!-- D�connexion -->
            <div class="sidebar-footer">
                <button (click)="logout()" class="logout-btn" [title]="!sidebarOpen() ? 'D�connexion' : ''">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span *ngIf="sidebarOpen()">D�connexion</span>
                </button>
            </div>
        </aside>

        <!-- ══════════════════════════════════════════
             MAIN AREA
        ══════════════════════════════════════════ -->
        <div class="main-area" [class.expanded]="!sidebarOpen()">

            <!-- TOPBAR -->
            <header class="topbar">
                <div class="topbar-left">
                    <!-- Hamburger visible uniquement en mobile -->
                    <button class="topbar-ham" (click)="toggle()">
                        <i class="fa-solid" [class.fa-bars]="!sidebarOpen()" [class.fa-xmark]="sidebarOpen()"></i>
                    </button>
                    <div class="topbar-breadcrumb">
                        <i class="fa-solid fa-shield-halved" style="color:#556B2F;font-size:0.8rem;"></i>
                        <span>Espace assur�</span>
                    </div>
                </div>
                <div class="topbar-right">
                    <!-- Cloche alertes -->
                    <button class="topbar-bell" title="Notifications">
                        <i class="fa-solid fa-bell"></i>
                    </button>
                    <!-- Avatar seul (sans nom) -->
                    <div class="topbar-avatar-wrap" [title]="displayName">
                        <div class="topbar-avatar">{{ initiales }}</div>
                    </div>
                </div>
            </header>

            <!-- PAGE CONTENT -->
            <main class="page-content">
                <router-outlet />
            </main>
        </div>

    </div>
    `,
    styles: [`
        /* ── Root ── */
        .portal-root {
            min-height: 100vh;
            background: #f4faf6;
            display: flex;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            /* NE PAS mettre overflow:hidden ici — cela casserait position:fixed de la sidebar */
        }

        /* ── Sidebar ── */
        .sidebar {
            width: 255px;
            min-height: 100vh;
            background: linear-gradient(180deg, #0a3d1f 0%, #556B2F 60%, #0d4a20 100%);
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0; left: 0; bottom: 0;
            z-index: 300;
            transition: width 0.28s cubic-bezier(.4,0,.2,1);
            box-shadow: 4px 0 24px rgba(85,107,47,0.18);
            overflow: hidden;
        }
        .sidebar.collapsed { width: 68px; }

        /* Overlay mobile */
        .sidebar-overlay {
            display: none;
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 299;
            opacity: 0;
            transition: opacity 0.25s;
        }
        .sidebar-overlay.visible { display: block; opacity: 1; }

        /* Header sidebar */
        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 14px 14px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            min-height: 68px;
            flex-shrink: 0;
        }
        .sidebar-logo {
            display: flex; align-items: center; gap: 10px;
            overflow: hidden; white-space: nowrap;
        }
        .sidebar-logo img { height: 32px; border-radius: 6px; background: #fff; padding: 2px; flex-shrink: 0; }
        .sidebar-logo-text { display: flex; flex-direction: column; }
        .sidebar-brand { color: #fff; font-weight: 900; font-size: 0.95rem; line-height: 1; }
        .sidebar-tagline { color: #F1B53B; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
        .sidebar-logo-icon img { height: 36px; border-radius: 8px; background: #fff; padding: 2px; display: block; margin: 0 auto; }

        /* Hamburger button */
        .hamburger-btn {
            display: flex; flex-direction: column; justify-content: center;
            gap: 5px; background: rgba(255,255,255,0.08); border: none;
            border-radius: 8px; padding: 8px; cursor: pointer;
            flex-shrink: 0; transition: background 0.18s;
        }
        .hamburger-btn:hover { background: rgba(255,255,255,0.15); }
        .ham-line {
            display: block; width: 18px; height: 2px;
            background: #fff; border-radius: 2px;
            transition: all 0.28s cubic-bezier(.4,0,.2,1);
            transform-origin: center;
        }
        .ham-line.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .ham-line.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .ham-line.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Profil */
        .sidebar-user {
            display: flex; align-items: center; gap: 10px;
            padding: 14px 16px; margin: 10px 10px 4px;
            background: rgba(255,255,255,0.07); border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden; white-space: nowrap; flex-shrink: 0;
        }
        .sidebar-user-icon { display: flex; justify-content: center; padding: 10px 0 4px; flex-shrink: 0; }
        .user-avatar {
            width: 38px; height: 38px; background: #F1B53B;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-weight: 900; color: #1a1a1a; font-size: 0.85rem; flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(241,181,59,0.4);
        }
        .user-info { overflow: hidden; }
        .user-name { color: #fff; font-size: 0.78rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
        .user-num  { color: rgba(255,255,255,0.45); font-size: 0.65rem; margin-top: 2px; }

        /* Nav */
        .sidebar-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 10px; }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

        .nav-section-label {
            color: rgba(255,255,255,0.3); font-size: 0.6rem; font-weight: 800;
            text-transform: uppercase; letter-spacing: 1.5px;
            padding: 10px 8px 6px; white-space: nowrap;
        }
        .nav-item {
            display: flex; align-items: center; gap: 12px;
            padding: 11px 12px; border-radius: 10px;
            text-decoration: none; color: rgba(255,255,255,0.65);
            font-size: 0.84rem; font-weight: 500;
            margin-bottom: 2px; cursor: pointer;
            position: relative; overflow: hidden;
            transition: all 0.2s; white-space: nowrap;
        }
        .nav-item::before {
            content: ''; position: absolute; left: 0; top: 0; bottom: 0;
            width: 3px; background: #F1B53B; border-radius: 0 3px 3px 0;
            opacity: 0; transition: opacity 0.2s;
        }
        .nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .nav-item:hover::before { opacity: 0.5; }
        .nav-active {
            background: rgba(255,255,255,0.15) !important;
            color: #fff !important; font-weight: 700 !important;
        }
        .nav-active::before { opacity: 1 !important; }
        .nav-item-secondary { color: rgba(255,255,255,0.4); }
        .nav-item-secondary:hover { color: rgba(255,255,255,0.75); }

        .nav-icon {
            width: 32px; height: 32px; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            background: rgba(255,255,255,0.08); flex-shrink: 0;
            font-size: 0.82rem; transition: background 0.2s;
        }
        .nav-active .nav-icon { background: rgba(241,181,59,0.25); color: #F1B53B; }
        .nav-item:hover .nav-icon { background: rgba(255,255,255,0.15); }
        .nav-label { flex: 1; }
        .nav-indicator { display: none; }

        .nav-divider {
            border-top: 1px solid rgba(255,255,255,0.08);
            margin: 8px 4px;
        }

        /* Footer sidebar */
        .sidebar-footer {
            padding: 12px 10px;
            border-top: 1px solid rgba(255,255,255,0.08);
            flex-shrink: 0;
        }
        .logout-btn {
            width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
            padding: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6);
            font-size: 0.82rem; font-weight: 600; cursor: pointer;
            transition: all 0.2s; white-space: nowrap;
        }
        .logout-btn:hover { background: rgba(220,50,50,0.2); border-color: rgba(220,50,50,0.4); color: #ff8080; }

        /* ── Main area ── */
        .main-area {
            margin-left: 255px;
            flex: 1; display: flex; flex-direction: column;
            min-height: 100vh; transition: margin-left 0.28s cubic-bezier(.4,0,.2,1);
            overflow-x: hidden; /* scroll horizontal contenu seulement, sidebar non affect�e */
            min-width: 0;
        }
        .main-area.expanded { margin-left: 68px; }

        /* Topbar */
        .topbar {
            height: 60px; background: #fff;
            border-bottom: 1px solid #e8f4ec;
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 28px;
            position: sticky; top: 0; z-index: 100;
            box-shadow: 0 1px 8px rgba(85,107,47,0.06);
        }
        .topbar-left { display: flex; align-items: center; gap: 14px; }
        .topbar-ham {
            display: none; /* cach� sur desktop, visible mobile */
            width: 36px; height: 36px; background: #f0faf4;
            border: none; border-radius: 8px; cursor: pointer;
            align-items: center; justify-content: center;
            color: #556B2F; font-size: 1rem; transition: background 0.18s;
        }
        .topbar-ham:hover { background: #e8f4ec; }
        .topbar-breadcrumb {
            display: flex; align-items: center; gap: 6px;
            color: #888; font-size: 0.8rem; font-weight: 500;
        }
        .topbar-breadcrumb span { color: #555; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .topbar-bell {
            position: relative; width: 38px; height: 38px;
            background: #f0faf4; border: 1px solid #d4edda;
            border-radius: 10px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #556B2F; font-size: 0.95rem; transition: all 0.18s;
        }
        .topbar-bell:hover { background: #556B2F; color: #fff; border-color: #556B2F; }
        .topbar-avatar-wrap { cursor: pointer; }
        .topbar-avatar {
            width: 38px; height: 38px; background: #556B2F;
            border-radius: 10px; display: flex; align-items: center; justify-content: center;
            font-weight: 800; color: #fff; font-size: 0.82rem;
            border: 2px solid #e8f4ec; transition: border-color 0.18s;
        }
        .topbar-avatar-wrap:hover .topbar-avatar { border-color: #556B2F; }

        /* Page content */
        .page-content { flex: 1; padding: 24px 28px; overflow-x: hidden; }

        /* ── Tablet (768�1024px) ── */
        @media (max-width: 1024px) and (min-width: 769px) {
            .sidebar { width: 220px; }
            .main-area { margin-left: 220px; }
            .main-area.expanded { margin-left: 68px; }
            .page-content { padding: 20px 20px; }
        }

        /* ── Mobile (≤768px) ── */
        @media (max-width: 768px) {
            /* Sidebar devient overlay */
            .sidebar {
                transform: translateX(-100%);
                width: 260px !important;
                transition: transform 0.28s cubic-bezier(.4,0,.2,1);
            }
            .sidebar.mobile-open { transform: translateX(0); }

            /* Main occupe tout l'�cran */
            .main-area, .main-area.expanded { margin-left: 0 !important; }

            /* Topbar */
            .topbar { padding: 0 14px; }
            .topbar-ham { display: flex; }
            .topbar-breadcrumb { display: none; }

            /* Contenu */
            .page-content { padding: 14px 12px; }
        }

        /* ── Tr�s petit mobile (≤480px) ── */
        @media (max-width: 480px) {
            .page-content { padding: 12px 10px; }
            .topbar { height: 54px; }
        }
    `]
})
export class ClientLayoutComponent {
    sidebarOpen = signal(true);

    constructor(private authService: AuthService) {}

    toggle() { this.sidebarOpen.update(v => !v); }
    closeMobile() { if (this.isMobile()) this.sidebarOpen.set(false); }
    isMobile() { return window.innerWidth <= 768; }

    get user()        { return this.authService.user(); }
    get displayName() {
        const u = this.user;
        if (!u) return '';
        return u.displayName || u.clientRaisonSociale || `${u.clientPrenom || ''} ${u.clientNom || ''}`.trim();
    }
    get initiales() {
        const n = this.displayName;
        const parts = n.trim().split(/\s+/);
        return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : n.slice(0, 2).toUpperCase();
    }
    logout() { this.authService.logout(); }
}
