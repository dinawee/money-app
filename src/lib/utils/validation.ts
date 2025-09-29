export function validateAmount(amount: string): boolean {
	if (typeof amount !== 'string') {
		return false;
	}

	if (amount.trim() === '') {
		return false;
	}

	const decimalPattern = /^-?\d+(\.\d+)?$/;

	if (!decimalPattern.test(amount)) {
		return false;
	}

	const parsed = parseFloat(amount);

	if (isNaN(parsed) || !isFinite(parsed)) {
		return false;
	}

	if (parsed < 0) {
		return false;
	}

	return true;
}

export function validateAccountId(accountId: number): boolean {
	return Number.isInteger(accountId) && accountId > 0;
}