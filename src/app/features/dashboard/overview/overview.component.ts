import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
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
import { VisibilityService } from '../../../core/services/visibility.service';

export interface Account {
  id:       string;
  label:    string;
  type:     'checking' | 'savings';
  iban:     string;
  balance:  number;
  currency: string;
}

export interface Transaction {
  id:          string;
  description: string;
  amount:      number;
  date:        string;
  type:        'credit' | 'debit';
  category:    string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, DecimalPipe, LucideAngularModule, RouterLink],
  templateUrl: './overview.component.html',
  styleUrl:    './overview.component.scss',
})
export class OverviewComponent {
  readonly visibility = inject(VisibilityService);

  readonly icons = {
    TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
    ArrowLeftRight, CreditCard, PiggyBank,
  };

  // ── Mock data (will be replaced by API calls) ──────────

  readonly accounts: Account[] = [
    {
      id:       'acc-001',
      label:    'Main Account',
      type:     'checking',
      iban:     'PT50 0023 0000 1234 5678 9015 4',
      balance:  12_450.80,
      currency: 'EUR',
    },
    {
      id:       'acc-002',
      label:    'Savings',
      type:     'savings',
      iban:     'PT50 0023 0000 9876 5432 1015 4',
      balance:  34_200.00,
      currency: 'EUR',
    },
  ];

  readonly recentTransactions: Transaction[] = [
    { id: 't1', description: 'Salary — Acme Corp',       amount:  4_500.00, date: '2026-04-03', type: 'credit', category: 'Income'       },
    { id: 't2', description: 'Electricity Bill',          amount:   -82.50,  date: '2026-04-02', type: 'debit',  category: 'Utilities'     },
    { id: 't3', description: 'Transfer to Savings',       amount: -1_000.00, date: '2026-04-01', type: 'debit',  category: 'Transfer'      },
    { id: 't4', description: 'Supermarket',               amount:   -156.30, date: '2026-03-31', type: 'debit',  category: 'Groceries'     },
    { id: 't5', description: 'Freelance Invoice #42',     amount:  1_200.00, date: '2026-03-29', type: 'credit', category: 'Income'        },
  ];

  get totalBalance(): number {
    return this.accounts.reduce((sum, a) => sum + a.balance, 0);
  }

  get monthlyIncome(): number {
    return this.recentTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get monthlyExpenses(): number {
    return Math.abs(
      this.recentTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0)
    );
  }

  maskValue(value: number, decimals = 2): string {
    return '••••••';
  }

  formatIban(iban: string): string {
    if (!this.visibility.valuesVisible()) return '•••• •••• •••• ••••';
    return iban;
  }

  accountIcon(type: Account['type']): LucideIconData {
    return type === 'savings' ? this.icons.PiggyBank : this.icons.CreditCard;
  }
}
