import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './Login.module.css';
import { useAuth } from '../../contexts/Auth';

const schema = z.object({
    email_usuario: z.string().email('E-mail inválido'),
    senha_usuario: z.string().min(8, 'Senha precisa ter pelo menos 8 caracteres'),
});

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
});

  async function onSubmit(data) {
    console.log(data);
    try {
      await signIn(data);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'Falha no login!')
    }
}

  return (

      <main className={styles.loginContainer}>
        <div className={styles.left}>
          <div className={styles.box}>
            <h1>Check Green</h1>
            <p>Compartilhe suas experiências de viagem <br></br>sustentáveis com o mundo</p>
          </div>
        </div>
        <div className={styles.right}>
            <fieldset>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
              <h2>Comece sua jornada</h2>
                <div className={styles.loginGroup}>
                  <label htmlFor="email">E-mail</label>
                  <input 
                  type="email" 
                  className={styles.loginInput} 
                  placeholder='Compartilhe seu melhor e-mail...'
                  {...register("email_usuario", { required: 'E-mail é obrigatório' })} />
                </div>
                {errors.email_usuario && <p className={styles.error}>{errors.email_usuario.message}</p>}

                <div className={styles.loginGroup}>
                  <label htmlFor="password">Senha</label>
                  <input 
                  type="password" 
                  className={styles.loginInput} 
                  placeholder='Escreva sua senha secreta...'
                  {...register("senha_usuario", { required: 'Senha é obrigatória' })} />
                </div>
                {errors.senha_usuario && <p className={styles.error}>{errors.senha_usuario.message}</p>}

              <button type="submit" className={styles.loginButton} disabled={isSubmitting}>{isSubmitting ? 'Carregando...': 'Login'}</button>

              <p>Ainda não tem uma conta? <span><Link className={styles.link} to="/cadastro">Cadastro</Link></span></p>

            </form>
            </fieldset>
        </div>
    </main>
  );
}

export default Login;