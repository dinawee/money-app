import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import AccountCreationForm from './AccountCreationForm.svelte';

describe('AccountCreationForm', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render AccountCreationForm component without error', () => {
		const { container } = render(AccountCreationForm);

		expect(container).toBeDefined();
		expect(container.firstChild).not.toBeNull();
	});

	it('should contain all required input fields', () => {
		const { getByLabelText, getByRole } = render(AccountCreationForm);

		expect(getByLabelText('Account ID')).toBeInTheDocument();
		expect(getByLabelText('Initial Amount')).toBeInTheDocument();
		expect(getByRole('button', { name: /create account/i })).toBeInTheDocument();
	});

	it('should emit submit event with form data when submitted', async () => {
		const user = userEvent.setup();
		const mockOnSubmit = vi.fn();
		const { getByLabelText, getByRole } = render(AccountCreationForm, {
			props: { onSubmit: mockOnSubmit }
		});

		const accountIdInput = getByLabelText('Account ID');
		const initialBalanceInput = getByLabelText('Initial Amount');
		const submitButton = getByRole('button', { name: /create account/i });

		await user.type(accountIdInput, '123');
		await user.type(initialBalanceInput, '100.50');
		await user.click(submitButton);

		expect(mockOnSubmit).toHaveBeenCalledWith({
			account_id: 123,
			initial_balance: '100.50'
		});
	});

	it('should disable submit button and not call onSubmit when fields are not valid', async () => {
		const user = userEvent.setup();
		const mockOnSubmit = vi.fn();
		const { getByLabelText, getByRole, getByText } = render(AccountCreationForm, {
			props: { onSubmit: mockOnSubmit }
		});

		const accountIdInput = getByLabelText('Account ID');
		const initialBalanceInput = getByLabelText('Initial Amount');
		const submitButton = getByRole('button', { name: /create account/i });

		await user.clear(accountIdInput);
		await user.type(accountIdInput, '-1');

		await user.clear(initialBalanceInput);
		await user.type(initialBalanceInput, '-10');

		await user.click(submitButton);

		expect(getByText('Account ID must be a positive number')).toBeInTheDocument();
		expect(getByText('Initial amount must be a positive number')).toBeInTheDocument();
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});
});
