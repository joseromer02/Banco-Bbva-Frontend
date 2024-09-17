import axios from 'axios';

const bbvaApi = axios.create({
    baseURL: 'http://localhost:8080',
});

bbvaApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default bbvaApi;