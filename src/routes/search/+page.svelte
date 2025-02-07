<script>
	import { onMount } from 'svelte';
	import { dogs } from '$lib/api';

	let dogList = [];
	let loading = true;
	let error = null;

	// Load dogs when the page mounts
	onMount(async () => {
		try {
			// First get the IDs of dogs that match our search
			const searchResponse = await dogs.search({ sort: 'breed:asc' });

			// Then get the full dog details using those IDs
			dogList = await dogs.getDogsById(searchResponse.resultIds);
		} catch (err) {
			error = 'Failed to load dogs';
			console.error('Error:', err);
		} finally {
			loading = false;
		}
	});
</script>

<h1>Available Dogs</h1>

{#if loading}
	<div>Loading dogs...</div>
{:else if error}
	<div class="error">{error}</div>
{:else}
	<ul>
		{#each dogList as dog}
			<li>
				<h3>{dog.name}</h3>
				<p>{dog.breed}, {dog.age} years old</p>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.error {
		color: red;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		margin-bottom: 1rem;
	}
</style>
