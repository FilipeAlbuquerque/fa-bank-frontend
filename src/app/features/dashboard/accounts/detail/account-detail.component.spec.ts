import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AccountDetailComponent } from './account-detail.component';
import { AccountService } from '../../../../core/services/account.service';
import { Transaction, Page } from '../../../../core/models/account.model';

const mockTx: Transaction = {
  id: 1, transactionId: 'TXN001', amount: 100, type: 'DEPOSIT',
  description: 'Salary', status: 'COMPLETED', createdAt: '2026-04-01T10:00:00',
  processedAt: null, sourceAccountNumber: null, destinationAccountNumber: 'ACC001',
};

const mockPage: Page<Transaction> = {
  content: [mockTx], totalElements: 1, totalPages: 1,
  number: 0, size: 10, first: true, last: true,
};

describe('AccountDetailComponent', () => {
  let accountService: AccountService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'ACC001' } } },
        },
      ],
    }).compileComponents();
    accountService = TestBed.inject(AccountService);
  });

  const create = () => {
    vi.spyOn(accountService, 'getTransactionsPaginated').mockReturnValue(of(mockPage));
    const fixture = TestBed.createComponent(AccountDetailComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  };

  it('should create', () => expect(create()).toBeTruthy());

  it('should load transactions on init', () => {
    const comp = create();
    expect(comp.transactions()).toEqual([mockTx]);
    expect(comp.loading()).toBe(false);
  });

  it('should set accountNumber from route param', () => {
    const comp = create();
    expect(comp.accountNumber()).toBe('ACC001');
  });

  it('txIsCredit should return true for DEPOSIT to own account', () => {
    const comp = create();
    expect(comp.txIsCredit(mockTx)).toBe(true);
  });

  it('txIsCredit should return false for WITHDRAWAL', () => {
    const comp = create();
    const withdrawal: Transaction = { ...mockTx, type: 'WITHDRAWAL', destinationAccountNumber: null };
    expect(comp.txIsCredit(withdrawal)).toBe(false);
  });

  it('maskedAmount should show value when visible', () => {
    const comp = create();
    expect(comp.maskedAmount(100, true)).toBe('+100.00');
    expect(comp.maskedAmount(50, false)).toBe('-50.00');
  });

  it('maskedAmount should mask when values hidden', () => {
    const comp = create();
    comp.visibility.toggle();
    expect(comp.maskedAmount(100, true)).toBe('••••••');
  });

  it('filteredTransactions should filter by type', () => {
    const comp = create();
    comp.filterForm.patchValue({ type: 'WITHDRAWAL' });
    expect(comp.filteredTransactions().length).toBe(0);
    comp.filterForm.patchValue({ type: 'DEPOSIT' });
    expect(comp.filteredTransactions().length).toBe(1);
  });

  it('resetFilters should clear the form', () => {
    const comp = create();
    comp.filterForm.patchValue({ type: 'DEPOSIT', startDate: '2026-01-01' });
    comp.resetFilters();
    expect(comp.filterForm.value.type).toBe('');
    expect(comp.filterForm.value.startDate).toBe('');
  });

  it('should set error on service failure', () => {
    vi.spyOn(accountService, 'getTransactionsPaginated')
      .mockReturnValue(throwError(() => new Error('fail')));
    const fixture = TestBed.createComponent(AccountDetailComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBeTruthy();
  });

  it('nextPage should increment page when not last', () => {
    const comp = create();
    vi.spyOn(comp, 'loadPage');
    comp['totalPages'].set(3);
    comp['currentPage'].set(0);
    comp.nextPage();
    expect(comp.loadPage).toHaveBeenCalledWith(1);
  });

  it('prevPage should decrement page when not first', () => {
    const comp = create();
    vi.spyOn(comp, 'loadPage');
    comp['currentPage'].set(2);
    comp.prevPage();
    expect(comp.loadPage).toHaveBeenCalledWith(1);
  });
});
