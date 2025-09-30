/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { AccountManager } from '$lib/stores/AccountManager.svelte';
import type { ApiClient } from '$lib/api/ApiClient';
import { BadRequestError } from '$lib/http/errors';

// Mock the context before importing the component since it is being executed on import
let mockAccountManager: AccountManager;

vi.mock('$lib/stores/context', () => ({
	getAccountManager: () => mockAccountManager,
	setAccountManager: vi.fn()
}));

// Import after mocking
import AccountCreationContainer from './AccountCreationContainer.svelte';

describe('AccountCreationContainer', () => {
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

	it('should render AccountCreationContainer without error', () => {
		const { container } = render(AccountCreationContainer);

		expect(container).toBeDefined();
		expect(container.firstChild).not.toBeNull();
	});

	it('should call accountManager.createAccount when form is submitted', async () => {
		const user = userEvent.setup();
		vi.mocked(mockApiClient.createAccount).mockResolvedValue({
			account_id: 123,
			balance: '100.50'
		});

		const { getByLabelText, getByRole } = render(AccountCreationContainer);

		const accountIdInput = getByLabelText('Account ID');
		const initialBalanceInput = getByLabelText('Initial Amount');
		const submitButton = getByRole('button', { name: /create account/i });

		await user.type(accountIdInput, '123');
		await user.type(initialBalanceInput, '100.50');
		await user.click(submitButton);

		expect(mockApiClient.createAccount).toHaveBeenCalledWith({
			account_id: 123,
			initial_balance: '100.50'
		});
	});


	it('should handle creation errors', async () => {
		const user = userEvent.setup();
		vi.mocked(mockApiClient.createAccount).mockRejectedValue(new Error('Account already exists'));

		const { getByLabelText, getByRole, getByText } = render(AccountCreationContainer);

		const accountIdInput = getByLabelText('Account ID');
		const submitButton = getByRole('button', { name: /create account/i });

		await user.type(accountIdInput, '123');
		await user.click(submitButton);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(getByText(/create account/i)).toBeInTheDocument();
	});

	it('should show success message with account details after successful creation', async () => {
		const user = userEvent.setup();
		vi.mocked(mockApiClient.createAccount).mockResolvedValue({
			account_id: 123,
			balance: '100.50'
		});

		const { getByLabelText, getByRole, getByText } = render(AccountCreationContainer);

		const accountIdInput = getByLabelText('Account ID');
		const initialBalanceInput = getByLabelText('Initial Amount');
		const submitButton = getByRole('button', { name: /create account/i });

		await user.type(accountIdInput, '123');
		await user.type(initialBalanceInput, '100.50');
		await user.click(submitButton);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(getByText(/account created successfully/i)).toBeInTheDocument();
		expect(getByText(/account id: 123/i)).toBeInTheDocument();
		expect(getByText(/balance: \$100\.50/i)).toBeInTheDocument();
	});

	it('should handle duplicate account error with appropriate message', async () => {
		const user = userEvent.setup();
		vi.mocked(mockApiClient.createAccount).mockRejectedValue(
			new BadRequestError('Account with this ID already exists')
		);

		const { getByLabelText, getByRole, getByText } = render(AccountCreationContainer);

		const accountIdInput = getByLabelText('Account ID');
		const initialBalanceInput = getByLabelText('Initial Amount');
		const submitButton = getByRole('button', { name: /create account/i });

		await user.type(accountIdInput, '123');
		await user.type(initialBalanceInput, '100.50');
		await user.click(submitButton);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(getByText(/account with this id already exists/i)).toBeInTheDocument();
		expect(submitButton).not.toBeDisabled();
	});
});
