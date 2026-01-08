import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Check role requirements if data passed
    const requiredRole = route.data['role'];
    if (requiredRole && authService.currentUser()?.role !== requiredRole) {
       // Redirect if wrong role
       if (authService.isAdmin()) {
         return router.createUrlTree(['/admin/dashboard']);
       } else {
         return router.createUrlTree(['/dashboard']);
       }
    }
    return true;
  }

  return router.createUrlTree(['/login']);
};
