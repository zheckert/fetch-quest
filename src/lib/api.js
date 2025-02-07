import axios from 'axios';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true // Required for the auth cookie to work
});

export const auth = {
	login: async (name, email) => {
		const response = await api.post('/auth/login', { name, email });
		return response.data;
	},
	logout: async () => {
		await api.post('/auth/logout');
	}
};

export const dogs = {
	search: async (params) => {
		const response = await api.get('/dogs/search', { params });
		return response.data;
	},
	getBreeds: async () => {
		const response = await api.get('/dogs/breeds');
		return response.data;
	},
	getDogsById: async (ids) => {
		const response = await api.post('/dogs', ids);
		return response.data;
	},
	match: async (dogIds) => {
		const response = await api.post('/dogs/match', dogIds);
		return response.data;
	}
};
