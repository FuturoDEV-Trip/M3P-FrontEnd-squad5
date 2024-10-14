import { useEffect, useState } from "react";
import { fetchPlaces, fetchUsers } from '../../service/dashboardService';
import styles from './CardsDashboard.module.css';

function CardsDashboard() {
    const [places, setPlaces] = useState([]);
    const [users, setUsers] = useState([]);
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

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

    return (
        <div className={styles.cardsContainer}>
            {places.map((place) => {
                const user = users.find((u) => u.id === place.id_usuario);
                return (
                    <div key={place.id} className={styles.cardView}>
                        <img src={place.imagem_destino || `https://picsum.photos/200?random=${Math.random()}`} alt={place.nome_destino} />
                        <div className={styles.cardContent}>
                            <h3>{place.nome_destino}</h3>
                            <div className={styles.infoContainer}>
                                <span className={styles.category}>{place.categoria_destino}</span>
                                <span className={styles.city}>{place.cidade_destino}</span>
                            </div>
                            <small className={styles.user}>Guia: {user?.nome_usuario || 'Admin'}</small>
                            <p className={styles.description}>
                                {expanded[place.id] 
                                    ? place.descricao_destino 
                                    : `${place.descricao_destino.substring(0, 60)}...`}
                            </p>
                            <button 
                                className={styles.exploreButton} 
                                onClick={() => toggleExpand(place.id)}
                            >
                                {expanded[place.id] ? "Ver menos" : "Explorar"}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CardsDashboard;