<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/authStore';
	import { auth as authApi } from '$lib/api';
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let error = null;

	// Redirect if already logged in
	onMount(() => {
		if ($auth.isAuthenticated) {
			goto('/search');
		}
	});

	async function handleSubmit() {
		try {
			error = null;
			await authApi.login(name, email);
			auth.login({ name, email });
			goto('/search');
		} catch (err) {
			error = 'Login failed. Please check your credentials.';
			console.error('Login error:', err);
		}
	}
</script>

<div class="login-container">
	<h1>Welcome to FetchQuest!</h1>
	<h3 class="intro">
		Let us help you match with your ultimate furry friend! Enter your details below to get started.
	</h3>

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="name">Your Name:</label>
			<input type="text" id="name" bind:value={name} required placeholder="Enter your name" />
		</div>

		<div class="form-group">
			<label for="email">Your Email:</label>
			<input type="email" id="email" bind:value={email} required placeholder="Enter your email" />
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<button type="submit">Start Searching</button>
	</form>
</div>

<style>
	:global(body) {
		background: white;
		color: black;
		font-family: 'Roboto', sans-serif;
	}

	h1,
	h3 {
		font-family: 'Merriweather', serif;
	}

	.login-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1rem;
	}

	.intro {
		margin-bottom: 2rem;
		color: #666;
	}

	.form-group {
		text-align: left;
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	button {
		max-width: 200px;
		width: 100%;
		padding: 0.75rem;
		background: #7d1f70;
		color: white;
		border: none;
		border-radius: 4px;
		font-family: 'Roboto', sans-serif;
		transition: background 0.2s;
	}

	button:hover {
		background: #8f2380;
	}

	.error {
		color: red;
		margin-bottom: 1rem;
	}

	form {
		text-align: center;
	}
</style>
