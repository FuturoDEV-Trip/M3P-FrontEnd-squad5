import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";
import getAddressFromCep from "../../service/addressService";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Plane, Undo2 } from "lucide-react";
import styles from "./AdicionarDestinos.module.css";
import axios from "axios";

function AdicionarDestinos() {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();

  const category = watch("categoria_destino", "");
  const [customCategory, setCustomCategory] = useState("");

  async function onSubmit(data) {
    const token = localStorage.getItem("token");
    formData.append("imagem", image);

    try {
      const uploadResponse = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log(data)

      await axios.post(
        "http://localhost:3000/destinos",
        { ...data, id_usuario: user.id },
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      setSuccessMessage("Destino cadastrado com sucesso!");
      alert("Destino cadastrado com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar destino", error);
      alert("Falha ao cadastrar destino!");
    }
  }

  async function handleCep(e) {
    const cep_destino = e.target.value.replace(/\D/g, "");
    if (cep_destino.length === 8) {
      try {
        const addressData = await getAddressFromCep(cep_destino);
        setAddress(addressData);
      } catch (error) {
        console.log("Erro ao carregar informações do endereço", error);
      }
    }
  }

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setValue("categoria_destino", selectedCategory);
    if (selectedCategory !== "outro") {
      setCustomCategory("");
    }
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.placesContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.placesForm}>
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          <h1>Adicionar Destino</h1>
          <h2>Compartilhe seu refúgio sustentável</h2>
          <p>
            Revele os lugares que inspiram viagens conscientes e inspire outros
            exploradores!
          </p>

          <div className={styles.placesGrid}>
            <div className={styles.placesGroup}>
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                className={styles.placesInput}
                placeholder="Praia da Joaquina ou..."
                {...register("nome_destino", {
                  required: "Nome é obrigatório",
                })}
              />
              <p className={styles.error}>{errors.nome_destino?.message}</p>
            </div>

            <div className={styles.placesGroup}>
              <label htmlFor="category">Categoria:</label>
              <select
                name="category"
                id="category"
                className={styles.placesInput}
                {...register("categoria_destino", {
                  required: "Escolha uma categoria",
                })}
                onChange={handleCategoryChange}
              >
                <option value="">Escolha...</option>
                <option value="praia">Praia</option>
                <option value="parque">Parque</option>
                <option value="trilha">Trilha</option>
                <option value="escalada">Escalada</option>
                <option value="vinicola">Vinícola</option>
                <option value="outro">Outra</option>
              </select>
              <p className={styles.error}>
                {errors.categoria_destino?.message}
              </p>
            </div>
          </div>

          {category === "outro" && (
            <div className={styles.placesGroup}>
              <label htmlFor="customCategory">Especifique a categoria:</label>
              <input
                type="text"
                id="customCategory"
                className={styles.placesInput}
                placeholder="Especifique a categoria do destino..."
                value={customCategory}
                onChange={handleCustomCategoryChange}
              />
            </div>
          )}

          <div className={styles.placesGroup}>
            <label htmlFor="description">Descrição:</label>
            <textarea
              id="description"
              rows="5"
              className={styles.placesInput}
              placeholder="Compartilhe detalhes sobre o destino..."
              {...register("descricao_destino", {
                required: "Descrição é obrigatória",
              })}
            />
            <p className={styles.error}>{errors.descricao_destino?.message}</p>
          </div>

          <div className={styles.placesGrid}>
            <div className={styles.placesGroup}>
              <label htmlFor="cep">CEP:</label>
              <input
                type="number"
                id="cep"
                className={styles.placesInput}
                placeholder="Inclua o CEP..."
                {...register("cep_destino", { required: "CEP é obrigatório" })}
                onBlur={handleCep}
              />
              <p className={styles.error}>{errors.cep_destino?.message}</p>
            </div>

            <div className={styles.placesGroup}>
              <label htmlFor="number">Número:</label>
              <input
                type="number"
                id="number"
                className={styles.placesInput}
                placeholder="Número..."
                {...register("numero_destino")}
              />
              <p className={styles.error}>{errors.numero_destino?.message}</p>
            </div>
          </div>

          <div className={styles.placesGrid}>
            <div className={styles.placesGroup}>
              <label htmlFor="address">Endereço:</label>
              <input
                type="text"
                id="address"
                className={styles.placesInput}
                placeholder="Endereço do destino..."
                value={address.logradouro}
                {...register("localidade_destino")}
              />
              <p className={styles.error}>
                {errors.localidade_destino?.message}
              </p>
            </div>

            <div className={styles.placesGroup}>
              <label htmlFor="city">Cidade:</label>
              <input
                type="text"
                id="city"
                className={styles.placesInput}
                placeholder="Cidade..."
                value={address.localidade}
                {...register("cidade_destino")}
              />
              <p className={styles.error}>{errors.cidade_destino?.message}</p>
            </div>
          </div>

          <div className={styles.placesGroup}>
            <label htmlFor="complement">Complemento:</label>
            <input
              type="text"
              id="complement"
              className={styles.placesInput}
              placeholder="Informações adicionais sobre o destino..."
              {...register("complemento_destino")}
            />

            <div className={styles.placesGroup}>
              <label htmlFor="image">Imagem:</label>
              <input
                type="file"
                id="image"
                className={styles.placesInput}
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>

            <p className={styles.error}>
              {errors.complemento_destino?.message}
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.addButton}>
              <Plane size={32} />
            </button>
            <button
              type="button"
              className={styles.returnButton}
              onClick={() => navigate(-1)}
            >
              <Undo2 size={32} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdicionarDestinos;
