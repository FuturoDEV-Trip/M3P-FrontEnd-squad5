import axios from 'axios';
import { getApiUrl } from './api';

export const fetchPlaces = async () => {
  try {
    const response = await axios.get(getApiUrl('destinosPublicos'));
    return response.data;
  } catch (error) {
    console.error('Falha ao carregar informações dos destinos:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(getApiUrl('usuarios'));
    return response.data;
  } catch (error) {
    console.error('Falha ao carregar informações dos usuários:', error);
    throw error;
  }
};
