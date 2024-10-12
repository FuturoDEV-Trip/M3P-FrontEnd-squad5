import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Pencil, SmilePlus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Usuarios.module.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/usuarios', {
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
        await axios.delete(`http://localhost:3000/usuarios/${id}`, {
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
        <h1>Guias</h1>

        {usuarios.length > 0 ? (
          <table className={styles.tableContainer}>
            <thead border="1">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nome_usuario}</td>
                  <td>{usuario.email_usuario}</td>
                  <td>
                    <button onClick={() => handleEdit(usuario.id)} className={styles.button}>
                      <Pencil className={styles.icon} />
                    </button>
                    <button onClick={() => handleDelete(usuario.id)} className={styles.button}>
                      <Trash2 className={styles.icon} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum usuário cadastrado.</p>
        )}

        <footer className={styles.footer}>
          <p>Lista de usuários cadastrados <SmilePlus /></p>
        </footer>
      </main>
    </div>
  );

}

export default Usuarios;
