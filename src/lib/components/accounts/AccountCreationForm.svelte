<script lang="ts">
	import { validateAccountId, validateAmount } from '$lib/utils/validation';

	let { onSubmit } = $props();

	let account_id = $state<number | undefined>(undefined);
	let initial_balance = $state('');
	let accountIdError = $state('');
	let initialAmountError = $state('');

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!account_id) {
			accountIdError = 'Account ID is required';
			return;
		}

		if (!validateAccountId(account_id)) {
			accountIdError = 'Account ID must be a positive number';
			return;
		}

		accountIdError = '';

		onSubmit({
			account_id: account_id,
			initial_balance: initial_balance || '0'
		});
	}

	function validateAccountIdInput() {
		if (account_id !== undefined && !validateAccountId(account_id)) {
			accountIdError = 'Account ID must be a positive number';
		} else {
			accountIdError = '';
		}
	}

	function validateInitialAmountInput() {
		if (initial_balance !== undefined && !validateAmount(initial_balance)) {
			initialAmountError = 'Initial amount must be a positive number';
		} else {
			initialAmountError = '';
		}
	}
</script>

<div class="flex flex-col">
	<h2 class="self-center py-2 text-xl font-bold">Account Creation</h2>

	<form class="mx-auto w-full max-w-md space-y-4" onsubmit={handleSubmit}>
		<label class="label">
			<span class="label-text">Account ID</span>
			<input
				type="number"
				class="input-field-primary input"
				placeholder="Enter Account ID"
				bind:value={account_id}
				oninput={validateAccountIdInput}
				min="1"
				aria-describedby={accountIdError ? 'account-id-error' : undefined}
				aria-invalid={!!accountIdError}
				aria-required="true"
			/>
			{#if accountIdError}
				<span
					id="account-id-error"
					class="text-sm text-error-500"
					role="alert"
					aria-live="polite"
				>
					{accountIdError}
				</span>
			{/if}
		</label>

		<label class="label">
			<span class="label-text">Initial Amount</span>
			<input
				type="text"
				class="input-field-primary input"
				placeholder="Enter Initial Amount"
				bind:value={initial_balance}
				oninput={validateInitialAmountInput}
				aria-describedby={initialAmountError ? 'initial-amount-error' : undefined}
				aria-invalid={!!initialAmountError}
				aria-required="true"
			/>
			{#if initialAmountError}
				<span
					id="initial-amount-error"
					class="text-sm text-error-500"
					role="alert"
					aria-live="polite"
				>
					{initialAmountError}
				</span>
			{/if}
		</label>

		<div class="flex justify-end">
			<button
				type="submit"
				class="btn preset-filled-primary-500"
				disabled={!account_id ||
					!initial_balance ||
					!!initialAmountError ||
					!!accountIdError}
			>
				Create Account
			</button>
		</div>
	</form>
</div>
