import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import BalanceDisplay from './BalanceDisplay.svelte';

describe('BalanceDisplay', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render BalanceDisplay component without error', () => {
		const { container } = render(BalanceDisplay, {
			props: {
				account_id: 123,
				balance: '100.50'
			}
		});

		expect(container).toBeDefined();
		expect(container.firstChild).not.toBeNull();
	});

	it('should display account ID and balance string correctly', () => {
		const { getByText } = render(BalanceDisplay, {
			props: {
				account_id: 123,
				balance: '1234.56'
			}
		});

		expect(getByText('Account 123')).toBeInTheDocument();
		expect(getByText('$1234.56')).toBeInTheDocument();
	});

	it('should call handleTransfer when clicked', async () => {
		const user = userEvent.setup();
		const mockHandleTransfer = vi.fn();
		const { getByText, getByRole } = render(BalanceDisplay, {
			props: {
				account_id: 123,
				balance: '1234.56',
				handleTransfer: mockHandleTransfer
			}
		});

		const transferButton = getByRole('button', { name: /transfer money/i });
		await user.click(transferButton);

		expect(getByText('Account 123')).toBeInTheDocument();
		expect(getByText('$1234.56')).toBeInTheDocument();
		expect(mockHandleTransfer).toHaveBeenCalledWith(123);
	});
});
