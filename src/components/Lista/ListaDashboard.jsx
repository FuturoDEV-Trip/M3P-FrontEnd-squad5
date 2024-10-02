import { useEffect, useState } from "react";
import styles from './ListaDashboard.module.css'; 
import { useAuth } from "../../contexts/Auth";

function ListaDashboard() {
    const [places, setPlaces] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    async function loadPlaces() {
        try {
            const response = await fetch('http://localhost:3000/destinos');
            if (!response.ok) {
                throw new Error('Ops! Servidor sem resposta.');
            }
            const data = await response.json();
            setPlaces(data);
        } catch (error) {
            console.log('Falha ao carregar destinos', error);
        }
    }

    async function loadUsers() {
        try {
            const response = await fetch('http://localhost:3000/usuarios');
            if (!response.ok) {
                throw new Error('Ops! Servidor sem resposta.');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.log('Falha ao carregar usuários', error);
        }
    }

    useEffect(() => {
        loadPlaces();
        loadUsers();
    }, []);

    const placeData = places.map(place => {
        // Check if the current place belongs to the logged-in user
        if (user && user.id === place.id_usuario) {
            return { ...place, guideName: user.nome_usuario };
        }

        // Find the corresponding user from the users array
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
                        <th>Guia</th>
                    </tr>
                </thead>

                <tbody>
                {placeData.map(place => (
                            <tr key={place.id}>
                                <td>{place.nome_destino}</td>
                                <td>{place.guideName}</td>
                        </tr>
                ))}
                </tbody>
                
            </table>
        </div>
    )
}

export default ListaDashboard;