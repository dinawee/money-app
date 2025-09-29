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
			'Account already exists'
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
			'Insufficient funds'
		);

		expect(accountManager.error).toBe(insufficientFundsError);
		expect(accountManager.loading).toBe(false);
		expect(mockApiClient.getAccount).not.toHaveBeenCalled();
	});
});
