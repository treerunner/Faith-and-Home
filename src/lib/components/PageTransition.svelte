<script>
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	let { children } = $props();
	let currentPath = $state($page.url.pathname);

	// Update current path when page changes
	$effect(() => {
		currentPath = $page.url.pathname;
	});
</script>

{#key currentPath}
	<div
		in:fly={{ x: 20, duration: 300, delay: 300 }}
		out:fly={{ x: -20, duration: 300 }}
		class="page-transition-wrapper"
	>
		{@render children()}
	</div>
{/key}

<style>
	.page-transition-wrapper {
		width: 100%;
	}
</style>
