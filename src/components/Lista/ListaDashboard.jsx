import { useEffect, useState } from "react";
import axios from 'axios';
import styles from './ListaDashboard.module.css'; 
import { fetchPlaces, fetchUsers } from '../../service/dashboardService';

function ListaDashboard() {
    const [places, setPlaces] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const placesData = await fetchPlaces();
                const usersData = await fetchUsers();
                setPlaces(placesData);
                setUsers(usersData);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        loadData();
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