import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './art.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // Estados para armazenar os valores digitados
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    // Remove espaços em branco acidentais
    const emailFormatado = email.trim();
    const senhaFormatada = senha.trim();

    // validações basicas
    if (!emailFormatado || !senhaFormatada) {
      alert('Preencha todos os campos');
      return;
    }

     const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFormatado);
    if (!emailValido) {
      alert('Digite um email válido.');
      return;
    }

    if (senhaFormatada.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!navigator.onLine) {
      alert('Você está offline. Verifique sua conexão com a internet.');
      return;
    }

    try {
      // faz o envio dos dados de login para a API usando o método POST
      const resposta = await fetch('http://localhost:3000/api/routes/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailFormatado,
          senha: senhaFormatada
        })
      });

      // Converte a resposta da API para JSON
      const dados = await resposta.json();

      // validação se os dados existem
      if (resposta.ok && dados.id && dados.nome) {
        localStorage.setItem('usuario', JSON.stringify({
          id: dados.id,
          nome: dados.nome
        }));

        alert('Login realizado com sucesso!');
        navigate('/Home');

      } else {
        alert(dados.erro + 'Email ou senha incorretos. Tente novamente.');
      }

    } catch (err) {
      alert('Erro ao conectar com a API'); // mostra erros via API
      console.error(err);
      
    } finally {
      setCarregando(false); // finaliza o carregamento
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleLogin}>
        <div className='welcome'>
          <h1 className='title'> Acesse sua conta </h1>
          <p> Olá! Seja bem vindo de volta </p>
        </div>

        <input
          placeholder='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            placeholder='Senha'
            name='password'
            type={showPassword ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button
            className="show-password"
            type='button'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'esconder' : 'mostrar'}
          </button>
        </div>

        <div className="button-group">
          <button type='submit'>Entrar</button>
          <button type='button' onClick={() => navigate('/Register')}>Cadastrar</button>
        </div>

        <div className="social-login">
          <p className="social-text">Ou acesse usando</p>

          <div className="social-icons">
            <button className="social-btn apple" aria-label="Entrar com Apple">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            </button>

            <button className="social-btn facebook" aria-label="Entrar com Facebook">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
