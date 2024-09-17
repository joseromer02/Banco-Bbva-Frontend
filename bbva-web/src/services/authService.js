import bbvaApi from './bbvaApi.js';

export const login = async (credentials) => {
    const response = await bbvaApi.post('/api/v1/auth/login', credentials);
    return response.data;
};

export const register = async (credentials) => {
    const response = await bbvaApi.post('/api/v1/usuarios', credentials);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};
