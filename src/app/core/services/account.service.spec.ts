import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { Account, Transaction, Statement, Page } from '../models/account.model';
import { environment } from '../../../environments/environment';

const BASE = environment.apiUrl;

const mockAccount: Account = {
  id: 1, accountNumber: 'ACC001', iban: 'PT50 0033 0001 0000 0ACC0 01', type: 'CHECKING', balance: 1000,
  availableLimit: 2000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00',
  ownerId: 1, ownerName: 'John', ownerType: 'CLIENT',
};

const mockTx: Transaction = {
  id: 1, transactionId: 'TXN001', amount: 100, type: 'DEPOSIT',
  description: 'Test', status: 'COMPLETED', createdAt: '2026-01-01T00:00:00',
  processedAt: null, sourceAccountNumber: null, destinationAccountNumber: 'ACC001',
};

describe('AccountService', () => {
  let service: AccountService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AccountService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getMyAccounts should GET /accounts/me', () => {
    service.getMyAccounts().subscribe(accounts => {
      expect(accounts.length).toBe(1);
      expect(accounts[0].accountNumber).toBe('ACC001');
    });
    const req = http.expectOne(`${BASE}/accounts/me`);
    expect(req.request.method).toBe('GET');
    req.flush([mockAccount]);
  });

  it('getTransactions should GET /transactions/account/{number}', () => {
    service.getTransactions('ACC001').subscribe(txs => {
      expect(txs.length).toBe(1);
    });
    const req = http.expectOne(`${BASE}/transactions/account/ACC001`);
    expect(req.request.method).toBe('GET');
    req.flush([mockTx]);
  });

  it('getTransactionsPaginated should include page/size/sort params', () => {
    service.getTransactionsPaginated('ACC001', 0, 10, 'createdAt,desc').subscribe();
    const req = http.expectOne(r => r.url.includes('/transactions/account/ACC001/paginated'));
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('sort')).toBe('createdAt,desc');
    const page: Page<Transaction> = {
      content: [mockTx], totalElements: 1, totalPages: 1,
      number: 0, size: 10, first: true, last: true,
    };
    req.flush(page);
  });

  it('getStatement should include startDate and endDate params', () => {
    const start = '2026-01-01T00:00:00';
    const end   = '2026-01-31T23:59:59';
    service.getStatement('ACC001', start, end).subscribe();
    const req = http.expectOne(r => r.url.includes('/transactions/account/ACC001/statement'));
    expect(req.request.params.get('startDate')).toBe(start);
    expect(req.request.params.get('endDate')).toBe(end);
    const stmt: Statement = {
      accountNumber: 'ACC001', accountType: 'CHECKING', currentBalance: 1000,
      statementStartDate: start, statementEndDate: end,
      generatedAt: '2026-02-01T00:00:00', transactions: [mockTx],
    };
    req.flush(stmt);
  });
});
