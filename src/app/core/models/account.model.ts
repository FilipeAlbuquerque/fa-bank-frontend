export type AccountType   = 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'INVESTMENT';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'CLOSED';
export type TransactionType   = 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface Account {
  id:             number;
  accountNumber:  string;
  type:           AccountType;
  balance:        number;
  availableLimit: number | null;
  status:         AccountStatus;
  createdAt:      string;
  ownerId:        number;
  ownerName:      string;
  ownerType:      string;
}

export interface Transaction {
  id:                      number;
  transactionId:           string;
  amount:                  number;
  type:                    TransactionType;
  description:             string | null;
  status:                  TransactionStatus;
  createdAt:               string;
  processedAt:             string | null;
  sourceAccountNumber:     string | null;
  destinationAccountNumber: string | null;
}

export interface Statement {
  accountNumber:      string;
  accountType:        AccountType;
  currentBalance:     number;
  statementStartDate: string;
  statementEndDate:   string;
  generatedAt:        string;
  transactions:       Transaction[];
}

export interface Page<T> {
  content:          T[];
  totalElements:    number;
  totalPages:       number;
  number:           number;   // current page (0-based)
  size:             number;
  first:            boolean;
  last:             boolean;
}
