<script>
	export let dog;
	export let isFavorite = false;
	export let onFavoriteClick;
</script>

<div class="dog-card">
	<img src={dog.img} alt={dog.name} />
	<button class="favorite-btn" class:active={isFavorite} on:click={() => onFavoriteClick(dog.id)}>
		{isFavorite ? '❤️' : '🤍'}
	</button>
	<div class="dog-info">
		<h3>{dog.name}</h3>
		<p><strong>Breed:</strong> {dog.breed}</p>
		<p><strong>Age:</strong> {dog.age} {dog.age === 1 ? 'year' : 'years'}</p>
		<p><strong>Location:</strong> {dog.zip_code}</p>
	</div>
</div>

<style>
	.dog-card {
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
		font-family: 'Merriweather', serif;
	}

	p {
		margin: 0.25rem 0;
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
</style>
