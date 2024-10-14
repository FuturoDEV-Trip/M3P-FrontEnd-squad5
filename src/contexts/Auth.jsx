import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../service/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        if (user && token) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, [user, token]);

    async function signIn({ email_usuario, senha_usuario }) {
        try {

            const loginResponse = await axios.post(getApiUrl('login'), { email_usuario, senha_usuario });
            const loginData = loginResponse.data;

            if (loginData && loginData.Token && loginData.usuario) {
                localStorage.setItem('user', JSON.stringify(loginData.usuario));
                localStorage.setItem('token', loginData.Token);

                setUser(loginData.usuario);
                setToken(loginData.Token);
                alert("Embarque autorizado com sucesso!");
                navigate('/');
            } else {
                alert('Falha na autenticação');
            }
        } catch (error) {
            console.error('Falha na autenticação', error);
            alert('Erro no login');
        }
    }

    async function signOut() {
        try {
            await axios.post(getApiUrl('logout'), {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        setUser(null);
        setToken(null);
        alert('Desembarque realizado com sucesso!');
        navigate('/');
        } catch (error) {
            console.error('Erro ao deslogar:', error);
            alert('Erro ao deslogar');
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}