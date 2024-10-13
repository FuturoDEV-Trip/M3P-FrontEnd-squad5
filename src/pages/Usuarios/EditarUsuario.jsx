import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import getAddressFromCep from '../../service/addressService'; // Serviço para obter o endereço via CEP
import { Undo2 } from 'lucide-react';
import styles from './EditarUsuario.module.css';

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome_usuario: '',
    email_usuario: '',
    sexo_usuario: '',
    cep_usuario: '',
    endereco_usuario: '',
    nascimento_usuario: '',
    senha_usuario: '',
    senha_atual: ''
  });
  const [address, setAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/usuarios/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuário', error);
      }
    };
    fetchUsuario();
  }, [id]);


  const handleCep = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, cep_usuario: cep });

    if (cep.length === 8) {
      try {
        const addressData = await getAddressFromCep(cep);
        setFormData({
          ...formData,
          endereco_usuario: `${addressData.logradouro}, ${addressData.bairro}, ${addressData.localidade} - ${addressData.uf}`
        });
        setAddress(`${addressData.logradouro}, ${addressData.bairro}, ${addressData.localidade} - ${addressData.uf}`);
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPasswordEditable && !formData.senha_atual) {
      alert('Por favor, insira sua senha atual antes de definir uma nova senha.');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/usuarios/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccessMessage('Usuário atualizado com sucesso!');
      setTimeout(() => {
        navigate('/usuarios');
      }, 2000);
    } catch (error) {
      alert('Erro ao atualizar usuário');
      console.error('Erro ao atualizar usuário', error);
    }
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, senha_atual: e.target.value });

    if (e.target.value.length > 0) {
      setIsPasswordEditable(true);
    } else {
      setIsPasswordEditable(false);
      setFormData({ ...formData, senha_usuario: '' });
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.usersContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
          <h1>Editar Usuário</h1>

          <div className={styles.usersGrid}>
            <div className={styles.userGroup}>
              <label>Nome</label>
              <input
                type="text"
                value={formData.nome_usuario}
                className={styles.userInput}
                onChange={(e) => setFormData({ ...formData, nome_usuario: e.target.value })}
              />
            </div>

            <div className={styles.userGroup}>
              <label>E-mail</label>
              <input
                type="email"
                value={formData.email_usuario}
                className={styles.userInput}
                onChange={(e) => setFormData({ ...formData, email_usuario: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.usersGrid}>
            <div className={styles.userGroup}>
              <label>CEP</label>
              <input
                type="text"
                value={formData.cep_usuario}
                className={styles.userInput}
                onChange={handleCep}
                maxLength={8}
                placeholder="Informe o CEP"
              />
            </div>

            <div className={styles.userGroup}>
              <label>Endereço</label>
              <input
                type="text"
                value={address || formData.endereco_usuario}
                className={styles.userInput}
                onChange={(e) => setFormData({ ...formData, endereco_usuario: e.target.value })}
                placeholder="Endereço será preenchido automaticamente"
              />
            </div>
          </div>

          <div className={styles.usersGrid}>
            <div className={styles.userGroup}>
              <label>Senha Atual</label>
              <input
                type="password"
                value={formData.senha_atual}
                className={styles.userInput}
                onChange={handlePasswordChange}
                placeholder="Informe sua senha atual"
              />
            </div>

            {isPasswordEditable && (
              <div className={styles.userGroup}>
                <label>Nova Senha</label>
                <input
                  type="password"
                  value={formData.senha_usuario}
                  className={styles.userInput}
                  onChange={(e) => setFormData({ ...formData, senha_usuario: e.target.value })}
                  placeholder="Informe a nova senha"
                />
              </div>
            )}
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

export default EditarUsuario;
