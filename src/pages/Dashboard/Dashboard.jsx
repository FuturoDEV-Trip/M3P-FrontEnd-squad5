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
    }, []);

    return (
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardMenu}>
                <Sidebar />
                </div>
                <main className={styles.mainContent}>
                    <h1>Lounge</h1>
                    {user ? (
                        <p>Que bom ter você aqui, {user?.nome_usuario || ''}! Vamos explorar novos destinos?</p>
                    ) : (
                        <p>Bem-vindo(a) ao Check Green! Explore destinos sustentáveis ao redor do mundo.</p>
                    )}

                        <div className={styles.cardsContainer}>
                            <Card title="Guias" total={userCount} iconElement={UsersRound} />
                            <Card title="Destinos" total={placeCount} iconElement={MapPinned} />
                        </div>

                        <div className={styles.listContainer}>
                            <h4>Descubra destinos sustentáveis prontos para serem explorados:</h4>
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
