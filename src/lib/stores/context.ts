import { getContext, setContext } from 'svelte';
import type { AccountManager } from './AccountManager.svelte';

const ACCOUNT_MANAGER_KEY = 'accountManager';

export function setAccountManager(accountManager: AccountManager): void {
	setContext(ACCOUNT_MANAGER_KEY, accountManager);
}

export function getAccountManager(): AccountManager {
	const accountManager = getContext<AccountManager>(ACCOUNT_MANAGER_KEY);

	if (!accountManager) {
		throw new Error('AccountManager not found in context. Make sure to call setAccountManager() in a parent component.');
	}

	return accountManager;
}