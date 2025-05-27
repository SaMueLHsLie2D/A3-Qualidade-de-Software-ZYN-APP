import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './art.css';

// Estado que armazena os dados do formulário de registro
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Instanciar useNavigate
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    peso: '',
    altura: '',
    gordura_corporal: '',
    faz_exercicio: '',
    meta_perda_peso: ''
  });

    // atualiza o estado do formulário sempre que um campo for alterado
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    // é executada ao submeter o formulário
    const handleSubmit = async (e) => {
      e.preventDefault();

    // Trim e verificações básicas
    const camposObrigatorios = ['nome', 'email', 'senha', 'peso', 'altura', 'gordura_corporal', 'faz_exercicio', 'meta_perda_peso'];

    for (const campo of camposObrigatorios) {
      if (!form[campo] || form[campo].toString().trim() === '') {
        alert(`O campo "${campo.replace('_', ' ')}" não pode estar vazio.`);
        return;
      }
    }

     // Validação de senha
    const senhaFraca = ['123456', 'senha', 'admin', 'abcdef'];
    if (form.senha.length < 6 || senhaFraca.includes(form.senha.toLowerCase())) {
      alert('Escolha uma senha mais segura (mínimo 6 caracteres, evite senhas fracas).');
      return;
      
    }

    // Bloquear caracteres invalidos
    const invalido = /[<>"";]/;
    if (invalido.test(form.nome) || invalido.test(form.email)) {
      alert('Caracteres inválidos detectados em nome ou email.');
      return;
    }

    // Validar números positivos
    const valoresNumericos = ['peso', 'altura', 'gordura_corporal', 'meta_perda_peso'];
    for (const campo of valoresNumericos) {
      const valor = parseFloat(form[campo]);
      if (isNaN(valor) || valor <= 0) {
        alert(`O campo "${campo.replace('_', ' ')}" deve conter um número positivo.`);
        return;
      }
    }

    // Verificar conexão
    if (!navigator.onLine) {
      alert('Você está offline. Verifique sua conexão com a internet.');
      return;
    }


    try {
      const res = await fetch('http://localhost:3000/api/users/register-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // corpo da requisisão em formato JSON
        body: JSON.stringify(form) // convertendo os objetos do formulário para JSON
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(data.mensagem); // Mostrar mensagem de sucesso
        navigate('/'); // Redirecionar para a página de login
      } else {
        // Se a API retornar um erro (res.ok === false), mostrar o erro específico da API
        alert(`Erro no cadastro: ${data.erro || 'Erro desconhecido do servidor.'}`);
      }
    } catch (err) {
      // Este catch agora só deve pegar erros de rede/conexão ou erros inesperados no fetch/json()
      console.error('Erro ao conectar com a API ou processar resposta:', err);
      alert('Falha ao conectar com o servidor. Verifique sua conexão ou se o servidor está rodando.');
    }
  };

  return (
    <div className="container-register">
      <form onSubmit={handleSubmit}>
        <div className="welcome-register">
          <h1 className="title">Cadastro</h1>
          <p>Preencha os campos abaixo para criar sua conta</p>
        </div>

        <input
          placeholder="Nome de usuário"
          name="nome"
          type="text"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <input
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            placeholder="Senha"
            name="senha"
            type={showPassword ? 'text' : 'password'}
            value={form.senha}
            onChange={handleChange}
            required
          />
          <button
            className="show-password"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'esconder' : 'mostrar'}
          </button>
        </div>

        <input
          placeholder="Peso (kg)"
          name="peso"
          type="number"
          step="0.1"
          value={form.peso}
          onChange={handleChange}
          required
        />

        <input
          placeholder="Altura (m)"
          name="altura"
          type="number"
          step="0.01"
          value={form.altura}
          onChange={handleChange}
          required
        />

        <input
          placeholder="Gordura corporal (%)"
          name="gordura_corporal"
          type="number"
          step="0.1"
          value={form.gordura_corporal}
          onChange={handleChange}
          required
        />

        <select
          name="faz_exercicio"
          value={form.faz_exercicio}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Você tem o hábito de realizar exercícios?</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>

        <input
          placeholder="Meta de peso a perder (kg)"
          name="meta_perda_peso"
          type="number"
          step="0.1"
          value={form.meta_perda_peso}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="submit">Registrar</button>
          {/* O botão Voltar já usa navigate, então deve funcionar após a correção */}
          <button type="button" onClick={() => navigate('/')}>Voltar</button> 
        </div>
      </form>
    </div>
  );
}

export default Register;
