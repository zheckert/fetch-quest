<script>
	import { auth } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

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
	<span class="logo">FetchQuest</span>
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
	.logo {
		font-family: 'Merriweather', serif;
		color: #7d1f70;
		font-size: 1.5rem;
		font-weight: bold;
	}

	nav {
		padding: 0.5rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
