<script>
	export let currentPage;
	export let totalPages;
	export let itemCount;
	export let prevPage;
	export let nextPage;
	export let onPageChange;
</script>

<div class="results-info">
	<span>Showing {itemCount} dogs (page {currentPage} of {totalPages})</span>
	<div class="pagination-buttons">
		<button disabled={!prevPage} on:click={() => onPageChange(prevPage)}> Previous </button>
		<button disabled={!nextPage} on:click={() => onPageChange(nextPage)}> Next </button>
	</div>
</div>

<style>
	.results-info {
		padding: 0 1rem;
		color: #666;
		display: flex;
		flex-wrap: wrap; /* Allow wrapping on mobile */
		gap: 1rem;
		align-items: center;
		justify-content: flex-start;
	}

	.pagination-buttons {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 0.25rem 0.75rem;
	}

	span {
		min-width: 200px;
	}

	/* Make text smaller on mobile */
	@media (max-width: 600px) {
		span {
			font-size: 0.9rem;
			min-width: 100%; /* Full width on mobile */
			text-align: center;
		}

		.pagination-buttons {
			width: 100%;
			justify-content: center;
		}
	}
</style>
