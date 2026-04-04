import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authServiceMock: { hasToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = { hasToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

  it('should allow access when a token exists', () => {
    authServiceMock.hasToken.mockReturnValue(true);
    expect(runGuard()).toBe(true);
  });

  it('should redirect to /login when no token exists', () => {
    authServiceMock.hasToken.mockReturnValue(false);
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
