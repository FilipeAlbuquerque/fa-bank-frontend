import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  LucideIconData,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  CreditCard,
  PiggyBank,
} from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VisibilityService } from '../../../core/services/visibility.service';
import { AccountService } from '../../../core/services/account.service';
import { Account, Transaction, AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, LucideAngularModule, RouterLink],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  readonly visibility     = inject(VisibilityService);
  private readonly accountService = inject(AccountService);

  readonly icons = {
    TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
    ArrowLeftRight, CreditCard, PiggyBank,
  };

  readonly accounts     = signal<Account[]>([]);
  readonly transactions = signal<Transaction[]>([]);
  readonly loading      = signal(true);
  readonly error        = signal<string | null>(null);

  readonly totalBalance = computed(() =>
    this.accounts().reduce((sum, a) => sum + a.balance, 0)
  );

  readonly monthlyIncome = computed(() =>
    this.transactions()
      .filter(t => this.txIsCredit(t))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  readonly monthlyExpenses = computed(() =>
    this.transactions()
      .filter(t => !this.txIsCredit(t))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  ngOnInit(): void {
    this.accountService.getMyAccounts().subscribe({
      next: accounts => {
        this.accounts.set(accounts);

        if (accounts.length === 0) {
          this.loading.set(false);
          return;
        }

        // Load recent transactions from the first account
        this.accountService
          .getTransactionsPaginated(accounts[0].accountNumber, 0, 5)
          .pipe(catchError(() => of({ content: [] } as any)))
          .subscribe(page => {
            this.transactions.set(page.content);
            this.loading.set(false);
          });
      },
      error: () => {
        this.error.set('Failed to load account data.');
        this.loading.set(false);
      },
    });
  }

  accountLabel(account: Account): string {
    const labels: Record<string, string> = {
      CHECKING: 'Checking Account',
      SAVINGS: 'Savings Account',
    };
    return labels[account.type] ?? account.type;
  }

  accountIcon(type: AccountType): LucideIconData {
    return type === 'SAVINGS' ? this.icons.PiggyBank : this.icons.CreditCard;
  }

  maskedNumber(accountNumber: string): string {
    if (!this.visibility.valuesVisible()) return '•••• •••• ••••';
    return accountNumber.replaceAll(/(\d{4})(?=\d)/g, '$1 ');
  }

  txIsCredit(tx: Transaction): boolean {
    return tx.type === 'DEPOSIT';
  }

  txIcon(tx: Transaction): LucideIconData {
    return this.txIsCredit(tx) ? this.icons.ArrowDownLeft : this.icons.ArrowUpRight;
  }
}
