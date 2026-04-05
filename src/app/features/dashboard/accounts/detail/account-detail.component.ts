import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule, LucideIconData,
  ArrowLeft, ArrowDownLeft, ArrowUpRight, ArrowLeftRight,
  ChevronLeft, ChevronRight, Filter,
} from 'lucide-angular';
import { AccountService } from '../../../../core/services/account.service';
import { VisibilityService } from '../../../../core/services/visibility.service';
import { Transaction, TransactionType } from '../../../../core/models/account.model';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss',
})
export class AccountDetailComponent implements OnInit {
  private readonly route          = inject(ActivatedRoute);
  private readonly accountService = inject(AccountService);
  private readonly fb             = inject(FormBuilder);
  readonly visibility             = inject(VisibilityService);

  readonly icons = { ArrowLeft, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ChevronLeft, ChevronRight, Filter };

  readonly accountNumber = signal('');
  readonly transactions  = signal<Transaction[]>([]);
  readonly loading       = signal(true);
  readonly error         = signal<string | null>(null);

  // ── Pagination ────────────────────────────────────────
  readonly currentPage  = signal(0);
  readonly totalPages   = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize     = 10;

  // ── Filters ───────────────────────────────────────────
  readonly filtersOpen = signal(false);

  readonly filterForm = this.fb.group({
    type:      [''],
    startDate: [''],
    endDate:   [''],
  });

  private readonly formValue = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.value,
  });

  readonly txTypes: { value: string; label: string }[] = [
    { value: '',           label: 'All types'   },
    { value: 'DEPOSIT',    label: 'Deposits'    },
    { value: 'WITHDRAWAL', label: 'Withdrawals' },
    { value: 'TRANSFER',   label: 'Transfers'   },
  ];

  readonly filteredTransactions = computed(() => {
    const { type, startDate, endDate } = this.formValue();
    return this.transactions().filter(tx => {
      if (type && tx.type !== type) return false;
      if (startDate && tx.createdAt < startDate) return false;
      if (endDate   && tx.createdAt > endDate + 'T23:59:59') return false;
      return true;
    });
  });

  ngOnInit(): void {
    const number = this.route.snapshot.paramMap.get('accountNumber') ?? '';
    this.accountNumber.set(number);
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.accountService.getTransactionsPaginated(this.accountNumber(), page, this.pageSize).subscribe({
      next: result => {
        this.transactions.set(result.content);
        this.currentPage.set(result.number);
        this.totalPages.set(result.totalPages);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load transactions. Please try again.');
        this.loading.set(false);
      },
    });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) this.loadPage(this.currentPage() + 1);
  }

  prevPage(): void {
    if (this.currentPage() > 0) this.loadPage(this.currentPage() - 1);
  }

  resetFilters(): void {
    this.filterForm.reset({ type: '', startDate: '', endDate: '' });
  }

  txIcon(type: TransactionType): LucideIconData {
    if (type === 'DEPOSIT')  return this.icons.ArrowDownLeft;
    if (type === 'TRANSFER') return this.icons.ArrowLeftRight;
    return this.icons.ArrowUpRight;
  }

  txIsCredit(tx: Transaction): boolean {
    return tx.type === 'DEPOSIT' ||
      (tx.type === 'TRANSFER' && tx.destinationAccountNumber === this.accountNumber());
  }

  maskedAmount(amount: number, isCredit: boolean): string {
    if (!this.visibility.valuesVisible()) return '••••••';
    return (isCredit ? '+' : '-') + Math.abs(amount).toFixed(2);
  }
}
