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
	<div class="dog-grid">
		{#each dogList as dog}
			<div class="dog-card">
				<img src={dog.img} alt={dog.name} />
				<div class="dog-info">
					<h3>{dog.name}</h3>
					<p><strong>Breed:</strong> {dog.breed}</p>
					<p><strong>Age:</strong> {dog.age} {dog.age === 1 ? 'year' : 'years'}</p>
					<p><strong>Location:</strong> {dog.zip_code}</p>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.dog-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	.dog-card {
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
	}

	.dog-info {
		padding: 1rem;
	}

	img {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	h3 {
		margin: 0 0 0.5rem 0;
	}

	p {
		margin: 0.25rem 0;
	}

	.error {
		color: red;
		padding: 1rem;
	}
</style>
