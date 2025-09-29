import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import BalanceDisplay from './BalanceDisplay.svelte';

describe('BalanceDisplay', () => {
	afterEach(() => {
		cleanup();
	});

	it('should render BalanceDisplay component without error', () => {
		const { container } = render(BalanceDisplay, {
			props: {
				account_id: 123,
				account_name: 'Test Account',
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
				account_name: 'Test Account',
				balance: '1234.56'
			}
		});

		expect(getByText('Test Account')).toBeInTheDocument();
		expect(getByText('Account ID: 123')).toBeInTheDocument();
		expect(getByText('$1234.56')).toBeInTheDocument();
	});
});