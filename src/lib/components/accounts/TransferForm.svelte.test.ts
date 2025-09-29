import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TransferForm from './TransferForm.svelte';

describe('TransferForm', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render TransferForm component without error', () => {
		const { container } = render(TransferForm, {
			props: {
				sourceAccounts: [123],
				destinationAccounts: [456]
			}
		});

		expect(container).toBeDefined();
		expect(container.firstChild).not.toBeNull();
	});

	it('should contain all required input fields', () => {
		const { getByLabelText } = render(TransferForm, {
			props: {
				sourceAccounts: [123],
				destinationAccounts: [456]
			}
		});

		expect(getByLabelText('From Account')).toBeInTheDocument();
		expect(getByLabelText('To Account')).toBeInTheDocument();
		expect(getByLabelText('Amount')).toBeInTheDocument();
	});

	it('should display account options correctly in dropdowns', () => {
		const sourceAccounts = [123, 456, 789];
		const destinationAccounts = [101, 202, 303];

		const { getByLabelText } = render(TransferForm, {
			props: {
				sourceAccounts,
				destinationAccounts
			}
		});

		const fromSelect = getByLabelText('From Account');
		const toSelect = getByLabelText('To Account');

		sourceAccounts.forEach((accountId) => {
			const option = fromSelect.querySelector(`option[value="${accountId}"]`);
			expect(option).toBeInTheDocument();
			expect(option?.textContent).toBe(accountId.toString());
		});

		destinationAccounts.forEach((accountId) => {
			const option = toSelect.querySelector(`option[value="${accountId}"]`);
			expect(option).toBeInTheDocument();
			expect(option?.textContent).toBe(accountId.toString());
		});
	});

	it('should emit submit event with form data when submitted', async () => {
		const user = userEvent.setup();
		const mockOnSubmit = vi.fn();
		const sourceAccounts = [123, 456];
		const destinationAccounts = [789, 101];

		const { getByLabelText, getByRole } = render(TransferForm, {
			props: {
				onSubmit: mockOnSubmit,
				sourceAccounts,
				destinationAccounts
			}
		});

		const fromSelect = getByLabelText('From Account');
		const toSelect = getByLabelText('To Account');
		const amountInput = getByLabelText('Amount');
		const submitButton = getByRole('button', { name: /transfer/i });

		await user.selectOptions(fromSelect, '456');
		await user.selectOptions(toSelect, '789');
		await user.type(amountInput, '100.50');
		await user.click(submitButton);

		expect(mockOnSubmit).toHaveBeenCalledWith({
			source_account_id: 456,
			destination_account_id: 789,
			amount: '100.50'
		});
	});

	it('should disable submit button when fields are not valid', async () => {
		const user = userEvent.setup();
		const mockOnSubmit = vi.fn();
		const { getByRole } = render(TransferForm, {
			props: {
				onSubmit: mockOnSubmit,
				sourceAccounts: [123, 456],
				destinationAccounts: [789, 101]
			}
		});

		const submitButton = getByRole('button', { name: /transfer/i });

		expect(submitButton).toBeDisabled();

		await user.click(submitButton);
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	it('should show error when source and destination accounts are the same', async () => {
		const user = userEvent.setup();
		const mockOnSubmit = vi.fn();
		const { getByLabelText, getByRole, getByText } = render(TransferForm, {
			props: {
				onSubmit: mockOnSubmit,
				sourceAccounts: [123, 456],
				destinationAccounts: [123, 456, 789]
			}
		});

		const fromSelect = getByLabelText('From Account');
		const toSelect = getByLabelText('To Account');
		const amountInput = getByLabelText('Amount');
		const submitButton = getByRole('button', { name: /transfer/i });

		await user.selectOptions(fromSelect, '456');
		await user.selectOptions(toSelect, '456');
		await user.type(amountInput, '100.00');

		await user.click(submitButton);

		expect(getByText('Source and destination account cannot be the same')).toBeInTheDocument();
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});
});
