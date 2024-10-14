import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Pencil, SmilePlus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Usuarios.module.css';
import { getApiUrl } from '../../service/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(getApiUrl('usuarios'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleEdit = (id) => {
    navigate(`/editar-usuario/${id}`)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(getApiUrl('usuarios') + `/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Erro ao excluir usuário');
        }
        console.error('Erro ao excluir usuário', error);
      }
    }
  }

  return (

    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      <main className={styles.usersContainer}>
        <div className={styles.usersContent}>
          <h1>Guias</h1>
          <p>Explore a lista de guias de viagem preparados para embarcar em uma nova jornada a qualquer momento. <SmilePlus /></p>
        </div>
        {usuarios.length > 0 ? (
          <div className={styles.tableContainer}>
          <table border="1">
            <thead>
              <tr>
                <th>Guia</th>
                <th>Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nome_usuario}</td>
                  <td>{usuario.email_usuario}</td>
                  <td>
                  <div className={styles.iconContainer}>
                    <div className={styles.iconEdit}>
                      <button onClick={() => handleEdit(usuario.id)} className={styles.button}>
                        <Pencil className={styles.icon} />
                      </button>
                      </div>
                      <div className={styles.iconDelete}>
                      <button onClick={() => handleDelete(usuario.id)} className={styles.button}>
                        <Trash2 className={styles.icon} />
                      </button>
                    </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p>Ainda não temos guias prontos para explorar.</p>
        )}
      </main>
    </div>
  );

}

export default Usuarios;
