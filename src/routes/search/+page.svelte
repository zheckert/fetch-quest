<script>
	import { onMount } from 'svelte';
	import { dogs } from '$lib/api';
	import { favorites } from '$lib/stores/favoritesStore';
	import DogCard from '$lib/components/DogCard.svelte';
	import MatchCard from '$lib/components/MatchCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import MatchOverlay from '$lib/components/MatchOverlay.svelte';
	import FavoritesSummary from '$lib/components/FavoritesSummary.svelte';
	import FilterControls from '$lib/components/FilterControls.svelte';

	let dogList = [];
	let breeds = []; // List of all available breeds
	let selectedBreed = ''; // Currently selected breed
	let sortOrder = 'asc'; // Track sort direction
	let loading = true;
	let error = null;

	// Pagination state
	let currentPage = null;
	let nextPage = null;
	let prevPage = null;
	let pageSize = 20; // Number of dogs per page

	let matchedDog = null;
	let matchLoading = false; // Add loading state for match

	// Add totalPages to our state
	let totalPages = 0;

	// Add match history state
	let matchHistory = [];

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
	async function searchDogs(fromCursor = null) {
		try {
			loading = true;
			const params = {
				sort: `breed:${sortOrder}`,
				size: pageSize
			};

			if (selectedBreed) {
				params.breeds = [selectedBreed];
			}

			if (fromCursor) {
				const url = new URL(fromCursor, 'https://fetch-quest.netlify.app');
				const fromValue = url.searchParams.get('from');
				params.from = fromValue;
				currentPage = Math.floor(Number(fromValue) / pageSize) + 1;
			} else {
				currentPage = 1; // First page
			}

			const searchResponse = await dogs.search(params);
			dogList = await dogs.getDogsById(searchResponse.resultIds);
			totalPages = Math.ceil(searchResponse.total / pageSize);

			// Update pagination state
			nextPage = searchResponse.next;
			prevPage = searchResponse.prev;
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
		searchDogs(); // Reset to first page on breed change
	}

	function toggleSort() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		searchDogs(); // Reset to first page on sort change
	}

	// Add function to handle favorite toggling
	function handleFavoriteClick(dogId) {
		favorites.toggleFavorite(dogId);
	}

	async function generateMatch() {
		try {
			if ($favorites.size === 0) {
				error = 'Please favorite some dogs first!';
				return;
			}

			matchLoading = true;
			const favoriteIds = [...$favorites];
			const response = await dogs.match(favoriteIds);

			if (response.match) {
				const [matchedDogDetails] = await dogs.getDogsById([response.match]);
				matchedDog = matchedDogDetails;
				matchHistory = [...matchHistory, matchedDogDetails]; // Add to history
				favorites.clearFavorites();
			}
		} catch (err) {
			error = 'Failed to generate match';
			console.error('Match error:', err);
		} finally {
			matchLoading = false;
		}
	}

	function closeMatch() {
		matchedDog = null;
	}

	function removeMatch(matchToRemove) {
		matchHistory = matchHistory.filter((match) => match.id !== matchToRemove.id);
	}
</script>

<FavoritesSummary
	favoriteCount={$favorites.size}
	onGenerateMatch={generateMatch}
	isGenerating={matchLoading}
/>

{#if matchHistory.length > 0}
	<div class="match-history">
		<h2>Your Matches</h2>
		<div class="match-grid">
			{#each matchHistory as match}
				<MatchCard {match} onRemove={removeMatch} />
			{/each}
		</div>
	</div>
{/if}

<h1>Available Dogs</h1>

{#if matchedDog}
	<MatchOverlay {matchedDog} onClose={closeMatch} />
{/if}

<FilterControls
	{breeds}
	{selectedBreed}
	{sortOrder}
	onBreedChange={handleBreedChange}
	onSortToggle={toggleSort}
/>

<!-- Only show pagination when not loading -->
{#if !loading}
	<Pagination
		{currentPage}
		{totalPages}
		itemCount={dogList.length}
		{prevPage}
		{nextPage}
		onPageChange={searchDogs}
	/>
{/if}

{#if loading}
	<div>Loading dogs...</div>
{:else if error}
	<div class="error">{error}</div>
{:else}
	<div class="dog-grid">
		{#each dogList as dog}
			<DogCard {dog} isFavorite={$favorites.has(dog.id)} onFavoriteClick={handleFavoriteClick} />
		{/each}
	</div>
{/if}

<style>
	:global(body) {
		background: white;
		color: black;
		font-family: 'Roboto', sans-serif;
	}

	h1,
	h2 {
		font-family: 'Merriweather', serif;
	}

	.dog-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	.match-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.error {
		color: red;
		padding: 1rem;
	}

	h1 {
		padding: 0 1rem;
		margin-bottom: 1rem;
	}

	.match-history {
		padding: 0 1rem;
	}

	.match-history h2 {
		margin: 0.5rem 0 1rem 0;
	}
</style>
