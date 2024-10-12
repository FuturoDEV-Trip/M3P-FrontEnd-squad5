import { useState } from "react";
import MapaPaginaDestinos from '../../components/Mapa/MapaPaginaDestinos';
import styles from './ModalCardDestinos.module.css';

const ModalCardDestinos = ({ isOpen, onClose, destino }) => {
  const [activeTab, setActiveTab] = useState('detalhes');

  if (!isOpen || !destino) return null;

  return (
      <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'detalhes' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('detalhes')}
          >
            Explore
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'imagem' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('imagem')}
          >
            Visualize
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'mapa' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('mapa')}
          >
            Interaja
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'detalhes' && (
            <div>
              <h2 className={styles.nomeModal}>{destino.nome_destino}</h2>
              <p><strong>Categoria:</strong> {destino.categoria_destino}</p>
              <p><strong>CEP:</strong> {destino.cep_destino}</p>
              <p><strong>Cidade:</strong> {destino.cidade_destino}</p>
              <p><strong>Endereço:</strong> {destino.localidade_destino}</p>
              <p><strong>Descrição:</strong> {destino.descricao_destino}</p>
              <details>
              <summary>Mais Detalhes</summary>
              <p><strong>CEP:</strong> {destino.cep_destino}</p>
              <p><strong>Latitude:</strong> {destino.latitude_destino}</p>
              <p><strong>Longitude:</strong> {destino.longitude_destino}</p>
              <p><strong>Complemento:</strong> {destino.complemento_destino}</p>
              </details>
            </div>
          )}
          {activeTab === 'imagem' && (
            <div className={styles.imageTitle}>
                <h3>Galeria de Fotos</h3>
              <div className={styles.modalImage}>
                <img src={destino.img_destino} alt={destino.nome_destino} />
              </div>
            </div>
          )}
          {activeTab === 'mapa' && (
            <div className={styles.mapTitle}>
              <h3>Mapa</h3>
              <div className={styles.mapContainer}>
                <MapaPaginaDestinos latitude={destino.latitude_destino} longitude={destino.longitude_destino} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCardDestinos;