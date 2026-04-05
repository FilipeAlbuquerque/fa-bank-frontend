import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { roleGuard } from './role.guard';
import { TokenService } from '../services/token.service';

function makeToken(roles: string[]): string {
  const body = btoa(JSON.stringify({ sub: 'user', roles, exp: Date.now() + 3600 }));
  return `header.${body}.sig`;
}

describe('roleGuard', () => {
  let tokenService: TokenService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard/overview', component: {} as never },
          { path: 'dashboard/admin',    component: {} as never, canActivate: [roleGuard(['ROLE_ADMIN'])] },
        ]),
      ],
    });
    tokenService = TestBed.inject(TokenService);
    router       = TestBed.inject(Router);
  });

  afterEach(() => localStorage.clear());

  it('should allow access when user has required role', () => {
    tokenService.setToken(makeToken(['ROLE_ADMIN']));
    const guardFn = roleGuard(['ROLE_ADMIN']);
    const result  = TestBed.runInInjectionContext(() => guardFn({} as never, {} as never));
    expect(result).toBe(true);
  });

  it('should redirect when user lacks required role', () => {
    tokenService.setToken(makeToken(['ROLE_USER']));
    const guardFn = roleGuard(['ROLE_ADMIN']);
    const result  = TestBed.runInInjectionContext(() => guardFn({} as never, {} as never));
    expect(result).not.toBe(true);
    expect((result as ReturnType<Router['createUrlTree']>).toString()).toContain('dashboard/overview');
  });

  it('should allow access if user has any of the required roles', () => {
    tokenService.setToken(makeToken(['ROLE_USER', 'ROLE_ADMIN']));
    const guardFn = roleGuard(['ROLE_ADMIN', 'ROLE_MANAGER']);
    const result  = TestBed.runInInjectionContext(() => guardFn({} as never, {} as never));
    expect(result).toBe(true);
  });

  it('should redirect when token has no roles', () => {
    tokenService.clearToken();
    const guardFn = roleGuard(['ROLE_ADMIN']);
    const result  = TestBed.runInInjectionContext(() => guardFn({} as never, {} as never));
    expect(result).not.toBe(true);
  });
});
