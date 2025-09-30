<script lang="ts">
	import { getAccountManager } from '$lib/stores/context';
	import TransferForm from './TransferForm.svelte';
	import type { TransactionRequest } from '$lib/api/types';

	const accountManager = getAccountManager();

	let { sourceAccounts, destinationAccounts, selectedSource } = $props<{
		sourceAccounts: number[];
		destinationAccounts: number[];
		selectedSource?: number | null;
	}>();

	let error = $state('');
	let successTransaction = $state<any | null>(null);

	async function handleTransfer(data: TransactionRequest) {
		error = '';
		successTransaction = null;

		try {
			await accountManager.createTransaction(data);
			successTransaction = {
				source_account_id: data.source_account_id,
				destination_account_id: data.destination_account_id,
				amount: data.amount
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		}
	}
</script>

<div class="flex flex-col gap-2">
	<div class="mx-auto">
		{#if error}
			<div class="w-full max-w-md card preset-filled-error-500 p-4 text-center">
				<p class="font-semibold">{error.toUpperCase()}</p>
			</div>
		{/if}
	</div>

	{#if !successTransaction}
		<TransferForm
			onSubmit={handleTransfer}
			{sourceAccounts}
			{destinationAccounts}
			{selectedSource}
		/>
	{/if}

	<div class="mx-auto">
		{#if successTransaction}
			<div class="w-full max-w-md card preset-filled-success-500 p-4 text-center">
				<p class="font-semibold">Transfer Successful!</p>
				<p>From Account: {successTransaction.source_account_id}</p>
				<p>To Account: {successTransaction.destination_account_id}</p>
				<p>Amount: ${successTransaction.amount}</p>
			</div>
		{/if}
	</div>
</div>
