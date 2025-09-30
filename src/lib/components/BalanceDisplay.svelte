<script lang="ts">
	let { account_id, balance, handleTransfer } = $props<{
		account_id: number;
		balance: string;
		handleTransfer: (data: number) => void;
	}>();
</script>

<div class="card preset-filled-surface-100-900 p-4" role="listitem">
	<h3 class="font-semibold">
		{`Account ${account_id}`}
	</h3>
	<p class="mt-2 text-lg font-bold" aria-label="Balance: ${balance}">
		${balance}
	</p>
	<button
		class="preset-tonal-primary-500 mt-3 btn flex w-full justify-end"
		onclick={() => handleTransfer(account_id)}
		aria-label="Transfer money from account {account_id}"
	>
		Transfer Money
	</button>
</div>
