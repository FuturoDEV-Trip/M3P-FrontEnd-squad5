import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react'; 
import { deletePlace } from '../../service/placesService';
import styles from './ListaPaginaDestinos.module.css';

function ListaPaginaDestinos() {
    const [places, setPlaces] = useState([]);
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

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

    async function handleDelete(id) {
        if (window.confirm('Você tem certeza que quer deletar este destino?')) {
            try {
                const message = await deletePlace(id);
                setSuccessMessage(message);
                alert('Destino deletado com sucesso!');
                setPlaces(places.filter(place => place.id !== id));
            } catch (error) {
                console.error('Erro ao deletar destino', error);
                alert('Falha ao deletar destino!');
            }
        }
    };

    useEffect(() => {
        loadPlaces();
        loadUsers();
    }, []);

    return (
        <div className={styles.tableContainer}>
            <table border="1">
                <thead>
                    <tr>
                        <th>Destino</th>
                        <th>Categoria</th> 
                        <th>Guia</th>
                        <th>Ações</th> 
                    </tr>
                </thead>

                <tbody>
                    {places.map(place => {
                        const user = users.find(user => user.id === place.id_usuario);
                        return (
                            <tr key={place.id}>
                            <td>{place.nome_destino}</td>
                            <td>{place.categoria_destino}</td> 
                            <td>{user ? user.nome_usuario : 'Admin'}</td>
                            <td>
                                <Link to={`/editar-destino/${place.id}`}>
                                    <button className={styles.button}>
                                        <Pencil className={styles.icon} />
                                    </button>
                                </Link>
                                <button className={styles.button} onClick={() => handleDelete(place.id)}>
                                    <Trash2 className={styles.icon} />
                                </button>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>

            </table>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        </div>
    )
}

export default ListaPaginaDestinos;
