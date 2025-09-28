/**
 * API Response Types
 */

/**
 * Account from API responses
 */
export interface Account {
	account_id: number;
	balance: string; // "100.50"
}

/**
 * Request payload for creating new accounts
 */
export interface CreateAccountRequest {
	account_id: number;
	initial_balance: string;
}

/**
 * Request payload for creating transactions
 */
export interface TransactionRequest {
	source_account_id: number;
	destination_account_id: number;
	amount: string;
}

/**
 * Transaction from API responses
 */
export interface Transaction {
	transaction_id: number;
	source_account_id: number;
	destination_account_id: number;
	amount: string;
	timestamp: string;
}
