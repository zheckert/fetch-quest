<script>
	export let matchedDog;
	export let onClose;
</script>

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
		<button on:click={onClose}>Close</button>
	</div>
</div>

<style>
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
		border: 2px solid #7d1f70;
	}

	.match-content button {
		margin-top: 1.5rem;
	}

	h2,
	h3 {
		font-family: 'Merriweather', serif;
	}

	.dog-info {
		padding: 1rem;
	}

	img {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}
</style>
