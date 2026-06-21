import { Routes } from '@angular/router';
import { LayoutComponent } from '@layouts/layout/layout.component';
import { LoginComponent } from './views/other-pages/login/login.component';
import { guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'connexion',
        component: LoginComponent,
        canActivate: [guestGuard],
        data: { title: "Connexion - Sénégal Excursions" }
    },
    {
        path: '',
        redirectTo: '/home-1',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () =>
            import('./views/espace-client/espace-client.route').then(m => m.ESPACE_CLIENT_ROUTES),
    },
    {
        path: '',
        component: LayoutComponent,
        loadChildren: () =>
            import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./views/demo/demo-page.route').then((mod) => mod.DEMO_PAGE_ROUTES),
    },
];
