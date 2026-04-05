import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  readonly form = this.fb.group({
    sourceAccount:            [null as Account | null, Validators.required],
    destinationAccountNumber: ['', [Validators.required, Validators.minLength(5)]],
    amount:                   [null as number | null, [Validators.required, Validators.min(0.01)]],
    description:              [''],
  });

  readonly sourceBalance = computed(() => {
    const acc = this.form.get('sourceAccount')?.value as Account | null;
    return acc?.balance ?? null;
  });

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
    if (this.form.invalid || this.submitting()) return;

    const { sourceAccount, destinationAccountNumber, amount, description } = this.form.value;
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
