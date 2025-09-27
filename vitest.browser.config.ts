import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	test: {
		browser: {
			enabled: true,
			provider: 'playwright',
			headless: true,
			// https://vitest.dev/guide/browser/playwright
			instances: [{ browser: 'chromium' }]
		},
		include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
		exclude: ['src/lib/server/**']
	}
});
