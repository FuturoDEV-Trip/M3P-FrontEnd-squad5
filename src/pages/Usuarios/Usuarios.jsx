import Sidebar from '../../components/Sidebar/Sidebar';
import { SmilePlus } from 'lucide-react';
import styles from './Usuarios.module.css';

function Usuarios() {
  return (
    
    <div className={styles.container}>
      <Sidebar />
      
    <main className={styles.usersContainer}>
        <h1>Guias</h1>
        <p>Embarque próximo, depois de planejar a próxima viagem... <SmilePlus /></p>
    </main>
    </div>
  );
};

export default Usuarios;
