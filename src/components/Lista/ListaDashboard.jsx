import { useEffect, useState } from "react";
import axios from 'axios';
import styles from './ListaDashboard.module.css'; 
import { useAuth } from "../../contexts/Auth";

function ListaDashboard() {
    const [places, setPlaces] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    async function loadPlaces() {
        try {
            const response = await axios.get('http://localhost:3000/destinos-publicos');
            setPlaces(response.data);
        } catch (error) {
            console.log('Falha ao carregar destinos', error);
        }
    }

    async function loadUsers() {
        try {
            const response = await axios.get('http://localhost:3000/usuarios');
            setUsers(response.data);
        } catch (error) {
            console.log('Falha ao carregar usuários', error);
        }
    }

    useEffect(() => {
        loadPlaces();
        loadUsers();
    }, []);

    const placeData = places.map(place => {
        const guide = users.find(u => u.id === place.id_usuario);
        return {
            ...place,
            guideName: guide ? guide.nome_usuario : 'Admin'
        };
    });

    return (
        <div className={styles.tableContainer}>
            <table border="1">
                <thead>
                    <tr>
                        <th>Destino</th>
                        <th>Descrição</th>
                        <th>Guia</th>
                    </tr>
                </thead>

                <tbody>
                {placeData.map(place => (
                            <tr key={place.id}>
                                <td>{place.nome_destino}</td>
                                <td>{place.descricao_destino}</td>
                                <td>{place.guideName}</td>
                        </tr>
                ))}
                </tbody>
                
            </table>
        </div>
    )
}

export default ListaDashboard;