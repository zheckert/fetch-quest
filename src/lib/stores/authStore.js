import { writable } from 'svelte/store';

const createAuthStore = () => {
	const { subscribe, set, update } = writable({
		isAuthenticated: false,
		user: null
	});

	return {
		subscribe,
		login: (user) => {
			set({ isAuthenticated: true, user });
		},
		logout: () => {
			set({ isAuthenticated: false, user: null });
		}
	};
};

export const auth = createAuthStore();
