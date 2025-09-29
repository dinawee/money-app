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

	it('should contain numeric input for account_id', () => {
		const { getByLabelText } = render(AccountCreationForm);

		const accountIdInput = getByLabelText('Account ID');
		expect(accountIdInput).toBeInTheDocument();
		expect(accountIdInput).toHaveAttribute('type', 'number');
	});

	it('should contain text input for initial_balance', () => {
		const { getByLabelText } = render(AccountCreationForm);

		const initialBalanceInput = getByLabelText('Initial Amount');
		expect(initialBalanceInput).toBeInTheDocument();
		expect(initialBalanceInput).toHaveAttribute('type', 'text');
	});

	it('should contain submit button', () => {
		const { getByRole } = render(AccountCreationForm);

		const submitButton = getByRole('button', { name: /create account/i });
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toHaveAttribute('type', 'submit');
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

	it('should not emit submit event when account_id is missing', async () => {
		const user = userEvent.setup();
		const mockOnSubmit = vi.fn();
		const { getByLabelText, getByRole } = render(AccountCreationForm, {
			props: { onSubmit: mockOnSubmit }
		});

		const initialBalanceInput = getByLabelText('Initial Amount');
		const submitButton = getByRole('button', { name: /create account/i });

		await user.type(initialBalanceInput, '100.50');
		await user.click(submitButton);

		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	it('should display validation errors for empty fields when form is submitted', async () => {
		const user = userEvent.setup();
		const mockOnSubmit = vi.fn();
		const { getByText, getByRole } = render(AccountCreationForm, {
			props: { onSubmit: mockOnSubmit }
		});

		const submitButton = getByRole('button', { name: /create account/i });
		await user.click(submitButton);

		expect(getByText('Account ID is required')).toBeInTheDocument();
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	it('should be disabled when loading prop is true', () => {
		const { getByRole } = render(AccountCreationForm, {
			props: { loading: true }
		});

		const submitButton = getByRole('button', { name: /creating.../i });
		expect(submitButton).toBeDisabled();
	});
});
