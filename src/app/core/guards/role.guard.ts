import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Factory guard that restricts a route to users with at least one of the required roles.
 * Redirects to /dashboard/overview if the user lacks the required role.
 *
 * Usage in routes:
 *   canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]
 */
export const roleGuard = (requiredRoles: string[]): CanActivateFn =>
  () => {
    const tokenService = inject(TokenService);
    const router       = inject(Router);
    const hasAccess    = requiredRoles.some(r => tokenService.hasRole(r));
    return hasAccess ? true : router.createUrlTree(['/dashboard/overview']);
  };
