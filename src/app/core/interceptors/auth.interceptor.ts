import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/** Header interne pour détecter qu'on est déjÃ  en ré-essai â†’ évite la boucle infinie */
const RETRY_HEADER = 'X-Auth-Retry';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);

    // Si c'est déjÃ  un ré-essai, on ne relance PAS un refresh â€” on laisse l'erreur remonter
    if (req.headers.has(RETRY_HEADER)) {
        const cleanReq = req.clone({ headers: req.headers.delete(RETRY_HEADER) });
        return next(cleanReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) { auth.logout(); }
                return throwError(() => err);
            })
        );
    }

    const token = auth.accessToken;
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401 && !req.url.includes('/auth/')) {
                return auth.refreshToken().pipe(
                    switchMap(res => {
                        const retried = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.accessToken}`,
                                [RETRY_HEADER]: '1',
                            }
                        });
                        return next(retried);
                    }),
                    catchError(refreshErr => {
                        auth.logout();
                        return throwError(() => refreshErr);
                    })
                );
            }
            return throwError(() => err);
        })
    );
};
