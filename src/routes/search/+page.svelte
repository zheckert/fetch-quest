<script>
	import { onMount } from 'svelte';
	import { dogs } from '$lib/api';

	let dogList = [];
	let breeds = []; // List of all available breeds
	let selectedBreed = ''; // Currently selected breed (we'll start with single selection)
	let loading = true;
	let error = null;

	// Load breeds and initial dogs when the page mounts
	onMount(async () => {
		try {
			// Get list of breeds first
			breeds = await dogs.getBreeds();
			await searchDogs();
		} catch (err) {
			error = 'Failed to load dogs';
			console.error('Error:', err);
		} finally {
			loading = false;
		}
	});

	// Search function that considers the selected breed
	async function searchDogs() {
		try {
			loading = true;
			const params = { sort: 'breed:asc' };

			// Add breed filter if one is selected
			if (selectedBreed) {
				params.breeds = [selectedBreed];
			}

			const searchResponse = await dogs.search(params);
			dogList = await dogs.getDogsById(searchResponse.resultIds);
		} catch (err) {
			error = 'Failed to load dogs';
			console.error('Error:', err);
		} finally {
			loading = false;
		}
	}

	// Handle breed selection
	function handleBreedChange(event) {
		selectedBreed = event.target.value;
		searchDogs();
	}
</script>

<h1>Available Dogs</h1>

<div class="filters">
	<label>
		Filter by breed:
		<select value={selectedBreed} on:change={handleBreedChange}>
			<option value="">All Breeds</option>
			{#each breeds as breed}
				<option value={breed}>{breed}</option>
			{/each}
		</select>
	</label>
</div>

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

	.filters {
		padding: 1rem;
	}

	select {
		margin-left: 0.5rem;
		padding: 0.25rem;
	}
</style>
