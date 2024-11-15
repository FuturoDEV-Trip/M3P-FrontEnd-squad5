import { useNavigate } from 'react-router-dom';
import { Undo2 } from 'lucide-react';
import styles from './BotaoVoltar.module.css'; 

function BotaoVoltar() {
  const navigate = useNavigate();

  return (
      <div className={styles.backBtn} onClick={() => navigate(-1)}>
        <Undo2 />
      </div>
  );
}

export default BotaoVoltar;
