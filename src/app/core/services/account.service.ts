import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account, Transaction, Statement, Page } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  /** Returns the authenticated user's accounts (ROLE_USER or ROLE_ADMIN). */
  getMyAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts/me`);
  }

  /** Returns all transactions for an account the user owns. */
  getTransactions(accountNumber: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/transactions/account/${accountNumber}`
    );
  }

  /** Returns paginated transactions for an account the user owns. */
  getTransactionsPaginated(
    accountNumber: string,
    page = 0,
    size = 10,
    sort = 'createdAt,desc'
  ): Observable<Page<Transaction>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);
    return this.http.get<Page<Transaction>>(
      `${this.baseUrl}/transactions/account/${accountNumber}/paginated`,
      { params }
    );
  }

  /** Returns a statement for an account between two ISO date-time strings. */
  getStatement(
    accountNumber: string,
    startDate: string,
    endDate: string
  ): Observable<Statement> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Statement>(
      `${this.baseUrl}/transactions/account/${accountNumber}/statement`,
      { params }
    );
  }
}
