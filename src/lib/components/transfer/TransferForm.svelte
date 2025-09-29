<script lang="ts">
	import { validateAmount } from '$lib/utils/validation';

	let {
		onSubmit,
		loading = false,
		sourceAccounts,
		destinationAccounts,
		selectedSource
	} = $props<{
		onSubmit?: (data: any) => void;
		loading?: boolean;
		sourceAccounts: number[];
		destinationAccounts: number[];
		selectedSource: number | null;
	}>();

	let source_account_id = $derived<string | null>(selectedSource || null);
	let destination_account_id = $state<string | null>(null);
	let amount = $state('');
	let destinationError = $state('');
	let amountError = $state('');


	function handleSubmit(event: SubmitEvent) {
		event?.preventDefault();

		destinationError = '';
		amountError = '';

		if (source_account_id === destination_account_id) {
			destinationError = 'Source and destination account cannot be the same';
			return;
		}

		if (onSubmit) {
			onSubmit({
				source_account_id: parseInt(source_account_id as string),
				destination_account_id: parseInt(destination_account_id as string),
				amount
			});
		}
	}

	function validateInitialAmountInput() {
		if (amount !== undefined && !validateAmount(amount)) {
			amountError = 'Initial amount must be a positive number';
		} else {
			amountError = '';
		}
	}

	function validateDestinationAc() {
		if (source_account_id === destination_account_id) {
			destinationError = 'Source and destination account cannot be the same';
		}
	}
</script>

<div class="flex flex-col">
	<h2 class="self-center py-2 text-xl font-bold">Transfer Money</h2>

	<form class="mx-auto w-full max-w-md space-y-4" onsubmit={handleSubmit}>
		<label class="label">
			<span class="label-text">From Account</span>
			<select
				class="input-field-primary select"
				bind:value={source_account_id}
				aria-required="true"
			>
				<option value="" disabled selected={selectedSource !== null}>Select source account</option>
				{#each sourceAccounts as s}
					<option value={s} selected={selectedSource === s}>{s}</option>
				{/each}
			</select>
		</label>

		<label class="label">
			<span class="label-text">To Account</span>
			<select
				class="input-field-primary select"
				bind:value={destination_account_id}
				onchange={validateDestinationAc}
				aria-describedby={destinationError ? 'destination-error' : undefined}
				aria-invalid={!!destinationError}
				aria-required="true"
			>
				<option value="" disabled selected>Select destination account</option>
				{#each destinationAccounts as d}
					<option value={d}>{d}</option>
				{/each}
			</select>
			{#if destinationError}
				<span
					id="destination-error"
					class="text-sm text-error-500"
					role="alert"
					aria-live="polite"
				>
					{destinationError}
				</span>
			{/if}
		</label>

		<label class="label">
			<span class="label-text">Amount</span>
			<input
				type="text"
				class="input-field-primary input"
				placeholder="Enter amount"
				oninput={validateInitialAmountInput}
				bind:value={amount}
				aria-describedby={amountError ? 'amount-error' : undefined}
				aria-invalid={!!amountError}
				aria-required="true"
			/>
			{#if amountError}
				<span
					id="amount-error"
					class="text-sm text-error-500"
					role="alert"
					aria-live="polite"
				>
					{amountError}
				</span>
			{/if}
		</label>

		<div class="flex justify-end">
			<button
				type="submit"
				class="btn preset-filled-primary-500"
				disabled={loading ||
					!source_account_id ||
					!destination_account_id ||
					!amount ||
					!!destinationError ||
					!!amountError}
			>
				{loading ? 'Transferring...' : 'Transfer'}
			</button>
		</div>
	</form>
</div>
