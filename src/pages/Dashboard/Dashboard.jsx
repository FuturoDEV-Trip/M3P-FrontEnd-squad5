import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { UsersRound, MapPinned, List, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../contexts/Auth';
import MapaDashboard from '../../components/Mapa/MapaDashboard';
import Sidebar from '../../components/Sidebar/Sidebar';
import ListaDashboard from '../../components/Lista/ListaDashboard';
import CardsDashboard from '../../components/Card/CardsDashboard';
import Card from '../../components/Card/Card';
import styles from './Dashboard.module.css';
import axios from 'axios';

function Dashboard() {
    const [userCount, setUserCount] = useState(0);
    const [placeCount, setPlaceCount] = useState(0);
    const [viewMode, setViewMode] = useState('cards');
    const [loggedIn, setLoggedIn] = useState(false);
    const { user } = useAuth();

    async function fetchUserCount() {
        try {
            const response = await axios.get('http://localhost:3000/');
            setUserCount(response.data.usuariosAtivos);
        } catch (error) {
            console.log('Falha ao contabilizar usuários', error);
        }
    }

    async function fetchPlaceCount() {
        try {
            const response = await axios.get('http://localhost:3000/');
            setPlaceCount(response.data.totalLocais);
        } catch (error) {
            console.log('Falha ao contabilizar destinos', error);
        }
    }

    useEffect(() => {
        fetchUserCount();
        fetchPlaceCount();
        if (user) {
            setLoggedIn(true); 
        }
    }, [user]);

    return (
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardMenu}>
                <Sidebar />
                </div>
                <main className={styles.mainContent}>
                    <h1>{user ? 'Lounge': 'Estação'}</h1>
                    {user ? (
                            <p className={styles.welcomeMessage}>Que bom ter você aqui, {user?.nome_usuario || ''}! Vamos explorar novos destinos?</p>
                    ) : (
                        <p>Bem-vindo(a) ao Check Green!</p>
                    )}

                        <div className={styles.cardsContainer}>
                            <Card title="Guias" total={userCount} iconElement={UsersRound} />
                            <Card title="Destinos" total={placeCount} iconElement={MapPinned} />
                        </div>

                        <div className={styles.listContainer}>
                    {user ? (
                            <p>Aqui, cada destino conta uma história verde — seja para relaxar em um paraíso eco-friendly ou descobrir novas culturas de forma consciente. Faça parte de uma comunidade de viajantes que transformam suas jornadas em experiências inesquecíveis, com o planeta no coração. Vamos fazer as malas e desbravar o mundo de um jeito mais verde?</p>
                    ) : (
                            <p className={styles.explorationMessage}>Última chamada para o embarque! Faça o check-in e descubra destinos inspiradores que vão fazer você querer arrumar as malas para a próxima viagem.</p>
                        )}
                            <div className={styles.mainView}>
                            <LayoutGrid 
                            className={`${styles.icon} ${viewMode === 'cards' ? styles.active : ''}`}
                            onClick={() => setViewMode('cards')}
                            />
                            <List 
                            className={`${styles.icon} ${viewMode === 'list' ? styles.active : ''}`}
                            onClick={() => setViewMode('list')}
                            />
                            <MapPinned 
                            className={`${styles.icon} ${viewMode === 'map' ? styles.active : ''}`}
                            onClick={() => setViewMode('map')}
                            />
                            </div>
                        </div>
                        <div className={styles.alternateView}>
                            {viewMode === 'cards' ? <CardsDashboard /> : viewMode === 'list' ? <ListaDashboard /> : <MapaDashboard />}
                        </div>
                </main>
            </div>
    );
}

export default Dashboard;
