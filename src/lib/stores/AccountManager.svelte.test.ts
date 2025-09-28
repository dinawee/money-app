/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountManager } from './AccountManager.svelte';
import type { ApiClient } from '../api/ApiClient';

describe('AccountManager', () => {
	let mockApiClient: ApiClient;

	beforeEach(() => {
		mockApiClient = {
			getAccount: vi.fn(),
			createAccount: vi.fn(),
			createTransaction: vi.fn()
		} as unknown as ApiClient;
	});

	it('should be able to import and instantiate AccountManager class', () => {
		const accountManager = new AccountManager(mockApiClient);

		expect(accountManager).toBeDefined();
		expect(accountManager).toBeInstanceOf(AccountManager);
	});

	it('should expose reactive accounts data using $state rune', () => {
		const accountManager = new AccountManager(mockApiClient);

		expect(accountManager.accounts).toBeDefined();
		expect(accountManager.accounts).toBeInstanceOf(Map);
		expect(accountManager.accounts.size).toBe(0);
	});

	it('should expose $derived loading boolean for UI', () => {
		const accountManager = new AccountManager(mockApiClient);

		expect(accountManager.loading).toBeDefined();
		expect(typeof accountManager.loading).toBe('boolean');
		expect(accountManager.loading).toBe(false);
	});

	it('should expose $derived error state for failed operations', () => {
		const accountManager = new AccountManager(mockApiClient);

		expect(accountManager.error).toBeDefined();
		expect(accountManager.error).toBe(null);
	});

	it('should load account data via injected ApiClient', async () => {
		const mockAccount = { account_id: 1, balance: '100.50' };
		vi.mocked(mockApiClient.getAccount).mockResolvedValue(mockAccount);

		const accountManager = new AccountManager(mockApiClient);
		await accountManager.loadAccount(1);

		expect(mockApiClient.getAccount).toHaveBeenCalledWith(1);
		expect(accountManager.accounts.get(1)).toEqual(mockAccount);
		expect(accountManager.loading).toBe(false);
		expect(accountManager.error).toBe(null);
	});

	it.only('should set loading to true during async operation', async () => {
		const mockAccount = { account_id: 1, balance: '100.50' };
		let resolvePromise: (value: any) => void;
		const delayedPromise = new Promise<typeof mockAccount>((resolve) => {
			resolvePromise = resolve;
		});
		vi.mocked(mockApiClient.getAccount).mockReturnValue(delayedPromise);

		const accountManager = new AccountManager(mockApiClient);
		const loadPromise = accountManager.loadAccount(1);

		expect(accountManager.loading).toBe(true);

		resolvePromise!(mockAccount);
		await loadPromise;

		expect(accountManager.loading).toBe(false);
	});

	it('should preserve balance string format from API', async () => {
		const mockAccount = { account_id: 1, balance: '100.50' };
		vi.mocked(mockApiClient.getAccount).mockResolvedValue(mockAccount);

		const accountManager = new AccountManager(mockApiClient);
		await accountManager.loadAccount(1);

		const storedAccount = accountManager.accounts.get(1);
		expect(typeof storedAccount?.balance).toBe('string');
		expect(storedAccount?.balance).toBe('100.50');
	});
});
