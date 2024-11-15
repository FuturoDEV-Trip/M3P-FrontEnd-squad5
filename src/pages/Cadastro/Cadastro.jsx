import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Cadastro.module.css";
import axios from "axios";
import { House } from 'lucide-react';
import { getApiUrl } from '../../service/api';

// Validation with Zod
const schema = z.object({
  nome_usuario: z.string().nonempty({ message: "Nome é obrigatório" }),
  email_usuario: z
    .string()
    .nonempty({ message: "E-mail é obrigatório" })
    .email({ message: "E-mail inválido" }),
  senha_usuario: z
    .string()
    .nonempty({ message: "Senha é obrigatória" })
    .min(6, { message: "Senha precisa ter pelo menos 6 caracteres" }),
  sexo_usuario: z.string().optional(),
  nascimento_usuario: z
    .string()
    .nonempty({ message: "Data de nascimento obrigatória" })
    .refine(
      (value) => {
        const today = new Date().toISOString().split("T")[0];
        return value <= today;
      },
      { message: "Data de nascimento não pode ser uma data do futuro" }
    ),
  cpf_usuario: z
    .string()
    .nonempty({ message: "CPF é obrigatório" })
    .length(11, { message: "CPF precisa conter 11 dígitos" })
    .refine((value) => /^\d+$/.test(value), {
      message: "CPF precisa ser um número válido",
    }),
  cep_usuario: z.string().nonempty({ message: "CEP é obrigatório" }),
  endereco_usuario: z.string().nonempty({ message: "Endereço é obrigatório" }),
});

function Cadastro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [endereco, setEndereco] = useState("");

  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const response = await axios.post(getApiUrl('usuarios'), data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSuccessMessage("Check-in realizado com sucesso!");
      alert("Check-in realizado com sucesso!");
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.log("Erro no cadastro:", error.response.data);
      } else {
        console.error("Erro ao cadastrar usuário", error);
      }
      setGeneralError("Falha ao cadastrar usuário");
      alert("Falha ao cadastrar usuário!");
    }
  }

  async function handleCep(e) {
    const cep_usuario = e.target.value.replace(/\D/g, "");
    if (cep_usuario.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep_usuario}/json/`
        );
        const data = response.data;
        if (!data.erro) {
          setEndereco(
            `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
          );
        } else {
          alert("CEP não encontrado!");
        } 
      } catch (error) {
        console.log("Erro ao carregar informações do endereço", error);
      }
    } else {
      alert("CEP inválido!");
    }
  }  

  return (
    <main className={styles.signupContainer}>
        <div className={styles.iconContainer}>
          <Link to="/">
            <House size={24} className={styles.homeIcon} />
          </Link>
        </div>
      <div className={styles.left}>
        <h2>Área de Embarque</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.signupForm}>
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          <div className={styles.leftSignupForm}>
            <div className={styles.signupGroup}>
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                placeholder="Seu nome..."
                {...register("nome_usuario")}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.nome_usuario?.message}</p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                placeholder="Seu e-mail..."
                {...register("email_usuario")}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.email_usuario?.message}</p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                placeholder="Sua senha..."
                {...register("senha_usuario")}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.senha_usuario?.message}</p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="gender">Gênero:</label>
              <select id="gender" {...register("sexo_usuario")}>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outros">Outros</option>
              </select>
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.sexo_usuario?.message}</p>
              </div>
            </div>
          </div>

          <div className={styles.rightSignupForm}>
            <div className={styles.signupGroup}>
              <label htmlFor="birthday">Data de Nascimento:</label>
              <input
                type="date"
                id="birthday"
                className={styles.signupInput}
                placeholder="Data de Nascimento..."
                {...register("nascimento_usuario")}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>
                  {errors.nascimento_usuario?.message}
                </p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                placeholder="CPF..."
                maxLength={11}
                {...register("cpf_usuario")}
                onInput={(e) => {
                  e.target.value = e.target.value.slice(0, 11);
                }}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.cpf_usuario?.message}</p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="cep">CEP:</label>
              <input
                type="text"
                id="cep"
                placeholder="Inclua seu CEP..."
                {...register("cep_usuario")}
                onBlur={handleCep}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.cep_usuario?.message}</p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="address">Endereço:</label>
              <input
                type="text"
                id="address"
                value={endereco}
                placeholder="Endereço preenchido automaticamente..."
                {...register("endereco_usuario")}
              />
            </div>

            <button type="submit" className={styles.signupButton}>
              Cartão de Embarque
            </button>
          </div>
        </form>

        <p>
          Já tem passagem?{" "}
          <Link className={styles.link} to="/login">
            Embarque!
          </Link>
        </p>
      </div>
      <div className={styles.right}></div>
    </main>
  );
}

export default Cadastro;
