<script lang="ts">
	import { getAccountManager } from '$lib/stores/context';
	import AccountCreationForm from './AccountCreationForm.svelte';
	import type { CreateAccountRequest, Account } from '$lib/api/types';

	const accountManager = getAccountManager();

	let loading = $state(false);
	let error = $state('');
	let successAccount = $state<Account | null>(null);

	async function handleCreateAccount(data: CreateAccountRequest) {
		loading = true;
		error = '';

		try {
			successAccount = await accountManager.createAccount(data);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
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

	{#if !successAccount}
		<AccountCreationForm onSubmit={handleCreateAccount} {loading} />
	{/if}

	<div class="mx-auto">
		{#if successAccount}
			<div class="w-full max-w-md card preset-filled-success-500 p-4 text-center">
				<p class="font-semibold">Account Created Successfully!</p>
				<p>Account ID: {successAccount.account_id}</p>
				<p>Initial Balance: ${successAccount.balance}</p>
			</div>
		{/if}
	</div>
</div>
