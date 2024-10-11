import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import styles from './EditarUsuario.module.css'; 

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
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/usuarios/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Usuário atualizado com sucesso!');
      navigate('/usuarios');
    } catch (error) {
      alert('Erro ao atualizar usuário');
      console.error('Erro ao atualizar usuário', error);
    }
  };

  return (
    // className={styles.container}
    <div >
      <h2>Editar Usuário</h2>
      {/* className={styles.form} */}
      <form onSubmit={handleSubmit} >
        <label>Nome</label>
        <input
          type="text"
          value={formData.nome_usuario}
          onChange={(e) => setFormData({ ...formData, nome_usuario: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          value={formData.email_usuario}
          onChange={(e) => setFormData({ ...formData, email_usuario: e.target.value })}
        />

        
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default EditarUsuario;
