import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Send, ArrowRightLeft, ChevronDown, AlertCircle, CheckCircle,
} from 'lucide-angular';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../../core/services/account.service';
import { VisibilityService } from '../../../core/services/visibility.service';
import { Account, AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ReactiveFormsModule, LucideAngularModule, SelectModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
})
export class TransferComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly fb             = inject(FormBuilder);
  readonly visibility             = inject(VisibilityService);

  readonly icons = { Send, ArrowRightLeft, ChevronDown, AlertCircle, CheckCircle };

  readonly accounts    = signal<Account[]>([]);
  readonly loading     = signal(true);
  readonly submitting  = signal(false);
  readonly error       = signal<string | null>(null);
  readonly successTxId = signal<string | null>(null);

  static readonly ACCOUNT_MAX = 20;
  static readonly AMOUNT_MAX  = 999_999.99;
  static readonly DESC_MAX    = 100;

  readonly ACCOUNT_MAX = TransferComponent.ACCOUNT_MAX;
  readonly AMOUNT_MAX  = TransferComponent.AMOUNT_MAX;
  readonly DESC_MAX    = TransferComponent.DESC_MAX;

  readonly form = this.fb.group({
    sourceAccount: [null as Account | null, Validators.required],
    destinationAccountNumber: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(TransferComponent.ACCOUNT_MAX),
    ]],
    amount: ['', [Validators.required, this.amountValidator()]],
    description: ['', Validators.maxLength(TransferComponent.DESC_MAX)],
  });

  private readonly formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  readonly sourceBalance = computed(() => {
    const acc = this.formValues().sourceAccount as Account | null;
    return acc?.balance ?? null;
  });

  readonly parsedAmount = computed(() =>
    this.parseAmount((this.formValues().amount as string) ?? '')
  );

  readonly exceedsBalance = computed(() => {
    const amount  = this.parsedAmount();
    const balance = this.sourceBalance();
    return balance !== null && amount !== null && amount > balance;
  });

  readonly descLength = computed(() =>
    (this.formValues().description ?? '').length
  );

  /**
   * Parses user-typed amount strings into a number, handling:
   *   1,000.00  (US: comma=thousands, dot=decimal)
   *   1.000,00  (EU: dot=thousands, comma=decimal)
   *   1500,99   (comma=decimal)
   *   1500.99   (dot=decimal)
   *   1,000     (comma=thousands → 1000)
   *   1.000     (dot=thousands → 1000)
   *   1000      (plain)
   */
  parseAmount(raw: string): number | null {
    if (!raw || !raw.trim()) return null;
    const s = raw.trim();

    let normalized: string;

    const hasComma = s.includes(',');
    const hasDot   = s.includes('.');

    if (hasComma && hasDot) {
      const lastComma = s.lastIndexOf(',');
      const lastDot   = s.lastIndexOf('.');
      if (lastComma > lastDot) {
        // EU format: 1.000,99
        normalized = s.replace(/\./g, '').replace(',', '.');
      } else {
        // US format: 1,000.99
        normalized = s.replace(/,/g, '');
      }
    } else if (hasComma) {
      const afterComma = s.slice(s.lastIndexOf(',') + 1);
      if (afterComma.length === 3 && /^\d+$/.test(afterComma)) {
        // Thousands: 1,000
        normalized = s.replace(/,/g, '');
      } else {
        // Decimal: 1500,99
        normalized = s.replace(',', '.');
      }
    } else if (hasDot) {
      const afterDot = s.slice(s.lastIndexOf('.') + 1);
      if (afterDot.length === 3 && /^\d+$/.test(afterDot) && s.split('.').length === 2) {
        // Thousands: 1.000
        normalized = s.replace(/\./g, '');
      } else {
        // Decimal: 1500.99
        normalized = s;
      }
    } else {
      normalized = s;
    }

    const val = parseFloat(normalized);
    if (isNaN(val)) return null;
    return Math.round(val * 100) / 100;
  }

  private amountValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const raw = (control.value as string | null) ?? '';
      if (!raw.trim()) return null; // required handles empty

      const val = this.parseAmount(raw);
      if (val === null) return { invalidAmount: true };
      if (val < 0.01) return { min: true };
      if (val > TransferComponent.AMOUNT_MAX) return { max: true };
      return null;
    };
  }

  ngOnInit(): void {
    this.accountService.getMyAccounts().subscribe({
      next: accounts => {
        this.accounts.set(accounts.filter(a => a.status === 'ACTIVE'));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load accounts.');
        this.loading.set(false);
      },
    });
  }

  accountLabel(account: Account): string {
    const labels: Record<AccountType, string> = {
      CHECKING: 'Checking', SAVINGS: 'Savings',
      BUSINESS: 'Business', INVESTMENT: 'Investment',
    };
    const type = labels[account.type] ?? account.type;
    const last4 = account.accountNumber.slice(-4);
    return `${type} ···${last4}`;
  }

  submit(): void {
    if (this.form.invalid || this.submitting() || this.exceedsBalance()) return;

    const { sourceAccount, destinationAccountNumber, description } = this.form.value;
    const amount = this.parsedAmount();
    if (!sourceAccount || !destinationAccountNumber || !amount) return;

    this.submitting.set(true);
    this.error.set(null);
    this.successTxId.set(null);

    this.accountService.transfer({
      sourceAccountNumber: sourceAccount.accountNumber,
      destinationAccountNumber: destinationAccountNumber.trim(),
      amount,
      description: description || undefined,
    }).subscribe({
      next: tx => {
        this.successTxId.set(tx.transactionId);
        this.submitting.set(false);
        this.form.reset();
      },
      error: err => {
        const msg = err?.error?.message ?? err?.error ?? 'Transfer failed. Please try again.';
        this.error.set(typeof msg === 'string' ? msg : 'Transfer failed. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  newTransfer(): void {
    this.successTxId.set(null);
    this.error.set(null);
  }
}
