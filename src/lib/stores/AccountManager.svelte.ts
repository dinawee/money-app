import type { ApiClient } from '../api/ApiClient';
import type { Account } from '../api/types';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

export class AccountManager {
	public accounts = $state(new SvelteMap<number, Account>());
	private pendingOperations = $state(new SvelteSet<number>());
	private lastError = $state<Error | null>(null);

	public loading = $derived(this.pendingOperations.size > 0);
	public error = $derived(this.lastError);

	constructor(private apiClient: ApiClient) {}

	async loadAccount(accountId: number): Promise<void> {
		this.pendingOperations.add(accountId);
		this.lastError = null;

		try {
			const account = await this.apiClient.getAccount(accountId);
			this.accounts.set(accountId, account);
		} catch (error) {
			this.lastError = error as Error;
		} finally {
			this.pendingOperations.delete(accountId);
		}
	}
}
