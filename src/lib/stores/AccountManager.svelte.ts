import type { ApiClient } from '$lib/api/ApiClient';
import type { Account, CreateAccountRequest, TransactionRequest } from '$lib/api/types';
import { SvelteMap } from 'svelte/reactivity';

export class AccountManager {
	public accounts = $state(new SvelteMap<number, Account>());
	private lastError = $state<Error | null>(null);

	public error = $derived(this.lastError);

	constructor(private apiClient: ApiClient) {}

	async loadAccount(accountId: number): Promise<void> {
		this.lastError = null;

		try {
			const account = await this.apiClient.getAccount(accountId);
			this.accounts.set(accountId, account);
		} catch (error) {
			this.lastError = error as Error;
		}
	}

	async createAccount(request: CreateAccountRequest): Promise<Account> {
		this.lastError = null;

		try {
			const account = await this.apiClient.createAccount(request);
			this.accounts.set(account.account_id, account);
			return account;
		} catch (error) {
			this.lastError = error as Error;
			throw error;
		}
	}

	async createTransaction(request: TransactionRequest): Promise<void> {
		this.lastError = null;

		try {
			await this.apiClient.createTransaction(request);

			// Refresh both accounts after successful transaction
			await Promise.all([
				this.loadAccount(request.source_account_id),
				this.loadAccount(request.destination_account_id)
			]);
		} catch (error) {
			this.lastError = error as Error;
			throw error;
		}
	}
}
