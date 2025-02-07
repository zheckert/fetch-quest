<script>
	import { onMount } from 'svelte';
	import { dogs } from '$lib/api';
	import { favorites } from '$lib/stores/favoritesStore';

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

<!-- First the favorites and matches sections -->
<div class="favorites-summary">
	{#if $favorites.size > 0}
		<p>{$favorites.size} {$favorites.size === 1 ? 'dog' : 'dogs'} favorited</p>
		<button on:click={generateMatch} disabled={matchLoading}>
			{#if matchLoading}
				Generating Match...
			{:else}
				Generate Match!
			{/if}
		</button>
	{:else}
		<p>Favorite some dogs to generate a match!</p>
	{/if}
</div>

{#if matchHistory.length > 0}
	<div class="match-history">
		<h2>Your Matches</h2>
		<div class="match-grid">
			{#each matchHistory as match}
				<div class="match-card">
					<button class="remove-match-btn" on:click={() => removeMatch(match)} title="Remove match">
						&times;
					</button>
					<img src={match.img} alt={match.name} />
					<div class="match-info">
						<h3>{match.name}</h3>
						<p>{match.breed}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<!-- Then the available dogs section -->
<h1>Available Dogs</h1>

{#if matchedDog}
	<div class="match-overlay">
		<div class="match-content">
			<h2>Congratulations!</h2>
			<h3>You've been matched with {matchedDog.name}!</h3>
			<div class="dog-card matched">
				<img src={matchedDog.img} alt={matchedDog.name} />
				<div class="dog-info">
					<h3>{matchedDog.name}</h3>
					<p><strong>Breed:</strong> {matchedDog.breed}</p>
					<p><strong>Age:</strong> {matchedDog.age} {matchedDog.age === 1 ? 'year' : 'years'}</p>
					<p><strong>Location:</strong> {matchedDog.zip_code}</p>
				</div>
			</div>
			<button on:click={closeMatch}>Close</button>
		</div>
	</div>
{/if}

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
	{#if !selectedBreed}
		<button on:click={toggleSort}>
			Sort {sortOrder === 'asc' ? 'ascending' : 'descending'}
		</button>
	{/if}
</div>

<div class="results-info">
	{#if !loading && !error}
		Showing {dogList.length} dogs (page {currentPage} of {totalPages})
	{/if}
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
				<button
					class="favorite-btn"
					class:active={$favorites.has(dog.id)}
					on:click={() => handleFavoriteClick(dog.id)}
				>
					{$favorites.has(dog.id) ? '❤️' : '🤍'}
				</button>
				<div class="dog-info">
					<h3>{dog.name}</h3>
					<p><strong>Breed:</strong> {dog.breed}</p>
					<p><strong>Age:</strong> {dog.age} {dog.age === 1 ? 'year' : 'years'}</p>
					<p><strong>Location:</strong> {dog.zip_code}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Pagination controls -->
	<div class="pagination">
		<button disabled={!prevPage} on:click={() => searchDogs(prevPage)}> Previous </button>
		<button disabled={!nextPage} on:click={() => searchDogs(nextPage)}> Next </button>
	</div>
{/if}

<style>
	:global(body) {
		background: white;
		color: black;
		font-family: 'Roboto', sans-serif;
	}

	h1,
	h2,
	h3 {
		font-family: 'Merriweather', serif;
	}

	button {
		background: #7d1f70;
		color: white;
		border: none;
		border-radius: 4px;
		transition: background 0.2s;
	}

	button:hover {
		background: #8f2380;
	}

	.favorite-btn {
		/* Keep transparent background for heart buttons */
		background: none;
	}

	.dog-card {
		border: 1px solid #ddd;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.match-content {
		border: 2px solid #7d1f70;
	}

	.favorites-summary button {
		background: #fba919;
		color: black;
	}

	.favorites-summary button:hover {
		background: #fbb437;
	}

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
		position: relative;
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
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	select {
		margin-left: 0.5rem;
		padding: 0.25rem;
	}

	button {
		padding: 0.25rem 0.5rem;
	}

	.pagination {
		padding: 1rem;
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.pagination button {
		padding: 0.5rem 1rem;
	}

	.pagination button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.results-info {
		padding: 0 1rem;
		color: #666;
	}

	.favorite-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.5rem;
	}

	.favorites-summary {
		padding: 0.5rem 1rem;
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.match-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.match-content {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		max-width: 500px;
		width: 90%;
		text-align: center;
	}

	h1 {
		padding: 0 1rem; /* Match other content padding */
		margin-bottom: 1rem;
	}

	.match-content button {
		margin-top: 1.5rem; /* Add space above the close button */
	}

	/* ... or if you want to be more specific ... */
	.match-content > button:last-child {
		margin-top: 1.5rem;
	}

	.match-history {
		padding: 1rem;
	}

	.match-history h2 {
		margin-bottom: 1rem;
	}

	.match-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.match-card {
		border: 2px solid #7d1f70;
		border-radius: 4px;
		overflow: hidden;
		background: white;
		position: relative; /* For absolute positioning of remove button */
	}

	.match-card img {
		height: 150px;
	}

	.match-info {
		padding: 0.5rem;
		text-align: center;
	}

	.match-info h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.match-info p {
		margin: 0.25rem 0 0 0;
		color: #666;
	}

	.remove-match-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		font-size: 1.75rem; /* Smaller size */
		cursor: pointer;
		padding: 0 0 4px 0; /* top right bottom left */
		width: 24px; /* Smaller width */
		height: 24px; /* Smaller height */
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
		color: white;
		z-index: 1;
		border-radius: 4px;
		transform: translateY(-1px); /* Slight vertical adjustment */
	}

	.remove-match-btn:hover {
		background: rgba(0, 0, 0, 0.8); /* Darker on hover */
		color: #fba919; /* Keep yellow hover color */
	}
</style>
