import { writable } from 'svelte/store';

const createFavoritesStore = () => {
	const { subscribe, set, update } = writable(new Set());

	return {
		subscribe,
		toggleFavorite: (dogId) => {
			update((favorites) => {
				const newFavorites = new Set(favorites);
				if (newFavorites.has(dogId)) {
					newFavorites.delete(dogId);
				} else {
					newFavorites.add(dogId);
				}
				return newFavorites;
			});
		},
		clearFavorites: () => {
			set(new Set());
		}
	};
};

export const favorites = createFavoritesStore();
