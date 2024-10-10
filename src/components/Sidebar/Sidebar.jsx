import { Link, useLocation } from 'react-router-dom';
import { House, User, LandPlot, LogOut, Plane, TicketsPlane, Armchair } from 'lucide-react';
import { useAuth } from '../../contexts/Auth';
import styles from './Sidebar.module.css';

function Sidebar() {
    const location = useLocation();
    const { user, signOut } = useAuth();
  
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
                        {user ? (
                            <>
                                <li><Link to="/" 
                            className={`${styles.link} ${isActive('/') ? styles.activeLink : ''}`} data-replace="Lounge"><Armchair /><span>Lounge</span></Link></li>
                                <li><Link to="/usuarios" 
                            className={`${styles.link} ${isActive('/usuarios') ? styles.activeLink : ''}`} data-replace="Guias"><User /><span>Guias</span></Link></li>
                                <li><Link to="/destinos" 
                            className={`${styles.link} ${isActive('/destinos') ? styles.activeLink : ''}`} data-replace="Destinos"><LandPlot /><span>Destinos</span></Link></li>
                            </>
                        ) : (
                            <>
                                 <li><Link to="/" 
                            className={`${styles.link} ${isActive('/') ? styles.activeLink : ''}`} data-replace="Estação"><House /><span>Estação</span></Link></li>
                                <li><Link to="/login" 
                                    className={`${styles.link} ${isActive('/login') ? styles.activeLink : ''}`} data-replace="Embarque"><Plane /><span>Embarque</span></Link></li>
                                <li><Link to="/cadastro" 
                                    className={`${styles.link} ${isActive('/cadastro') ? styles.activeLink : ''}`} data-replace="Check-in"><TicketsPlane /><span>Check-in</span></Link></li>
                            </>
                        )}
                    </ul>
                    </div>
                    <div className={styles.sidebarLogout}>
                    <ul>
                        {user && (
                            <li>
                                <button onClick={handleLogout} className={styles.linkOut}>
                                <LogOut /><span>Desembarque</span>
                                </button>
                            </li>
                        )}
                    </ul>
                    </div>
                </nav>
            </header>
        );
}

export default Sidebar;