import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    }, [user]);

    async function signIn({ email_usuario, senha_usuario }) {
        try {
            const loginResponse = await axios.post('http://localhost:3000/login', { email_usuario, senha_usuario });
            const loginData = loginResponse.data;
    
            if (loginData && loginData.email_usuario) {
                const userResponse = await axios.get('http://localhost:3000/usuarios', {
                    params: { email_usuario: loginData.email_usuario }
                });
    
                const [userData] = userResponse.data;
    
                if (userData) {
                    if (userData.senha_usuario === senha_usuario) {
                        localStorage.setItem('user', JSON.stringify(userData));
                        setUser(userData);
                        navigate('/dashboard');
                    } else {
                        console.error('Senha incorreta');
                        alert('Senha incorreta');
                    }
                } else {
                    console.error('Usuário não encontrado');
                    alert('Usuário não encontrado');
                }
            }
        } catch (error) {
            console.error('Falha na autenticação', error);
            alert('Falha na autenticação');
        }
    }

    function signOut() {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
