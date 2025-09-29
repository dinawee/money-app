<script lang="ts">
	let { account_id, account_name, balance } = $props<{
		account_id: number;
		account_name: string;
		balance: string;
	}>();
</script>

<div class="w-full max-w-md card preset-filled-surface-100-900 p-4 text-center">
	<p class="font-semibold">{account_name}</p>
	<p class="text-sm text-surface-500">Account ID: {account_id}</p>
	<p class="text-lg font-bold">${balance}</p>
</div>