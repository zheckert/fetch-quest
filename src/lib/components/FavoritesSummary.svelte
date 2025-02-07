<script>
	export let favoriteCount = 0;
	export let onGenerateMatch;
	export let isGenerating = false;
</script>

<div class="favorites-summary">
	{#if favoriteCount > 0}
		<p>{favoriteCount} {favoriteCount === 1 ? 'dog' : 'dogs'} favorited</p>
		<button on:click={onGenerateMatch} disabled={isGenerating}>
			{#if isGenerating}
				Generating Match...
			{:else}
				Generate Match!
			{/if}
		</button>
	{:else}
		<p>Favorite some dogs to generate a match!</p>
	{/if}
</div>

<style>
	.favorites-summary {
		padding: 0.5rem 1rem;
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	button {
		background: #fba919;
		color: black;
		border: none;
		border-radius: 4px;
		transition: background 0.2s;
		padding: 0.25rem 0.5rem;
	}

	button:hover {
		background: #fbb437;
	}
</style>
