import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setAccountManager, getAccountManager } from './context';
import { AccountManager } from './AccountManager.svelte';
import type { ApiClient } from '../api/ApiClient';

vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn()
}));

describe('AccountManager Context', () => {
	let mockApiClient: ApiClient;
	let accountManager: AccountManager;

	beforeEach(() => {
		vi.clearAllMocks();
		mockApiClient = {
			getAccount: vi.fn(),
			createAccount: vi.fn(),
			createTransaction: vi.fn()
		} as unknown as ApiClient;
		accountManager = new AccountManager(mockApiClient);
	});

	it('should set AccountManager in context with correct key', async () => {
		const { setContext } = vi.mocked(await import('svelte'));

		setAccountManager(accountManager);

		expect(setContext).toHaveBeenCalledWith('accountManager', accountManager);
	});

	it('should get AccountManager from context', async () => {
		const { getContext } = vi.mocked(await import('svelte'));
		getContext.mockReturnValue(accountManager);

		const result = getAccountManager();

		expect(getContext).toHaveBeenCalledWith('accountManager');
		expect(result).toBe(accountManager);
	});

	it('should throw error when AccountManager not found in context', async () => {
		const { getContext } = vi.mocked(await import('svelte'));
		getContext.mockReturnValue(undefined);

		expect(() => getAccountManager()).toThrow(
			'AccountManager not found in context. Make sure to call setAccountManager() in a parent component.'
		);
	});
});
