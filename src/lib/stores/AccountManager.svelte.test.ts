/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountManager } from './AccountManager.svelte';
import type { ApiClient } from '$lib/api/ApiClient';
import { BadRequestError } from '$lib/http/errors';

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

describe('AccountManager createAccount', () => {
	let mockApiClient: ApiClient;

	beforeEach(() => {
		mockApiClient = {
			getAccount: vi.fn(),
			createAccount: vi.fn(),
			createTransaction: vi.fn()
		} as unknown as ApiClient;
	});

	it('should have createAccount method that accepts CreateAccountRequest', async () => {
		const createAccountRequest = { account_id: 1, initial_balance: '50.00' };
		const mockAccount = { account_id: 1, balance: '50.00' };
		vi.mocked(mockApiClient.createAccount).mockResolvedValue(mockAccount);

		const accountManager = new AccountManager(mockApiClient);

		expect(accountManager.createAccount).toBeDefined();
		expect(typeof accountManager.createAccount).toBe('function');

		await accountManager.createAccount(createAccountRequest);
		expect(mockApiClient.createAccount).toHaveBeenCalledWith(createAccountRequest);
	});

	it('should update accounts state after successful creation', async () => {
		const createAccountRequest = { account_id: 1, initial_balance: '50.00' };
		const mockAccount = { account_id: 1, balance: '50.00' };
		vi.mocked(mockApiClient.createAccount).mockResolvedValue(mockAccount);

		const accountManager = new AccountManager(mockApiClient);

		expect(accountManager.accounts.get(1)).toBeUndefined();

		const result = await accountManager.createAccount(createAccountRequest);

		expect(result).toEqual(mockAccount);
		expect(accountManager.accounts.get(1)).toEqual(mockAccount);
		expect(accountManager.error).toBe(null);
	});

	it('should handle createAccount errors properly', async () => {
		const createAccountRequest = { account_id: 1, initial_balance: '50.00' };
		const conflictError = new BadRequestError('Account already exists');
		vi.mocked(mockApiClient.createAccount).mockRejectedValue(conflictError);

		const accountManager = new AccountManager(mockApiClient);

		await expect(accountManager.createAccount(createAccountRequest)).rejects.toThrow(
			'HTTP 400: Account already exists'
		);

		expect(accountManager.accounts.get(1)).toBeUndefined();
		expect(accountManager.error).toBe(conflictError);
		expect(accountManager.loading).toBe(false);
	});
});

describe('AccountManager createTransaction', () => {
	let mockApiClient: ApiClient;

	beforeEach(() => {
		mockApiClient = {
			getAccount: vi.fn(),
			createAccount: vi.fn(),
			createTransaction: vi.fn()
		} as unknown as ApiClient;
	});

	it('should have createTransaction method that accepts TransactionRequest', async () => {
		const transactionRequest = { source_account_id: 1, destination_account_id: 2, amount: '25.00' };

		vi.mocked(mockApiClient.createTransaction).mockResolvedValue(undefined);
		vi.mocked(mockApiClient.getAccount)
			.mockResolvedValueOnce({ account_id: 1, balance: '75.00' })
			.mockResolvedValueOnce({ account_id: 2, balance: '125.00' });

		const accountManager = new AccountManager(mockApiClient);

		expect(accountManager.createTransaction).toBeDefined();
		expect(typeof accountManager.createTransaction).toBe('function');

		await accountManager.createTransaction(transactionRequest);
		expect(mockApiClient.createTransaction).toHaveBeenCalledWith(transactionRequest);
	});

	it('should maintain state consistency when transaction fails', async () => {
		const transactionRequest = {
			source_account_id: 1,
			destination_account_id: 2,
			amount: '1000.00'
		};
		const insufficientFundsError = new BadRequestError('Insufficient funds');
		vi.mocked(mockApiClient.createTransaction).mockRejectedValue(insufficientFundsError);

		const accountManager = new AccountManager(mockApiClient);

		await expect(accountManager.createTransaction(transactionRequest)).rejects.toThrow(
			'HTTP 400: Insufficient funds'
		);

		expect(accountManager.error).toBe(insufficientFundsError);
		expect(accountManager.loading).toBe(false);
		expect(mockApiClient.getAccount).not.toHaveBeenCalled();
	});
});
