import axios from 'axios';
import { getApiUrl } from './api';

const token = localStorage.getItem("token")

export const updatePlace = async (id, updatedData) => {
    try {
        const response = await axios.put(getApiUrl('destinos') + `/${id}`, updatedData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
        }, updatedData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar destino:', error);
        throw error;
    }
};

export const deletePlace = async (id) => {
    try {
        await axios.delete(getApiUrl('destinos') + `/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }});
        return 'Destino deletado com sucesso';
    } catch (error) {
        console.error('Erro ao deletar destino:', error);
        throw error;
    }
};
