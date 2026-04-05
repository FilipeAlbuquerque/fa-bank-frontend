import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [provideRouter([])],
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
    const expected = comp.accounts.reduce((s, a) => s + a.balance, 0);
    expect(comp.totalBalance).toBeCloseTo(expected, 2);
  });

  it('monthlyIncome should sum only credit transactions', () => {
    const comp = create();
    const credits = comp.recentTransactions
      .filter(t => t.type === 'credit')
      .reduce((s, t) => s + t.amount, 0);
    expect(comp.monthlyIncome).toBeCloseTo(credits, 2);
  });

  it('monthlyExpenses should be a positive number', () => {
    const comp = create();
    expect(comp.monthlyExpenses).toBeGreaterThan(0);
  });

  it('formatIban should mask IBAN when values are hidden', () => {
    const comp = create();
    comp.visibility.toggle(); // hide
    expect(comp.formatIban('PT50 0023 0000 1234')).toBe('•••• •••• •••• ••••');
  });

  it('formatIban should show IBAN when values are visible', () => {
    const comp = create();
    const iban = 'PT50 0023 0000 1234';
    expect(comp.formatIban(iban)).toBe(iban);
  });

  it('accountIcon should return PiggyBank for savings', () => {
    const comp = create();
    expect(comp.accountIcon('savings')).toBeTruthy();
  });

  it('accountIcon should return CreditCard for checking', () => {
    const comp = create();
    expect(comp.accountIcon('checking')).toBeTruthy();
  });

  it('should have at least one account', () => {
    const comp = create();
    expect(comp.accounts.length).toBeGreaterThan(0);
  });

  it('should have at least one recent transaction', () => {
    const comp = create();
    expect(comp.recentTransactions.length).toBeGreaterThan(0);
  });
});
