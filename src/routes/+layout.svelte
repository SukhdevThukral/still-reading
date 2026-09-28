

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>


<svelte:head>
	<link rel="icon" href={favicon} />
	<title>still-██ading</title>
</svelte:head>

{@render children()}


