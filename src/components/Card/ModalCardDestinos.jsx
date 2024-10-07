import React from 'react';
import './CardModalDestinos.css';

const ModalCardDestinos = ({ isOpen, onClose, destino }) => {
  if (!isOpen || !destino) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className='nomeMODAL'>{destino.nome}</h2>
        <p><strong>Categoria:</strong> {destino.categoria_destino}</p>
        <p><strong>CEP:</strong> {destino.cep_destino}</p>
        <p><strong>Número:</strong> {destino.numero_destino}</p>
        <p><strong>Localidade:</strong> {destino.localidade_destino}</p>
        <p><strong>Cidade:</strong> {destino.cidade_destino}</p>
        <p><strong>Latitude:</strong> {destino.latitude}</p>
        <p><strong>Longitude:</strong> {destino.longitude}</p>
        <p><strong>Complemento:</strong> {destino.complemento_destino}</p>
        <p><strong>Descrição:</strong> {destino.descricao_destino}</p>
      </div>
    </div>
  );
};

export default ModalCardDestinos;