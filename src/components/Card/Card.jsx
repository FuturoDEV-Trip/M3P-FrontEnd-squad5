import { useAuth } from '../../contexts/Auth';
import styles from './Card.module.css'; 

function Card({ title, total, iconElement: Icon }) {
    const { user } = useAuth();
    const isLoggedIn = !!user;

    return (
        <div className={`${styles.card} ${isLoggedIn ? styles.animated : ''}`}>
            <div className={styles.title}>
                <h3>{title}</h3>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.cardIcon}>
                    <Icon size={32} />
                </div>
                <div className={styles.cardCount}>
                    <p>{total}</p>
                </div>
            </div>
        </div>
    );
}

export default Card;