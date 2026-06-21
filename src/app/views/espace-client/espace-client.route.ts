import { Routes } from '@angular/router';
import { ClientLayoutComponent } from '../../layouts/client-layout/client-layout.component';
import { authGuard } from '../../core/guards/auth.guard';

export const ESPACE_CLIENT_ROUTES: Routes = [
    {
        path: 'mon-espace',
        component: ClientLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'polices',
                pathMatch: 'full'
            },
            {
                path: 'polices',
                loadComponent: () => import('./polices/polices.component').then(m => m.PolicesComponent),
                data: { title: 'Mes Polices - Sénégal Excursions' }
            },
            {
                path: 'polices/:ref',
                loadComponent: () => import('./polices/police-detail/police-detail.component').then(m => m.PoliceDetailComponent),
                data: { title: 'Détail police - Sénégal Excursions' }
            },
            {
                path: 'sinistres',
                loadComponent: () => import('./sinistres/sinistres.component').then(m => m.SinistresComponent),
                data: { title: 'Mes Sinistres - Sénégal Excursions' }
            },
            {
                path: 'paiements',
                loadComponent: () => import('./paiements/paiements.component').then(m => m.PaiementsComponent),
                data: { title: 'Mes Paiements - Sénégal Excursions' }
            },
        ]
    }
];
