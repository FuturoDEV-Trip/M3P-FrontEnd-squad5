import { Link, useLocation } from 'react-router-dom';
import { House, User, LandPlot, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/Auth';
import styles from './Sidebar.module.css';

function Sidebar() {
    const location = useLocation();
    const { signOut } = useAuth();
  
    const isActive = (path) => location.pathname === path;

    function handleLogout() {
        signOut();
    }

    return (
            <header className={styles.header}>            
                <nav className={styles.sidebar}>
                    <h2>Check Green</h2> 
                    <div className={styles.sidebarLinks}>
                    <ul>
                        <li><Link to="/" 
                            className={`${styles.link} ${isActive('/') ? styles.activeLink : ''}`}><House /><span>Lounge</span></Link></li>
                        <li><Link to="/usuarios" 
                            className={`${styles.link} ${isActive('/usuarios') ? styles.activeLink : ''}`}><User /><span>Guias</span></Link></li>
                        <li><Link to="/destinos" 
                            className={`${styles.link} ${isActive('/destinos') ? styles.activeLink : ''}`}><LandPlot /><span>Destinos</span></Link></li>
                    </ul>
                    </div>
                    <div className={styles.sidebarLogout}>
                    <ul>
                        <li>
                            <button onClick={handleLogout} className={styles.link}>
                                <LogOut /><span>Desembarque</span>
                            </button>
                        </li>
                    </ul>
                    </div>
                </nav>
            </header>
        );
}

export default Sidebar;