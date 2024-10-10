import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updatePlace } from '../../service/placesService';
import Sidebar from '../../components/Sidebar/Sidebar';
import getAddressFromCep from '../../service/addressService';
import { Undo2 } from 'lucide-react';
import styles from './EditarDestino.module.css';

function EditarDestino() {
    const { id } = useParams();
    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    
    const category = watch('categoria_destino', '');
    const [customCategory, setCustomCategory] = useState('');
    const [address, setAddress] = useState('');
    const token = localStorage.getItem("token")

    async function onUpdate(data) {
        try {
            await updatePlace(id, { ...data, categoria_destino: customCategory || data.categoria_destino });
            setSuccessMessage('Destino atualizado com sucesso!');
            alert('Destino atualizado com sucesso!');
            setTimeout(() => {
                navigate('/destinos');
            }, 2000);
        } catch (error) {
            console.error('Erro ao atualizar destino', error.response ? error.response.data : error.message);
            alert('Falha ao atualizar destino!');
        }
    }

    async function retrievePlace() {
        try {
            const response = await fetch(`http://localhost:3000/destinos/${id}`, {headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
              }});
            if (!response.ok) throw new Error('Falha ao carregar informações do destino');
            const data = await response.json();
            reset(data);
        } catch (error) {
            console.error('Erro ao carregar informações do destino', error);
        }
    }

    async function handleCep(e) {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const addressData = await getAddressFromCep(cep);
                console.log(addressData);
                setValue('localidade_destino', addressData.logradouro);
                setValue('cidade_destino', addressData.localidade);
                setValue('complemento', addressData.complemento);
                setValue('latitude', addressData.latitude);
                setValue('longitude', addressData.longitude);
                setAddress(addressData.logradouro);
            } catch (error) {
                console.log('Erro ao carregar informações do endereço', error);
            }
        }
    }

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setValue('categoria_destino', selectedCategory);
        if (selectedCategory !== 'outro') {
            setCustomCategory('');
        }
    };

    const handleCustomCategoryChange = (e) => {
        setCustomCategory(e.target.value);
    };

    useEffect(() => {
        if (id) {
            retrievePlace();
        }
    }, [id]);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.placesContainer}>
                <form onSubmit={handleSubmit(onUpdate)} className={styles.placesForm}>
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    <h1>Editar Destino</h1>
                    <div className={styles.placesGrid}>
                        <div className={styles.placesGroup}>
                            <label htmlFor="name">Nome:</label>
                            <input
                                type="text"
                                id="name"
                                className={styles.placesInput}
                                placeholder='Praia da Joaquina ou...'
                                {...register("nome_destino", { required: 'Nome é obrigatório' })}
                            />
                            <p className={styles.error}>{errors.nome_destino?.message}</p>
                        </div>

                        <div className={styles.placesGroup}>
                            <label htmlFor="category">Categoria:</label>
                            <select
                                name="category"
                                id="category"
                                className={styles.placesInput}
                                {...register("categoria_destino", { required: 'Escolha uma categoria' })}
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
                            <p className={styles.error}>{errors.categoria_destino?.message}</p>
                        </div>
                    </div>

                    {category === 'outro' && (
                        <div className={styles.placesGroup}>
                            <label htmlFor="customCategory">Especifique a categoria:</label>
                            <input
                                type="text"
                                id="customCategory"
                                className={styles.placesInput}
                                placeholder='Especifique a categoria do destino...'
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
                            placeholder='Compartilhe detalhes sobre o destino...'
                            {...register("descricao_destino", { required: 'Descrição é obrigatória' })}
                        />
                        <p className={styles.error}>{errors.descricao_destino?.message}</p>
                    </div>

                    <div className={styles.placesGrid}>
                        <div className={styles.placesGroup}>
                            <label htmlFor="cep">CEP:</label>
                            <input
                                type="text"
                                id="cep"
                                className={styles.placesInput}
                                placeholder='Inclua o CEP...'
                                {...register("cep_destino", { required: 'CEP é obrigatório' })}
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
                                placeholder='Número...'
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
                                placeholder='Endereço do destino...'
                                value={address}
                                {...register("localidade_destino")}
                            />
                            <p className={styles.error}>{errors.localidade_destino?.message}</p>
                        </div>

                        <div className={styles.placesGroup}>
                            <label htmlFor="city">Cidade:</label>
                            <input
                                type="text"
                                id="city"
                                className={styles.placesInput}
                                placeholder='Cidade...'
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
                            placeholder='Informações adicionais sobre o destino...'
                            {...register("complemento")}
                        />
                        <p className={styles.error}>{errors.complemento?.message}</p>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.updateButton}>Atualizar</button>
                        <button type="button" className={styles.returnButton} onClick={() => navigate(-1)}><Undo2 size={15} /></button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default EditarDestino;