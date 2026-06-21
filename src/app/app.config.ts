import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { IMAGE_CONFIG, registerLocaleData } from '@angular/common';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

/** Désactive la réutilisation des composants â€” ngOnInit est toujours rappelé Ã  chaque navigation */
class NoReuseStrategy implements RouteReuseStrategy {
    shouldDetach(_route: ActivatedRouteSnapshot): boolean { return false; }
    store(_route: ActivatedRouteSnapshot, _handle: DetachedRouteHandle | null): void {}
    shouldAttach(_route: ActivatedRouteSnapshot): boolean { return false; }
    retrieve(_route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
    }
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withHashLocation(), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RouteReuseStrategy, useClass: NoReuseStrategy },
        provideAnimations(),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        {
            provide: IMAGE_CONFIG,
            useValue: {
                disableImageSizeWarning: true,
                disableImageLazyLoadWarning: true
            }
        },
    ]
};
