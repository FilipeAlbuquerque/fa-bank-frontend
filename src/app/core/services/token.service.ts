import { Injectable, computed, signal } from '@angular/core';

interface JwtPayload {
  sub:   string;
  roles: string[];
  exp:   number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'fa_bank_token';

  private readonly _rawToken = signal<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  // ── Derived signals ───────────────────────────────────

  readonly username = computed<string>(() => this.decode()?.sub ?? '');
  readonly roles    = computed<string[]>(() => this.decode()?.roles ?? []);
  readonly isAdmin  = computed<boolean>(() => this.roles().includes('ROLE_ADMIN'));

  // ── Mutations ─────────────────────────────────────────

  setToken(token: string): void {
    this._rawToken.set(token);
  }

  clearToken(): void {
    this._rawToken.set(null);
  }

  // ── Helpers ───────────────────────────────────────────

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  isExpired(): boolean {
    const exp = this.decode()?.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }

  private decode(): JwtPayload | null {
    const token = this._rawToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)) as JwtPayload;
    } catch {
      return null;
    }
  }
}
