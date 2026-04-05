import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AccountsComponent } from './accounts.component';
import { AccountService } from '../../../core/services/account.service';
import { Account } from '../../../core/models/account.model';

const mockAccounts: Account[] = [
  { id: 1, accountNumber: 'ACC001', type: 'CHECKING', balance: 1000, availableLimit: 2000,
    status: 'ACTIVE', createdAt: '2026-01-01T00:00:00', ownerId: 1, ownerName: 'John', ownerType: 'CLIENT' },
  { id: 2, accountNumber: 'ACC002', type: 'SAVINGS', balance: 5000, availableLimit: null,
    status: 'ACTIVE', createdAt: '2026-01-01T00:00:00', ownerId: 1, ownerName: 'John', ownerType: 'CLIENT' },
];

describe('AccountsComponent', () => {
  let accountService: AccountService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsComponent],
      providers: [
        provideRouter([{ path: 'dashboard/accounts/:accountNumber', component: {} as never }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    accountService = TestBed.inject(AccountService);
  });

  const create = () => {
    vi.spyOn(accountService, 'getMyAccounts').mockReturnValue(of(mockAccounts));
    const fixture = TestBed.createComponent(AccountsComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  };

  it('should create', () => expect(create()).toBeTruthy());

  it('should load accounts on init', () => {
    const comp = create();
    expect(comp.accounts()).toEqual(mockAccounts);
    expect(comp.loading()).toBe(false);
  });

  it('totalBalance should sum all account balances', () => {
    const comp = create();
    expect(comp.totalBalance()).toBeCloseTo(6000, 2);
  });

  it('activeCount should count ACTIVE accounts', () => {
    const comp = create();
    expect(comp.activeCount()).toBe(2);
  });

  it('typeLabel should return human-readable labels', () => {
    const comp = create();
    expect(comp.typeLabel('CHECKING')).toBe('Checking');
    expect(comp.typeLabel('SAVINGS')).toBe('Savings');
    expect(comp.typeLabel('BUSINESS')).toBe('Business');
    expect(comp.typeLabel('INVESTMENT')).toBe('Investment');
  });

  it('maskedNumber should show last 4 digits when visible', () => {
    const comp = create();
    expect(comp.maskedNumber('ACC001')).toContain('001');
  });

  it('maskedNumber should mask when values hidden', () => {
    const comp = create();
    comp.visibility.toggle();
    expect(comp.maskedNumber('ACC001')).toBe('•••• •••• ••••');
  });

  it('should set error on service failure', () => {
    vi.spyOn(accountService, 'getMyAccounts').mockReturnValue(throwError(() => new Error('fail')));
    const fixture = TestBed.createComponent(AccountsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBeTruthy();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should show empty state when no accounts', () => {
    vi.spyOn(accountService, 'getMyAccounts').mockReturnValue(of([]));
    const fixture = TestBed.createComponent(AccountsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.accounts().length).toBe(0);
  });
});
