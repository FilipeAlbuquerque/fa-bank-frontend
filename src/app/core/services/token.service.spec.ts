import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

/** Builds a minimal JWT with the given payload (no real signature). */
function makeToken(payload: object): string {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

const futureExp  = Math.floor(Date.now() / 1000) + 3600;
const pastExp    = Math.floor(Date.now() / 1000) - 3600;

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Initial state ──────────────────────────────────────

  it('username should be empty when no token', () => {
    expect(service.username()).toBe('');
  });

  it('roles should be empty array when no token', () => {
    expect(service.roles()).toEqual([]);
  });

  it('isAdmin should be false when no token', () => {
    expect(service.isAdmin()).toBe(false);
  });

  it('isExpired should be true when no token', () => {
    expect(service.isExpired()).toBe(true);
  });

  // ── After setToken ─────────────────────────────────────

  it('should expose username from JWT payload', () => {
    service.setToken(makeToken({ sub: 'john', roles: ['ROLE_USER'], exp: futureExp }));
    expect(service.username()).toBe('john');
  });

  it('should expose roles from JWT payload', () => {
    service.setToken(makeToken({ sub: 'john', roles: ['ROLE_USER'], exp: futureExp }));
    expect(service.roles()).toEqual(['ROLE_USER']);
  });

  it('isAdmin should be false for ROLE_USER', () => {
    service.setToken(makeToken({ sub: 'john', roles: ['ROLE_USER'], exp: futureExp }));
    expect(service.isAdmin()).toBe(false);
  });

  it('isAdmin should be true for ROLE_ADMIN', () => {
    service.setToken(makeToken({ sub: 'admin', roles: ['ROLE_ADMIN'], exp: futureExp }));
    expect(service.isAdmin()).toBe(true);
  });

  it('hasRole should return true for a matching role', () => {
    service.setToken(makeToken({ sub: 'john', roles: ['ROLE_USER'], exp: futureExp }));
    expect(service.hasRole('ROLE_USER')).toBe(true);
  });

  it('hasRole should return false for a non-matching role', () => {
    service.setToken(makeToken({ sub: 'john', roles: ['ROLE_USER'], exp: futureExp }));
    expect(service.hasRole('ROLE_ADMIN')).toBe(false);
  });

  it('isExpired should be false for a future exp', () => {
    service.setToken(makeToken({ sub: 'john', roles: [], exp: futureExp }));
    expect(service.isExpired()).toBe(false);
  });

  it('isExpired should be true for a past exp', () => {
    service.setToken(makeToken({ sub: 'john', roles: [], exp: pastExp }));
    expect(service.isExpired()).toBe(true);
  });

  // ── clearToken ─────────────────────────────────────────

  it('should clear all derived values after clearToken', () => {
    service.setToken(makeToken({ sub: 'john', roles: ['ROLE_ADMIN'], exp: futureExp }));
    service.clearToken();
    expect(service.username()).toBe('');
    expect(service.roles()).toEqual([]);
    expect(service.isAdmin()).toBe(false);
  });

  // ── Invalid token ──────────────────────────────────────

  it('should return empty values for a malformed token', () => {
    service.setToken('not.a.validtoken!@#');
    expect(service.username()).toBe('');
    expect(service.roles()).toEqual([]);
  });
});
