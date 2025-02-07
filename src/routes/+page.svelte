<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/authStore';

	onMount(() => {
		if (!$auth.isAuthenticated) {
			goto('/login');
		} else {
			goto('/search');
		}
	});
</script>

<div>Redirecting...</div>
