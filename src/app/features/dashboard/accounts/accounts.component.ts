import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, LucideIconData, CreditCard, PiggyBank, TrendingUp, ChevronRight, RefreshCw } from 'lucide-angular';
import { AccountService } from '../../../core/services/account.service';
import { VisibilityService } from '../../../core/services/visibility.service';
import { Account, AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, DecimalPipe, LucideAngularModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly router         = inject(Router);
  readonly visibility             = inject(VisibilityService);

  readonly icons = { CreditCard, PiggyBank, TrendingUp, ChevronRight, RefreshCw };

  readonly accounts = signal<Account[]>([]);
  readonly loading  = signal(true);
  readonly error    = signal<string | null>(null);

  readonly totalBalance = computed(() =>
    this.accounts().reduce((sum, a) => sum + a.balance, 0)
  );

  readonly activeCount = computed(() =>
    this.accounts().filter(a => a.status === 'ACTIVE').length
  );

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.accountService.getMyAccounts().subscribe({
      next: accounts => {
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load accounts. Please try again.');
        this.loading.set(false);
      },
    });
  }

  openDetail(account: Account): void {
    this.router.navigate(['/dashboard/accounts', account.accountNumber]);
  }

  accountIcon(type: AccountType): LucideIconData {
    if (type === 'SAVINGS' || type === 'INVESTMENT') return this.icons.PiggyBank;
    return this.icons.CreditCard;
  }

  typeLabel(type: AccountType): string {
    const labels: Record<AccountType, string> = {
      CHECKING:   'Checking',
      SAVINGS:    'Savings',
      BUSINESS:   'Business',
      INVESTMENT: 'Investment',
    };
    return labels[type] ?? type;
  }

  maskedNumber(accountNumber: string): string {
    if (!this.visibility.valuesVisible()) return '•••• •••• ••••';
    const n = accountNumber.replace(/\D/g, '');
    return n.length >= 4 ? `•••• •••• ${n.slice(-4)}` : accountNumber;
  }
}
