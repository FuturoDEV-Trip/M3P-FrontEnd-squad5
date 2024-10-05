import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { PartyPopper, TableProperties, MapPinned } from 'lucide-react';
import MapaPaginaDestinos from '../../components/Mapa/MapaPaginaDestinos';
import ListaPaginaDestinos from '../../components/Lista/ListaPaginaDestinos';
import Sidebar from '../../components/Sidebar/Sidebar';
import BotaoVoltar from '../../components/Botao/BotaoVoltar';
import styles from './Destinos.module.css';

function Destinos() {
    const [viewMode, setViewMode] = useState('list');
    return (
    
        <div className={styles.placesContainer}>
            <div className={styles.placesMenu}>
            <Sidebar />
            </div>
            <main className={styles.mainContent}>
                <div className={styles.mainHeader}>
                    <h1>Destinos</h1>
                    <div className={styles.mainText}>
                    <p>Destinos favoritos já descobertos e compartilhados com o mundo<PartyPopper className={styles.iconParty} /></p> 
                        <Link className={styles.link} to="/adicionar-destinos">
                            <button>Novo Destino</button>
                        </Link>
                    </div>
                </div>
                <div className={styles.mainView}>
                    <TableProperties 
                    className={`${styles.icon} ${viewMode === 'list' ? styles.active : ''}`}
                    onClick={() => setViewMode('list')}
                    />
                    <MapPinned 
                    className={`${styles.icon} ${viewMode === 'map' ? styles.active : ''}`}
                    onClick={() => setViewMode('map')}
                    />
                    <BotaoVoltar />
                </div>
                <div className={styles.alternateView}>
                    {viewMode === 'list' ? <ListaPaginaDestinos /> : <MapaPaginaDestinos />}
                </div>
            </main>
        </div>
    )
}

export default Destinos;

