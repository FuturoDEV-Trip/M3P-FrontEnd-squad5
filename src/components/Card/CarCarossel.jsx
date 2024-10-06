import React, { useState } from 'react';
import './CardCarrossel.css'; 

const imagens = [
  'https://via.placeholder.com/600x300?text=Imagem+1',
  'https://via.placeholder.com/600x300?text=Imagem+2',
  'https://via.placeholder.com/600x300?text=Imagem+3',
];

const Carrossel = () => {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const proximo = () => {
    setIndiceAtual((prev) => (prev + 1) % imagens.length);
  };

  const anterior = () => {
    setIndiceAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  return (
    <div className="carrossel">
      <button onClick={anterior}>Anterior</button>
      <img src={imagens[indiceAtual]} alt={`Imagem ${indiceAtual + 1}`} />
      <button onClick={proximo}>Próximo</button>
    </div>
  );
};

export default Carrossel;
