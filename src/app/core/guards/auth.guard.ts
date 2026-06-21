import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const auth   = inject(AuthService);
    const router = inject(Router);
    if (auth.isLogged()) return true;
    router.navigate(['/connexion']);
    return false;
};

export const guestGuard: CanActivateFn = () => {
    const auth   = inject(AuthService);
    const router = inject(Router);
    if (!auth.isLogged()) return true;
    router.navigate(['/mon-espace']);
    return false;
};
