import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { AccountManager } from '$lib/stores/AccountManager.svelte';
import type { ApiClient } from '$lib/api/ApiClient';

let mockAccountManager: AccountManager;

vi.mock('$lib/stores/context', () => ({
	getAccountManager: () => mockAccountManager,
	setAccountManager: vi.fn()
}));

import TransferContainer from './TransferContainer.svelte';

describe('TransferContainer', () => {
	let mockApiClient: ApiClient;

	beforeEach(() => {
		mockApiClient = {
			getAccount: vi.fn(),
			createAccount: vi.fn(),
			createTransaction: vi.fn()
		} as unknown as ApiClient;
		mockAccountManager = new AccountManager(mockApiClient);
	});

	afterEach(() => {
		cleanup();
	});

	it('should render TransferContainer without error', () => {
		const { container } = render(TransferContainer, {
			props: {
				sourceAccounts: [123, 456],
				destinationAccounts: [789, 101]
			}
		});

		expect(container).toBeDefined();
		expect(container.firstChild).not.toBeNull();
	});

	it('should show transaction success message with details', async () => {
		const user = userEvent.setup();
		vi.mocked(mockApiClient.createTransaction).mockResolvedValue();

		const { getByLabelText, getByRole, getByText } = render(TransferContainer, {
			props: {
				sourceAccounts: [456],
				destinationAccounts: [789]
			}
		});

		const fromSelect = getByLabelText('From Account');
		const toSelect = getByLabelText('To Account');
		const amountInput = getByLabelText('Amount');
		const submitButton = getByRole('button', { name: /transfer/i });

		await user.selectOptions(fromSelect, '456');
		await user.selectOptions(toSelect, '789');
		await user.type(amountInput, '100.00');
		await user.click(submitButton);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(getByText(/transfer successful/i)).toBeInTheDocument();
		expect(getByText(/from account: 456/i)).toBeInTheDocument();
		expect(getByText(/to account: 789/i)).toBeInTheDocument();
		expect(getByText(/amount: \$100\.00/i)).toBeInTheDocument();
	});

	it('should handle transfer errors', async () => {
		const user = userEvent.setup();
		vi.mocked(mockApiClient.createTransaction).mockRejectedValue(new Error('Insufficient funds'));

		const { getByLabelText, getByRole, getByText } = render(TransferContainer, {
			props: {
				sourceAccounts: [456],
				destinationAccounts: [789]
			}
		});

		const fromSelect = getByLabelText('From Account');
		const toSelect = getByLabelText('To Account');
		const amountInput = getByLabelText('Amount');
		const submitButton = getByRole('button', { name: /transfer/i });

		await user.selectOptions(fromSelect, '456');
		await user.selectOptions(toSelect, '789');
		await user.type(amountInput, '100.00');
		await user.click(submitButton);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(getByText('INSUFFICIENT FUNDS')).toBeInTheDocument();
	});
});
