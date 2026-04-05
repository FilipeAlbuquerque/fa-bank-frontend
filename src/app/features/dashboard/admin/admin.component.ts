import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShieldCheck } from 'lucide-angular';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="admin-page">
      <div class="admin-header">
        <div class="admin-icon">
          <lucide-icon [img]="ShieldCheck" size="28" />
        </div>
        <div>
          <h1 class="admin-title">Admin Panel</h1>
          <p class="admin-subtitle">Logged in as <strong>{{ tokenService.username() }}</strong> · ROLE_ADMIN</p>
        </div>
      </div>
      <div class="admin-placeholder">
        User management and system settings coming soon.
      </div>
    </div>
  `,
  styles: [`
    .admin-page      { max-width: 900px; }
    .admin-header    { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .admin-icon      { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 12px; background: rgba(139,0,0,0.12); border: 1px solid rgba(139,0,0,0.3); color: #e05555; flex-shrink: 0; }
    .admin-title     { font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 600; color: #f0f0f0; margin: 0 0 0.2rem; }
    .admin-subtitle  { font-size: 0.875rem; color: rgba(240,240,240,0.45); margin: 0; }
    .admin-subtitle strong { color: #C9A227; font-weight: 500; }
    .admin-placeholder { background: #1a1a1a; border: 1px solid rgba(201,162,39,0.18); border-radius: 14px; padding: 2.5rem; text-align: center; color: rgba(240,240,240,0.45); font-size: 0.9rem; }
  `],
})
export class AdminComponent {
  readonly tokenService = inject(TokenService);
  readonly ShieldCheck  = ShieldCheck;
}
