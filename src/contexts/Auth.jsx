import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(() => localStorage.getItem('token')); 
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token); 
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, [user, token]);

    async function signIn({ email_usuario, senha_usuario }) {
        try {

            const loginResponse = await axios.post('http://localhost:3000/login', { email_usuario, senha_usuario });
            const loginData = loginResponse.data;

            if (loginData && loginData.Token) {
                const userResponse = await axios.get('http://localhost:3000/usuarios', {
                    headers: {
                        Authorization: loginData.Token 
                    },
                    params: { email_usuario }
                });
                // debugger;
                const [userData] = userResponse.data;

                if (userData) {
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', loginData.Token); 
                    setUser(userData);
                    console.log(loginData)
                    setToken(loginData.Token); 

                    navigate('/dashboard');
                } else {
                    alert('Usuário não encontrado');
                }
            } else {
                alert('Falha na autenticação');
            }
        } catch (error) {
            console.error('Falha na autenticação', error);
            alert('Erro no login');
        }
    }

    function signOut() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        navigate('/');
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
