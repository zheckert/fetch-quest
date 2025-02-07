<script>
	export let breeds = [];
	export let selectedBreed = '';
	export let sortOrder = 'asc';
	export let onBreedChange;
	export let onSortToggle;
</script>

<div class="filters">
	<label>
		Filter by breed:
		<select value={selectedBreed} on:change={onBreedChange}>
			<option value="">All Breeds</option>
			{#each breeds as breed}
				<option value={breed}>{breed}</option>
			{/each}
		</select>
	</label>
	{#if !selectedBreed}
		<button on:click={onSortToggle}>
			Sort {sortOrder === 'asc' ? 'ascending' : 'descending'}
		</button>
	{/if}
</div>

<style>
	.filters {
		padding: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}

	label {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	select {
		max-width: 200px;
		padding: 0.25rem;
	}

	button {
		background: #7d1f70;
		color: white;
		border: none;
		border-radius: 4px;
		transition: background 0.2s;
		padding: 0.25rem 0.5rem;
	}

	button:hover {
		background: #8f2380;
	}

	@media (max-width: 600px) {
		.filters {
			flex-direction: column;
			align-items: stretch;
		}

		select {
			max-width: 100%;
		}

		label {
			width: 100%;
		}
	}
</style>
