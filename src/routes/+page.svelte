<script lang="ts">
	import { onMount } from 'svelte';
	import { setAccountManager } from '$lib/stores/context';
	import { AccountManager } from '$lib/stores/AccountManager.svelte';
	import { ApiClient } from '$lib/api/ApiClient';
	import { FetchHttpClient } from '$lib/http/FetchHttpClient';
	import AccountCreationContainer from '$lib/components/accounts/AccountCreationContainer.svelte';
	import TransferContainer from '$lib/components/transfer/TransferContainer.svelte';
	import ZeroState from '$lib/components/ZeroState.svelte';
	import BalanceDisplay from '$lib/components/BalanceDisplay.svelte';

	// Set up the AccountManager context at the root
	const httpClient = new FetchHttpClient();
	const apiClient = new ApiClient(httpClient);
	const accountManager = new AccountManager(apiClient);
	setAccountManager(accountManager);

	let accounts = $derived(Array.from(accountManager.accounts.values()));
	let error = $state('');
	let currentView = $state<'dashboard' | 'create-account' | 'transfer'>('dashboard');
	let selectedAcc = $state<number | null>(null);

	let totalBalance = $derived.by(() => {
		return accounts.reduce((sum, account) => {
			return sum + parseFloat(account.balance);
		}, 0);
	});

	function handleCreateAccount() {
		currentView = 'create-account';
	}

	function handleTransfer(accountId?: number) {
		if (accountId) {
			selectedAcc = accountId;
		}

		currentView = 'transfer';
	}

	function handleBackToDashboard() {
		currentView = 'dashboard';
		selectedAcc = null;
	}
</script>

<div class="container mx-auto px-4 py-6">
	<!-- Screen reader announcements -->
	<div aria-live="polite" aria-atomic="true" class="sr-only">
		{#if currentView === 'create-account'}
			Account creation form loaded
		{:else if currentView === 'transfer'}
			Money transfer form loaded
		{:else}
			Financial dashboard loaded with {accounts.length} accounts
		{/if}
	</div>

	<!-- Header -->
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<h1 class="text-3xl font-bold">Money App</h1>
			</div>
			<div class="text-right">
				<p class="text-sm text-surface-500">Welcome back!</p>
				<p class="font-semibold">Jane Doe</p>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main>
		{#if currentView === 'create-account'}
			<nav class="mb-4" aria-label="Navigation">
				<button
					class="preset-tonal-surface-500 btn"
					onclick={handleBackToDashboard}
					aria-label="Go back to dashboard"
				>
					← Back to Dashboard
				</button>
			</nav>
			<h2 id="create-account-heading" class="sr-only">Create a new account</h2>
			<section aria-labelledby="create-account-heading">
				<AccountCreationContainer />
			</section>
		{:else if currentView === 'transfer'}
			<nav class="mb-4" aria-label="Navigation">
				<button
					class="preset-tonal-surface-500 btn"
					onclick={handleBackToDashboard}
					aria-label="Go back to dashboard"
				>
					← Back to Dashboard
				</button>
			</nav>
			<h2 id="transfer-heading" class="sr-only">Transfer Money Between Accounts</h2>
			<section aria-labelledby="transfer-heading">
				<TransferContainer
					sourceAccounts={selectedAcc ? [selectedAcc] : accounts.map((a) => a.account_id)}
					destinationAccounts={selectedAcc
						? accounts.filter((a) => a.account_id !== selectedAcc).map((a) => a.account_id)
						: accounts.map((a) => a.account_id)}
					selectedSource={selectedAcc}
				/>
			</section>
		{:else if error}
			<section aria-label="Error message">
				<div class="mx-auto w-full max-w-md card preset-filled-surface-100-900 p-4 text-center">
					<p class="text-error-500" role="alert">{error.toUpperCase()}</p>
				</div>
			</section>
		{:else if accounts.length === 0}
			<section aria-label="Welcome message">
				<ZeroState onCreateAccount={handleCreateAccount} />
			</section>
		{:else}
			<!-- Total Balance Section -->
			<h2 id="total-balance-heading" class="sr-only">Total Balance Of All Accounts</h2>
			<section class="mb-8 flex" aria-labelledby="total-balance-heading">
				<div class="w-full card preset-filled-surface-100-900 p-6">
					<div class="flex items-center justify-between">
						<div>
							<h2 id="total-balance-heading" class="text-lg font-semibold text-surface-500">
								TOTAL BALANCE
							</h2>
						</div>
						<div>
							<p class="text-3xl font-bold" aria-label="Total balance: ${totalBalance.toFixed(2)}">
								${totalBalance.toFixed(2)}
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Accounts Section -->
			<h2 id="accounts-heading" class="sr-only">List Of All Accounts</h2>
			<section aria-labelledby="accounts-heading">
				<div class="mb-6 flex items-center justify-between">
					<h2 id="accounts-heading" class="text-xl font-semibold">Accounts</h2>
					<div class="flex gap-2" role="group" aria-label="Account actions">
						<button
							class="btn preset-filled-primary-500"
							onclick={handleCreateAccount}
							aria-label="Create a new account"
						>
							Create New Account
						</button>
						<button
							class="preset-tonal-primary-500 btn"
							onclick={() => handleTransfer()}
							aria-label="Transfer money between accounts"
						>
							Transfer Money
						</button>
					</div>
				</div>

				<!-- Account Grid -->
				<div
					class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
					role="list"
					aria-label="Your accounts"
				>
					{#each accounts as account}
						<BalanceDisplay
							account_id={account.account_id}
							balance={account.balance}
							{handleTransfer}
						/>
					{/each}
				</div>
			</section>
		{/if}
	</main>
</div>
