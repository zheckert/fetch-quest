<script>
	import { auth } from '$lib/stores/authStore';
	import { auth as authApi } from '$lib/api';
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let error = null;

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
	<h1>Welcome to Fetch</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="name">Name:</label>
			<input type="text" id="name" bind:value={name} required />
		</div>

		<div class="form-group">
			<label for="email">Email:</label>
			<input type="email" id="email" bind:value={email} required />
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<button type="submit">Login</button>
	</form>
</div>

<style>
	.login-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
	}

	input {
		width: 100%;
		padding: 0.5rem;
	}

	button {
		width: 100%;
		padding: 0.5rem;
	}

	.error {
		margin-bottom: 1rem;
	}
</style>
