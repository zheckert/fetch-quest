<script>
	import { auth } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Only run on client-side
	$: if (browser && !$auth.isAuthenticated && !$page.url.pathname.includes('/login')) {
		goto('/login');
	}

	async function handleLogout() {
		try {
			await auth.logout();
			goto('/login');
		} catch (err) {
			console.error('Logout error:', err);
		}
	}
</script>

<nav class:authenticated={$auth.isAuthenticated}>
	{#if $auth.isAuthenticated}
		<div class="user-info">
			Welcome, {$auth.user.name}
			<button on:click={handleLogout}>Logout</button>
		</div>
	{/if}
</nav>

<main>
	<slot />
</main>

<style>
	nav {
		padding: 1rem;
	}

	nav.authenticated {
		border-bottom: 1px solid #ddd;
	}

	.user-info {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: flex-end;
	}

	main {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
