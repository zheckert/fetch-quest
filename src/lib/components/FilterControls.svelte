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
		gap: 1rem;
		align-items: center;
	}

	select {
		margin-left: 0.5rem;
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
</style>
