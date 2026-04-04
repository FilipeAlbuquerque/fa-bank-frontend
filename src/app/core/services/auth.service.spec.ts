import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService, AuthResponse } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockResponse: AuthResponse = {
    token: 'mock-jwt-token',
    username: 'testuser',
    roles: ['ROLE_USER'],
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', component: {} as never }]),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('hasToken() should return false when no token is stored', () => {
    expect(service.hasToken()).toBe(false);
  });

  it('getToken() should return null when no token is stored', () => {
    expect(service.getToken()).toBeNull();
  });

  it('login() should POST credentials and store the token', () => {
    let result: AuthResponse | undefined;

    service.login({ username: 'testuser', password: 'secret' }).subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'secret' });
    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
    expect(service.getToken()).toBe('mock-jwt-token');
    expect(service.hasToken()).toBe(true);
  });

  it('login() should emit true on isLoggedIn$ after success', () => {
    let loggedIn = false;
    service.isLoggedIn$.subscribe((v) => (loggedIn = v));

    service.login({ username: 'testuser', password: 'secret' }).subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);

    expect(loggedIn).toBe(true);
  });

  it('logout() should remove the token and emit false on isLoggedIn$', () => {
    localStorage.setItem('fa_bank_token', 'some-token');
    let loggedIn = true;
    service.isLoggedIn$.subscribe((v) => (loggedIn = v));

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.hasToken()).toBe(false);
    expect(loggedIn).toBe(false);
  });

  it('hasToken() should return true when token exists in localStorage', () => {
    localStorage.setItem('fa_bank_token', 'existing-token');
    const freshService = TestBed.inject(AuthService);
    expect(freshService.hasToken()).toBe(true);
  });
});
