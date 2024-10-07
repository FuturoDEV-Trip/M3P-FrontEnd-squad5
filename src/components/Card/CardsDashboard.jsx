import { useEffect, useState } from "react";
import axios from 'axios';
import styles from './CardsDashboard.module.css';
import { useAuth } from '../../contexts/Auth';

function CardsDashboard() {
    const [places, setPlaces] = useState([]);
    const [expanded, setExpanded] = useState({});
    const { user } = useAuth();

    const toggleExpand = (id) => {
        setExpanded((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    useEffect(() => {
        const fetchPlaces = async () => {
            if (!user || !user.token) {
                return; 
            }
            try {
                const response = await axios.get('http://localhost:3000/destinos', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setPlaces(response.data);
            } catch (error) {
                console.error('Erro ao carregar informações do destino:', error);
            }
        };

        fetchPlaces();
    }, [user]);

    return (
        <div className={styles.cardsContainer}>
            {places.map((place) => (
                <div key={place.id} className={styles.cardView}>
                    
                    <img src={place.imagem_destino || 'https://via.placeholder.com/300'} alt={place.nome_destino} />
                    
                <div className={styles.cardContent}>
                    <h3>{place.nome_destino}</h3>
                    {/* <span className={styles.category}>{place.categoria_destino}</span> */}
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
            ))}
        </div>
    )
}

export default CardsDashboard;