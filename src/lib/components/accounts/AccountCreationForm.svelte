<script lang="ts">
	let { onSubmit, loading = false } = $props();

	let account_id = $state<number | undefined>(undefined);
	let initial_balance = $state('');
	let accountIdError = $state('');

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!account_id) {
			accountIdError = 'Account ID is required';
			return;
		}

		clearErrors();

		onSubmit({
			account_id: account_id,
			initial_balance: initial_balance || '0'
		});
	}

	function clearErrors() {
		accountIdError = '';
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
				onfocus={clearErrors}
			/>
			{#if accountIdError}
				<span class="text-sm text-error-500">{accountIdError}</span>
			{/if}
		</label>

		<label class="label">
			<span class="label-text">Initial Amount</span>
			<input
				type="text"
				class="input-field-primary input"
				placeholder="Enter Initial Balance"
				bind:value={initial_balance}
			/>
		</label>

		<div class="flex justify-end">
			<button type="submit" class="btn preset-filled-primary-500" disabled={loading}>
				{loading ? 'Creating...' : 'Create Account'}
			</button>
		</div>
	</form>
</div>
