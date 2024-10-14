import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react'; 
import { deletePlace } from '../../service/placesService';
import styles from './ListaPaginaDestinos.module.css';
import axios from 'axios';
import { getApiUrl } from '../../service/api';

function ListaPaginaDestinos() {
    const [places, setPlaces] = useState([]);
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const token = localStorage.getItem("token")

    async function loadPlaces() {
        try {
            const response = await axios.get(getApiUrl('destinos'), {headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
              }});

            setPlaces(response.data);
        } catch (error) {
            console.log('Falha ao carregar destinos', error);
        }
    }

    async function loadUsers() {
        try {
            const response = await axios.get(getApiUrl('usuarios'), {headers: {
                /* 'Authorization': `${token}`, */
                'Content-Type': 'application/json'
              }});
            setUsers(response.data);
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
    }

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
                                <div className={styles.iconContainer}>
                                <div className={styles.iconEdit}>    
                                <Link to={`/editar-destino/${place.id}`}>
                                    <button className={styles.button}>
                                        <Pencil className={styles.icon} />
                                    </button>
                                </Link>
                                </div>
                                <div className={styles.iconDelete}>
                                <button className={styles.button} onClick={() => handleDelete(place.id)}>
                                    <Trash2 className={styles.icon} />
                                </button>
                                </div>
                                </div>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>

            </table>
        </div>
    )
}

export default ListaPaginaDestinos;
