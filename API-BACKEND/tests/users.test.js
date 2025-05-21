const request = require('supertest');
const app = require('../app');
const { clearDatabase } = require('./setup');
const User = require('../models/User');

// Mock do modelo User para testes
jest.mock('../models/User');

describe('Rotas de Usuários', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('GET /api/users', () => {
    it('deve retornar lista de usuários', async () => {
      // Mock da função findAll
      User.findAll.mockResolvedValue([
        { id: 1, nome: 'Usuário Teste', email: 'teste@exemplo.com' },
        { id: 2, nome: 'Outro Usuário', email: 'outro@exemplo.com' }
      ]);

      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].nome).toBe('Usuário Teste');
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar erro 500 quando ocorrer falha no banco', async () => {
      // Mock de erro
      User.findAll.mockRejectedValue(new Error('Erro de conexão'));

      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('erro');
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/users/register-full', () => {
    it('deve cadastrar um novo usuário com dados de saúde', async () => {
      // Mock para verificação de email existente
      User.findByEmail.mockResolvedValue(null);
      
      // Mock para criação de usuário
      User.createWithHealthData.mockResolvedValue(1);

      const userData = {
        nome: 'Novo Usuário',
        email: 'novo@exemplo.com',
        senha: 'senha123',
        peso: 70.5,
        altura: 1.75,
        gordura_corporal: 15,
        faz_exercicio: true,
        meta_perda_peso: 5
      };

      const response = await request(app)
        .post('/api/users/register-full')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('mensagem');
      expect(response.body).toHaveProperty('usuario_id', 1);
      expect(User.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(User.createWithHealthData).toHaveBeenCalledWith(userData);
    });

    it('deve retornar erro 400 quando campos obrigatórios estiverem faltando', async () => {
      const userData = {
        nome: 'Usuário Incompleto',
        email: 'incompleto@exemplo.com'
        // Faltando senha e outros campos obrigatórios
      };

      const response = await request(app)
        .post('/api/users/register-full')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(User.createWithHealthData).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando email já estiver cadastrado', async () => {
      // Mock para simular email já existente
      User.findByEmail.mockResolvedValue({ id: 1, email: 'existente@exemplo.com' });

      const userData = {
        nome: 'Usuário Duplicado',
        email: 'existente@exemplo.com',
        senha: 'senha123',
        peso: 70.5,
        altura: 1.75,
        gordura_corporal: 15,
        faz_exercicio: true,
        meta_perda_peso: 5
      };

      const response = await request(app)
        .post('/api/users/register-full')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('erro', 'Email já cadastrado');
      expect(User.createWithHealthData).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/users/login', () => {
    it('deve autenticar um usuário com credenciais válidas', async () => {
      // Mock para verificação de credenciais
      User.verifyCredentials.mockResolvedValue({ id: 1, nome: 'Usuário Teste' });

      const credentials = {
        email: 'teste@exemplo.com',
        senha: 'senha123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('nome', 'Usuário Teste');
      expect(User.verifyCredentials).toHaveBeenCalledWith(credentials.email, credentials.senha);
    });

    it('deve retornar erro 401 quando credenciais forem inválidas', async () => {
      // Mock para credenciais inválidas
      User.verifyCredentials.mockResolvedValue(null);

      const credentials = {
        email: 'invalido@exemplo.com',
        senha: 'senhaerrada'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('erro', 'Email ou senha inválidos');
      expect(User.verifyCredentials).toHaveBeenCalledWith(credentials.email, credentials.senha);
    });

    it('deve retornar erro 400 quando campos obrigatórios estiverem faltando', async () => {
      const credentials = {
        // Faltando email e senha
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(User.verifyCredentials).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('deve deletar um usuário existente', async () => {
      // Mock para verificar se usuário existe
      User.findById.mockResolvedValue({ id: 1, nome: 'Usuário para Deletar' });
      
      // Mock para deletar usuário
      User.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/users/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('mensagem', 'Usuário deletado com sucesso!');
      expect(User.findById).toHaveBeenCalledWith('1');
      expect(User.delete).toHaveBeenCalledWith('1');
    });

    it('deve retornar erro 404 quando usuário não existir', async () => {
      // Mock para usuário não encontrado
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/users/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('erro', 'Usuário não encontrado');
      expect(User.findById).toHaveBeenCalledWith('999');
      expect(User.delete).not.toHaveBeenCalled();
    });
  });
});
