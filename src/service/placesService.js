import axios from 'axios';

const API_URL = 'http://localhost:3000/destinos';

export const updatePlace = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar destino:', error);
        throw error;
    }
};

export const deletePlace = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return 'Destino deletado com sucesso';
    } catch (error) {
        console.error('Erro ao deletar destino:', error);
        throw error;
    }
};
