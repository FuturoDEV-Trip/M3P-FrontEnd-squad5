import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { validateUser } from '../../service/userValidate';
import getAddressFromCep from '../../service/addressService';
import styles from './Cadastro.module.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Validation with Zod
const schema = z.object({
    nome_usuario: z.string().nonempty({ message: 'Nome é obrigatório' }),
    email_usuario: z.string()
          .nonempty({ message: 'E-mail é obrigatório' })
          .email({ message: 'E-mail inválido' }),
    senha_usuario: z.string()
          .nonempty({ message: 'Senha é obrigatória' })
          .min(8, { message: 'Senha precisa ter pelo menos 8 caracteres' }),
    sexo_usuario: z.string().optional(),
    nascimento_usuario: z.string().nonempty({ message: 'Data de nascimento é obrigatória' })
          .refine(value => {
              const today = new Date().toISOString().split('T')[0];
              return value <= today;
          }, { message: 'Data de nascimento não pode ser uma data do futuro' }),
    cpf_usuario: z.string()
          .nonempty({ message: 'CPF é obrigatório' })
          .length(11, { message: 'CPF precisa conter 11 dígitos' })
          .refine(value => /^\d+$/.test(value), { message: 'CPF precisa ser um número válido' }),
    cep_usuario: z.string()
          .nonempty({ message: 'CEP é obrigatório' })
  });  

function Cadastro() {
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
});

  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(data) {
    console.log(data);

    const userId = uuidv4();
    const userData = {
      id: userId,
      ...data
    };

    const validationErrors = await validateUser(userData);

    if (Object.keys(validationErrors).length > 0) {
        if (validationErrors.email_usuario) {
            setError('email_usuario', { type: 'manual', message: validationErrors.email_usuario });
        }
        if (validationErrors.cpf_usuario) {
            setError('cpf_usuario', { type: 'manual', message: validationErrors.cpf_usuario });
        }
        if (validationErrors.generalError) {
            setGeneralError(validationErrors.generalError);
        }
        return;
    }

    try {
      await axios.post('http://localhost:3000/usuarios', data);
      
      setSuccessMessage('Embarque de usuário realizado com sucesso!');
      alert('Embarque realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar usuário', error);
      setGeneralError('Falha ao cadastrar usuário');
      alert('Falha ao cadastrar usuário!');
    }
  }

  async function handleCep(e) {
    const cep_usuario = e.target.value.replace(/\D/g, ''); 
    if (cep_usuario.length === 8) {
      try {
        const addressData = await getAddressFromCep(cep_usuario);
        console.log(addressData); 
        setValue('endereco_usuario', addressData.logradouro);
        setValue('cidade_usuario', addressData.localidade);
        setValue('complemento', addressData.complemento);
        setValue('latitude', addressData.latitude);
        setValue('longitude', addressData.longitude);
      } catch (error) {
        console.log('Erro ao carregar informações do endereço', error);
      }
    }
  }

  return (
    <main className={styles.signupContainer}>
      <div className={styles.left}>
        <h2>Área de Embarque</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.signupForm}>

          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <div className={styles.leftSignupForm}>
            <div className={styles.signupGroup}>
              <label htmlFor="name">Nome:</label>
              <input 
                type="text"
                id="name"
                className={styles.signupInput} 
                placeholder='Seu nome...'
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
                className={styles.signupInput} 
                placeholder='Seu e-mail...'
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
                className={styles.signupInput} 
                placeholder='Sua senha...'
                {...register("senha_usuario")}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.senha_usuario?.message}</p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="gender">Gênero:</label>
              <input 
                type="text"
                id="gender"
                className={styles.signupInput} 
                placeholder='Gênero...'
                {...register("sexo_usuario")}
              />
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
                placeholder='Data de Nascimento...'
                {...register("nascimento_usuario")}
              />
              <div className={styles.errorContainer}>
                <p className={styles.error}>{errors.nascimento_usuario?.message}</p>
              </div>
            </div>

            <div className={styles.signupGroup}>
              <label htmlFor="cpf">CPF:</label>
              <input 
                type="text"
                id="cpf"
                className={styles.signupInput} 
                placeholder='CPF...'
                maxLength={11}
                {...register("cpf_usuario")}
                onInput={e => {
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
                className={styles.signupInput} 
                placeholder='Inclua seu CEP...'
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
                className={styles.signupInput} 
                placeholder='Endereço preenchido automaticamente...'
              />
            </div>

            <button type="submit" className={styles.signupButton}>Cartão de Embarque</button>
          </div>
        </form>

        <p>Já tem uma conta? <Link className={styles.link} to="/">Embarque!</Link></p>
      </div>
      <div className={styles.right}></div>
    </main>
  );
}

export default Cadastro;
