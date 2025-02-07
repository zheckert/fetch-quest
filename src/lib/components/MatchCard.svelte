<script>
	export let match;
	export let onRemove;
</script>

<div class="match-card">
	<button class="remove-match-btn" on:click={() => onRemove(match)} title="Remove match">
		&times;
	</button>
	<img src={match.img} alt={match.name} />
	<div class="match-info">
		<h3>{match.name}</h3>
		<p>{match.breed}</p>
	</div>
</div>

<style>
	.match-card {
		border: 2px solid #7d1f70;
		border-radius: 4px;
		overflow: hidden;
		background: white;
		position: relative;
	}

	img {
		height: 150px;
		width: 100%;
		object-fit: cover;
	}

	.match-info {
		padding: 0.5rem;
		text-align: center;
	}

	h3 {
		margin: 0;
		font-size: 1.1rem;
		font-family: 'Merriweather', serif;
	}

	p {
		margin: 0.25rem 0 0 0;
		color: #666;
	}

	.remove-match-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		font-size: 1.75rem;
		cursor: pointer;
		padding: 0 0 4px 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
		color: white;
		z-index: 1;
		border-radius: 4px;
		transform: translateY(-1px);
	}

	.remove-match-btn:hover {
		background: rgba(0, 0, 0, 0.8);
		color: #fba919;
	}
</style>
