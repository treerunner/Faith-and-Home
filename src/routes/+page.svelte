<script>
	import { locale } from '$lib/stores/locale.js';
	import { loadContent } from '$lib/utils/content.js';
	import { fade } from 'svelte/transition';

	let content = $state(null);
	let currentLocale = $state($locale);

	// Load content when locale changes
	$effect(() => {
		content = null; // Clear content first for fade out
		loadContent('home', $locale).then((module) => {
			content = module;
			currentLocale = $locale;
		});
	});
</script>

<svelte:head>
	<title>Faith & Home</title>
</svelte:head>

<div class="page-transition">
	{#if content}
		<section class="content-section" transition:fade>
			<div class="container">
				<div class="grid">
					<div class="col-12">
						<content.default />
					</div>
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	.content-section {
		padding: 3rem 0;
	}

	.loading {
		text-align: center;
		padding: 4rem 0;
	}

	:global(.content-section h2) {
		border-bottom: 2px solid var(--text-color);
		padding-bottom: 0.5rem;
		margin-top: 2rem;
	}

	:global(.content-section h3) {
		margin-top: 1.5rem;
	}

	:global(.content-section ul) {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	:global(.content-section li) {
		margin: 0.5rem 0;
	}

	:global(.participation-methods) {
		margin: 2rem 0;
	}

	:global(.participation-methods .col-4) {
		padding: 1.5rem;
		background-color: var(--light-gray);
		display: flex;
		flex-direction: column;
	}

	:global(.participation-methods h4) {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	:global(.participation-methods p) {
		margin-bottom: 0.5rem;
	}

	:global(.participation-methods p:last-child) {
		margin-top: auto;
		margin-bottom: 0;
		padding-top: 1rem;
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		:global(.participation-methods .col-4) {
			grid-column: span 12;
		}
	}

	:global(.survey-button) {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: var(--text-color);
		color: var(--bg-color);
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	:global(.survey-button:hover) {
		opacity: 0.8;
	}
</style>
