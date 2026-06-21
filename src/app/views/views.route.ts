import { Routes } from '@angular/router';
import { Home1Component } from './home-1/home-1.component';

export const VIEWS_ROUTES: Routes = [
    {
        path: 'home-1',
        component: Home1Component,
        data: { title: "home-1" }
       
    },
    {
        path: 'faq',
        loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent),
        data: { title: "FAQ - Foire aux questions" }
    },
    {
        path: 'excursions',
        loadComponent: () => import('./excursions/excursions').then(m => m.ExcursionsComponent),
        data: { title: "Excursions au Sénégal" }
    },
    {
        path: 'excursions/detail/:id',
        loadComponent: () => import('./excursions/detail-excursion/detail-excursion').then(m => m.DetailExcursionComponent),
        data: { title: "Détail de l'excursion" }
    },
    {
        path: 'checkout/:id',
        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
        data: { title: "Paiement Sécurisé" }
    },
    {
        path: '',
        loadChildren: () =>
            import('./services/services.route').then((mod) => mod.SERVICES_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./blogs/blogs.route').then((mod) => mod.BLOGS_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./case-studies/case-studies.route').then((mod) => mod.CASE_STUDIES_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./other-pages/other-pages.route').then((mod) => mod.OTHER_PAGES_ROUTES),
    },
];
