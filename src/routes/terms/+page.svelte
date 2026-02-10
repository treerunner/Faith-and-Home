<script>
	import { locale } from '$lib/stores/locale.js';
	import { loadContent } from '$lib/utils/content.js';
	import { fade } from 'svelte/transition';

	let content = $state(null);
	let currentLocale = $state($locale);

	// Load content when locale changes
	$effect(() => {
		content = null; // Clear content first for fade out
		loadContent('terms', $locale).then((module) => {
			content = module;
			currentLocale = $locale;
		});
	});
</script>

<svelte:head>
	<title>{currentLocale === 'en' ? 'Terms and Conditions' : 'Términos y Condiciones'} - Faith & Home</title>
</svelte:head>

<div class="page-transition">
	<div class="container content-page">
		{#if content}
			<div class="grid" transition:fade>
				<div class="col-12">
					<content.default />
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.content-page {
		padding: 3rem 0;
		min-height: 60vh;
	}

	.loading {
		text-align: center;
		padding: 4rem 0;
	}

	:global(.content-page h1) {
		border-bottom: 3px solid var(--text-color);
		padding-bottom: 1rem;
		margin-bottom: 2rem;
	}

	:global(.content-page h2) {
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	:global(.content-page h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	:global(.content-page ul, .content-page ol) {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	:global(.content-page li) {
		margin: 0.5rem 0;
	}

	:global(.content-page hr) {
		border: none;
		border-top: 1px solid #e2e8f0;
		margin: 2rem 0;
	}
</style>
