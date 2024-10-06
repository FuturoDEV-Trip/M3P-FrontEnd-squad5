import React, { useState } from 'react';
import './CardCarrossel.css';
import imgIR from './proxima.png';
import imgVOLTAR from './volte.png';
import imgEDITAR from './escrever.png';
import imgEXCLUIR from './excluir.png';

const destinosIniciais = [
  { id: 1, nome: 'Destino 1', imagem: 'https://via.placeholder.com/200x100?text=Destino+1' },
  { id: 2, nome: 'Destino 2', imagem: 'https://via.placeholder.com/200x100?text=Destino+2' },
  { id: 3, nome: 'Destino 3', imagem: 'https://via.placeholder.com/200x100?text=Destino+3' },
  { id: 4, nome: 'Destino 4', imagem: 'https://via.placeholder.com/200x100?text=Destino+4' },
  { id: 5, nome: 'Destino 5', imagem: 'https://via.placeholder.com/200x100?text=Destino+5' },
  { id: 6, nome: 'Destino 6', imagem: 'https://via.placeholder.com/200x100?text=Destino+6' },
];

const CardCarrossel = () => {
  const [destinos, setDestinos] = useState(destinosIniciais);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const cardsPorPagina = 3;

  const excluirDestino = (id) => {
    const novosDestinos = destinos.filter((destino) => destino.id !== id);
    setDestinos(novosDestinos);
  };

  const editarDestino = (id) => {
    const destinoParaEditar = destinos.find((destino) => destino.id === id);
    alert(`Editar destino: ${destinoParaEditar.nome}`);
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
            <img src={destino.imagem} alt={destino.nome} />
            <div className="orgIMG">
              <ul>
                <li>Nome: {destino.nome}</li>
                <li>Cidade: {destino.nome}</li>
                <li>Categoria: {destino.nome}</li>
              </ul>
              <button className="btnVejaMais">Veja mais</button>
            </div>
            <div className="botoes-acoes">
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
    </div>
  );
};

export default CardCarrossel;
