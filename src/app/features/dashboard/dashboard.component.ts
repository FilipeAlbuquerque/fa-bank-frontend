import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideAngularModule,
  LucideIconData,
  Building2,
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  User,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
  Menu,
  X,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { VisibilityService } from '../../core/services/visibility.service';
import { TokenService } from '../../core/services/token.service';

interface NavItem {
  label: string;
  path:  string;
  icon:  LucideIconData;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl:    './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  readonly visibility   = inject(VisibilityService);
  readonly tokenService = inject(TokenService);

  readonly icons = { Building2, LayoutDashboard, CreditCard, ArrowLeftRight, User, ShieldCheck, LogOut, Eye, EyeOff, Menu, X };

  readonly mobileMenuOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Overview',     path: '/dashboard/overview',  icon: LayoutDashboard },
    { label: 'Accounts',     path: '/dashboard/accounts',  icon: CreditCard      },
    { label: 'Transfers',    path: '/dashboard/transfer',  icon: ArrowLeftRight  },
    { label: 'Profile',      path: '/dashboard/profile',   icon: User            },
  ];

  toggleVisibility(): void {
    this.visibility.toggle();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.mobileMenuOpen.set(false);
  }
}
