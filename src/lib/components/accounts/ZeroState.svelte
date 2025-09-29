<script lang="ts">
	let { onCreateAccount } = $props<{
		onCreateAccount: () => void;
	}>();
</script>

<div class="flex flex-col items-center justify-center min-h-[400px] text-center">
	<div class="w-full max-w-md card preset-filled-surface-100-900 p-8">
		<h2 class="text-2xl font-bold mb-4">Welcome to Your Account Dashboard</h2>
		<p class="text-surface-500 mb-6">
			You don't have any accounts yet. Create your first account to get started with managing your finances.
		</p>
		<button
			class="btn preset-filled-primary-500 w-full"
			onclick={onCreateAccount}
		>
			Create Your First Account
		</button>
	</div>
</div>