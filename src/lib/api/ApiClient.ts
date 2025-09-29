import type { Account, CreateAccountRequest, TransactionRequest } from '$lib/api/types';
import type { HttpClient } from '$lib/http/HttpClient';

export class ApiClient {
	constructor(private httpClient: HttpClient) {}

	async getAccount(accountId: number): Promise<Account> {
		return await this.httpClient.get<Account>(`/api/accounts/${accountId}`);
	}

	async createAccount(request: CreateAccountRequest): Promise<Account> {
		return await this.httpClient.post<Account, CreateAccountRequest>('/api/accounts', request);
	}

	async createTransaction(request: TransactionRequest): Promise<void> {
		await this.httpClient.post<void, TransactionRequest>('/api/transactions', request);
	}
}
