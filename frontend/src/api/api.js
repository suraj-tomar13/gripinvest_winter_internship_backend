const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong.');
    }
    return response.json();
};

export const auth = {
    signup: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    },
};

export const products = {
    getAll: async (token) => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return handleResponse(response);
    },
};

export const investments = {
    getPortfolio: async (token) => {
        const response = await fetch(`${API_BASE_URL}/investments/portfolio`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return handleResponse(response);
    },
};

export const transactions = {
    getLogs: async (token) => {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return handleResponse(response);
    },
};