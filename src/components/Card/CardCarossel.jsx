import { useEffect, useState } from "react";
import styles from "./CardCarrossel.module.css";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import ModalCardDestinos from "./ModalCardDestinos";
import axios from "axios";
import { Link } from "react-router-dom";
import { getApiUrl } from '../../service/api';

const CardCarrossel = () => {
  const [destinos, setDestinos] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [destinoSelecionado, setDestinoSelecionado] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(getApiUrl('destinos'), {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDestinos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar destinos:", error);
      });
  }, []);

  const cardsPorPagina = 3;

  const preencherComEspacosVazios = () => {
    const diff = cardsPorPagina - cardsVisiveis.length;
    if (diff > 0) {
      return Array(diff).fill(null);
    }
    return [];
  };

  const excluirDestino = async (id) => {
    if (window.confirm("Você tem certeza que quer deletar este destino?")) {
      try {
        await axios.delete(getApiUrl('destinos') + `/${id}`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        const novosDestinos = destinos.filter((destino) => destino.id !== id);
        setDestinos(novosDestinos);
        alert("Destino excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir destino", error);
        alert("Falha ao excluir destino!");
      }
    }
  };

  const explorarDestino = (destino) => {
    setDestinoSelecionado(destino);
    setModalOpen(true);
  };

  const proximo = () => {
    setIndiceAtual((prev) =>
      (prev + 1) % Math.ceil(destinos.length / cardsPorPagina)
    );
  };

  const anterior = () => {
    setIndiceAtual((prev) =>
      (prev - 1 + Math.ceil(destinos.length / cardsPorPagina)) % Math.ceil(destinos.length / cardsPorPagina)
    );
  };

  const inicio = indiceAtual * cardsPorPagina;
  const cardsVisiveis = destinos.slice(inicio, inicio + cardsPorPagina);

  return (
    <>
      <div className={styles.carrossel}>
        {destinos.length === 0 ? (
          <div className={styles.mensagemVazia}>
            <div className={styles.oscilacao}></div>
            <p>Seu mapa de viagem começa aqui. Que tal compartilhar suas melhores rotas?</p>
          </div>
        ) : (
          <>
            <div
              className={styles.seta}
              onClick={anterior}
              style={{ opacity: indiceAtual === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={32} alt="Anterior" />
            </div>
            <div className={styles.cardsContainer}>
              {cardsVisiveis.map((destino) => (
                <div className={styles.card} key={destino.id}>
                  <div className={styles.cardImage}>
                    <img
                      src={`https://picsum.photos/200?random=${Math.random()}`}
                      alt={destino.nome_destino}
                    />
                  </div>
                  <div className={styles.orgImg}>
                    <ul>
                      <li>{destino.nome_destino}</li>
                      <li>{destino.cidade_destino}</li>
                    </ul>
                  </div>
                  <div className={styles.botoesAcoes}>
                    <button
                      className={styles.btnVejaMais}
                      onClick={() => explorarDestino(destino)}
                    >
                      Explorar
                    </button>
                    <Link to={`/editar-destino/${destino.id}`}>
                      <button className={styles.btnEditar}>
                        <Pencil />
                      </button>
                    </Link>
                    <button
                      className={styles.btnExcluir}
                      onClick={() => excluirDestino(destino.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
              {preencherComEspacosVazios().map((_, index) => (
                <div className={styles.cardPlaceholder} key={`placeholder-${index}`}></div>
              ))}
            </div>
            <div
              className={styles.seta}
              onClick={proximo}
              style={{
                opacity: inicio + cardsPorPagina >= destinos.length ? 0.5 : 1,
              }}
            >
              <ChevronRight size={32} alt="Próximo" />
            </div>
          </>
        )}

        <ModalCardDestinos
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          destino={destinoSelecionado}
        />
      </div>
    </>
  );
};

export default CardCarrossel;
