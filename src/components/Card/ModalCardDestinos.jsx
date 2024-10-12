import styles from './ModalCardDestinos.module.css';

const ModalCardDestinos = ({ isOpen, onClose, destino }) => {
  if (!isOpen || !destino) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2 className={styles.nomeModal}>{destino.nome}</h2>
        <p><strong>Categoria:</strong> {destino.categoria_destino}</p>
        <p><strong>CEP:</strong> {destino.cep_destino}</p>
        <p><strong>Cidade:</strong> {destino.cidade_destino}</p>
        <p><strong>Localidade:</strong> {destino.localidade_destino}</p>
        {/* <p><strong>Número:</strong> {destino.id}</p> */}
        <p><strong>Latitude:</strong> {destino.latitude_destino}</p>
        <p><strong>Longitude:</strong> {destino.longitude_destino}</p>
        <p><strong>Complemento:</strong> {destino.complemento_destino}</p>
        <p><strong>Descrição:</strong> {destino.descricao_destino}</p>
      </div>
    </div>
  );
};

export default ModalCardDestinos;