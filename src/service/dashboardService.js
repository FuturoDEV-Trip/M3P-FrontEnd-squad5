import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const fetchPlaces = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/destinos-publicos`);
    return response.data;
  } catch (error) {
    console.error('Falha ao carregar informações dos destinos:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usuarios`);
    return response.data;
  } catch (error) {
    console.error('Falha ao carregar informações dos usuários:', error);
    throw error;
  }
};
