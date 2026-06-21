import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  
  // Ignorer certaines requêtes en arrière-plan si nécessaire
  // if (req.url.includes('/api/background')) return next(req);

  loaderService.show();
  
  return next(req).pipe(
    finalize(() => {
      loaderService.hide();
    })
  );
};
