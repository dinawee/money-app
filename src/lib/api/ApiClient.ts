import type { HttpClient } from '../http/HttpClient';
import type { Account, CreateAccountRequest, TransactionRequest } from '$lib/api/types';

export class ApiClient {
	constructor(private httpClient: HttpClient) {}

	async getAccount(accountId: number): Promise<Account> {
		return await this.httpClient.get<Account>(`/accounts/${accountId}`);
	}

	async createAccount(request: CreateAccountRequest): Promise<Account> {
		return await this.httpClient.post<Account, CreateAccountRequest>('/accounts', request);
	}

	async createTransaction(request: TransactionRequest): Promise<void> {
		await this.httpClient.post<void, TransactionRequest>('/transactions', request);
	}
}
