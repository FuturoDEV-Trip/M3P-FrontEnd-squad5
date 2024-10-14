const API_BASE_URL = 'https://check-green.onrender.com';

export const ENDPOINTS = {
    dashboard: `${API_BASE_URL}/`,
    usuarios: `${API_BASE_URL}/usuarios`,
    destinos: `${API_BASE_URL}/destinos`,
    destinosPublicos: `${API_BASE_URL}/destinos-publicos`,
    login: `${API_BASE_URL}/login`,
    logout: `${API_BASE_URL}/logout`,
};

export const getApiUrl = (endpoint) => `${ENDPOINTS[endpoint]}`;
