import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OverviewComponent } from './overview.component';
import { AccountService } from '../../../core/services/account.service';
import { Account, Transaction } from '../../../core/models/account.model';

const mockAccounts: Account[] = [
  {
    id: 1, accountNumber: '1234567890', type: 'CHECKING', balance: 1000,
    availableLimit: 500, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00',
    ownerId: 1, ownerName: 'Test', ownerType: 'CLIENT',
  },
  {
    id: 2, accountNumber: '0987654321', type: 'SAVINGS', balance: 2000,
    availableLimit: null, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00',
    ownerId: 1, ownerName: 'Test', ownerType: 'CLIENT',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 1, transactionId: 'tx1', amount: 500, type: 'DEPOSIT',
    description: 'Salary', status: 'COMPLETED', createdAt: '2026-04-01T00:00:00',
    processedAt: null, sourceAccountNumber: null, destinationAccountNumber: '1234567890',
  },
  {
    id: 2, transactionId: 'tx2', amount: 100, type: 'WITHDRAWAL',
    description: 'ATM', status: 'COMPLETED', createdAt: '2026-04-02T00:00:00',
    processedAt: null, sourceAccountNumber: '1234567890', destinationAccountNumber: null,
  },
];

const mockPage = {
  content: mockTransactions, totalElements: 2, totalPages: 1,
  number: 0, size: 5, first: true, last: true,
};

describe('OverviewComponent', () => {
  let accountServiceMock: {
    getMyAccounts: ReturnType<typeof vi.fn>;
    getTransactionsPaginated: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    accountServiceMock = {
      getMyAccounts: vi.fn().mockReturnValue(of(mockAccounts)),
      getTransactionsPaginated: vi.fn().mockReturnValue(of(mockPage)),
    };

    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [
        provideRouter([]),
        { provide: AccountService, useValue: accountServiceMock },
      ],
    }).compileComponents();
  });

  const create = () => {
    const fixture = TestBed.createComponent(OverviewComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  };

  it('should create', () => {
    expect(create()).toBeTruthy();
  });

  it('totalBalance should sum all account balances', () => {
    const comp = create();
    expect(comp.totalBalance()).toBeCloseTo(3000, 2);
  });

  it('monthlyIncome should sum only DEPOSIT transactions', () => {
    const comp = create();
    expect(comp.monthlyIncome()).toBeCloseTo(500, 2);
  });

  it('monthlyExpenses should sum only non-DEPOSIT transactions', () => {
    const comp = create();
    expect(comp.monthlyExpenses()).toBeCloseTo(100, 2);
  });

  it('maskedNumber should mask when values are hidden', () => {
    const comp = create();
    comp.visibility.toggle();
    expect(comp.maskedNumber('1234567890')).toBe('•••• •••• ••••');
  });

  it('maskedNumber should return value when values are visible', () => {
    const comp = create();
    expect(comp.maskedNumber('1234567890')).toBeTruthy();
  });

  it('accountIcon should return icon for SAVINGS', () => {
    const comp = create();
    expect(comp.accountIcon('SAVINGS')).toBeTruthy();
  });

  it('accountIcon should return icon for CHECKING', () => {
    const comp = create();
    expect(comp.accountIcon('CHECKING')).toBeTruthy();
  });

  it('txIsCredit should return true for DEPOSIT', () => {
    const comp = create();
    expect(comp.txIsCredit(mockTransactions[0])).toBe(true);
  });

  it('txIsCredit should return false for WITHDRAWAL', () => {
    const comp = create();
    expect(comp.txIsCredit(mockTransactions[1])).toBe(false);
  });

  it('should load accounts on init', () => {
    const comp = create();
    expect(comp.accounts().length).toBe(2);
  });

  it('should load transactions on init', () => {
    const comp = create();
    expect(comp.transactions().length).toBe(2);
  });
});
