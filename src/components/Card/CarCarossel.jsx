import React, { useEffect, useState } from 'react';
import './CardCarrossel.css';
import imgIR from '../../../public/img/proxima.png';
import imgVOLTAR from '../../../public//img/volte.png';
import imgEDITAR from '../../../public//img/escrever.png';
import imgEXCLUIR from '../../../public//img/excluir.png';
import ModalCardDestinos from './ModalCardDestinos';
import axios from 'axios';

const CardCarrossel = () => {
  const [destinos, setDestinos] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [destinoSelecionado, setDestinoSelecionado] = useState(null);
  const token = localStorage.getItem("token")

  useEffect(() => {
    axios.get('http://localhost:3000/destinos', {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      }})
      .then((response) => {
        setDestinos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar destinos:', error)
      });
  }, [])

  const cardsPorPagina = 3;

  const excluirDestino = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/destinos/${id}`, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }})
        const novosDestinos = destinos.filter((destino) => destino.id !== id);
        setDestinos(novosDestinos);
        alert('Destino excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir destino', error);
      alert('Falha ao excluir destino!');
    }

  };

  const editarDestino = (id) => {
    const destinoParaEditar = destinos.find((destino) => destino.id === id);
    alert(`Editar destino: ${destinoParaEditar.nome}`);
  };

  const explorarDestino = (destino) => {
    setDestinoSelecionado(destino);
    setModalOpen(true);
  };

  const proximo = () => {
    setIndiceAtual((prev) => Math.min(prev + 1, Math.ceil(destinos.length / cardsPorPagina) - 1));
  };

  const anterior = () => {
    setIndiceAtual((prev) => Math.max(prev - 1, 0));
  };

  const inicio = indiceAtual * cardsPorPagina;
  const cardsVisiveis = destinos.slice(inicio, inicio + cardsPorPagina);

  return (
    <div className="carrossel">
      <div className="seta" onClick={anterior} style={{ opacity: indiceAtual === 0 ? 0.5 : 1 }}>
        <img src={imgVOLTAR} alt="Anterior" />
      </div>
      <div className="cards-container">
        {cardsVisiveis.map((destino) => (
          <div className="card" key={destino.id}>
            <img src={destino.img_destino} alt={destino.nome_destino} />
            <div className="orgIMG">
              <ul>
                <li>Nome: {destino.nome_destino}</li>
                <li>Cidade: {destino.cidade_destino}</li>
              </ul>
            </div>
            <div className="botoes-acoes">
              <button className="btnVejaMais" onClick={() => explorarDestino(destino)}>Explorar</button>
              <button className="btnEditar" onClick={() => editarDestino(destino.id)}>
                <img src={imgEDITAR} alt="Editar" />
              </button>
              <button className="btnExcluir" onClick={() => excluirDestino(destino.id)}>
                <img src={imgEXCLUIR} alt="Excluir" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="seta" onClick={proximo} style={{ opacity: inicio + cardsPorPagina >= destinos.length ? 0.5 : 1 }}>
        <img src={imgIR} alt="Próximo" />
      </div>
      
      <ModalCardDestinos isOpen={modalOpen} onClose={() => setModalOpen(false)} destino={destinoSelecionado} />
    </div>
  );
};

export default CardCarrossel;
