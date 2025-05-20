const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcrypt');

let testUserId;
let authToken;
let resetToken;

// Função auxiliar para criar hash de senha
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Teste de integração para a API
describe('API Authentication', () => {
  // Teste de registro de usuário
  it('Deve registrar um novo usuário e retornar token JWT', async () => {
    const res = await request(app)
      .post('/api/users/register-full')
      .send({
        nome: 'User Test',
        email: 'usertest_new@example.com',
        senha: '123456',
        peso: 70,
        altura: 1.70,
        gordura_corporal: 15,
        faz_exercicio: false,
        meta_perda_peso: 5
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('usuario_id');
    
    // Limpar após o teste
    await db.execute('DELETE FROM registros_saude WHERE usuario_id = ?', [res.body.data.usuario_id]);
    await db.execute('DELETE FROM usuarios WHERE id = ?', [res.body.data.usuario_id]);
  });

  // Teste de login
  it('Deve fazer login e retornar token JWT', async () => {
    // Criar usuário de teste com senha hasheada
    const hashedPassword = await hashPassword('123456');
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      ['User Test', 'usertest@example.com', hashedPassword]
    );
    testUserId = result.insertId;
    
    // Criar registro de saúde relacionado
    await db.execute(
      `INSERT INTO registros_saude 
        (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [testUserId, 70, 1.70, 15, false, 5]
    );
    
    // Testar login
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'usertest@example.com',
        senha: '123456'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('token');
    
    // Salvar token para testes subsequentes
    authToken = res.body.data.token;
  });
  
  // Teste de acesso não autorizado
  it('Deve negar acesso a rotas protegidas sem token', async () => {
    const res = await request(app)
      .get(`/api/registros-saude/historico/${testUserId}`);
    
    expect(res.statusCode).toBe(401);
  });
});

// Teste de recuperação de senha
describe('Password Recovery', () => {
  it('Deve solicitar recuperação de senha', async () => {
    const res = await request(app)
      .post('/api/users/forgot-password')
      .send({
        email: 'usertest@example.com'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    
    // Obter token de recuperação para teste
    const [rows] = await db.execute(
      'SELECT reset_token FROM usuarios WHERE email = ?',
      ['usertest@example.com']
    );
    
    resetToken = rows[0].reset_token;
  });
  
  it('Deve redefinir a senha com token válido', async () => {
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({
        token: resetToken,
        senha: 'novasenha123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    
    // Verificar se consegue fazer login com a nova senha
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'usertest@example.com',
        senha: 'novasenha123'
      });
    
    expect(loginRes.statusCode).toBe(200);
    
    // Atualizar token para testes subsequentes
    authToken = loginRes.body.data.token;
  });
});

// Teste de integração para os endpoints de atualização de registros de saúde
describe('Registros de Saúde - Endpoints', () => {
  it('Atualiza registro completo', async () => {
    const res = await request(app)
      .put('/api/registros-saude/update-full')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        usuario_id: testUserId,
        peso: 75.5,
        altura: 1.75,
        gordura_corporal: 18,
        faz_exercicio: true,
        meta_perda_peso: 4
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Registro de saúde atualizado com sucesso!');
  });
  
  // Testa atualização parcial
  it('Atualiza apenas o peso', async () => {
    const res = await request(app)
      .put('/api/registros-saude/weight')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, peso: 80 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Peso atualizado com sucesso!');
  });
  
  it('Atualiza apenas a altura', async () => {
    const res = await request(app)
      .put('/api/registros-saude/height')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, altura: 1.80 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Altura atualizada com sucesso!');
  });
  
  it('Atualiza apenas a gordura corporal', async () => {
    const res = await request(app)
      .put('/api/registros-saude/body-fat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, gordura_corporal: 14 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Gordura corporal atualizada com sucesso!');
  });
  
  it('Atualiza apenas o exercício', async () => {
    const res = await request(app)
      .put('/api/registros-saude/exercise')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, faz_exercicio: false });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Registro de exercício atualizado com sucesso!');
  });
  
  it('Atualiza apenas a meta de perda de peso', async () => {
    const res = await request(app)
      .put('/api/registros-saude/weight-goal')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, meta_perda_peso: 6 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Meta de perda de peso atualizada com sucesso!');
  });
  
  it('Retorna 404 para usuário inexistente', async () => {
    const res = await request(app)
      .put('/api/registros-saude/weight')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: 999999, peso: 85 });
    
    expect(res.statusCode).toBe(403); // Agora retorna 403 por não ser o próprio usuário
    expect(res.body.status).toBe('error');
  });
  
  it('Deve negar acesso a dados de outro usuário', async () => {
    // Criar outro usuário
    const [otherUser] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      ['Other User', 'otheruser@example.com', await hashPassword('123456')]
    );
    const otherUserId = otherUser.insertId;
    
    // Tentar acessar dados do outro usuário
    const res = await request(app)
      .put('/api/registros-saude/weight')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: otherUserId, peso: 85 });
    
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe('error');
    
    // Limpar
    await db.execute('DELETE FROM usuarios WHERE id = ?', [otherUserId]);
  });
});

// Teste de histórico de métricas
describe('Histórico de Métricas', () => {
  it('Deve retornar histórico de métricas com paginação', async () => {
    // Primeiro, fazer algumas atualizações para gerar histórico
    await request(app)
      .put('/api/registros-saude/weight')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, peso: 79 });
    
    await request(app)
      .put('/api/registros-saude/weight')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, peso: 78 });
    
    // Consultar histórico
    const res = await request(app)
      .get(`/api/registros-saude/historico/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .query({ tipo_metrica: 'peso', page: 1, limit: 10 });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('limit');
    expect(res.body.pagination).toHaveProperty('pages');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  
  it('Deve filtrar histórico por tipo de métrica', async () => {
    const res = await request(app)
      .get(`/api/registros-saude/historico/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .query({ tipo_metrica: 'altura' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    
    // Verificar se todos os itens são do tipo 'altura'
    res.body.data.forEach(item => {
      expect(item.tipo_metrica).toBe('altura');
    });
  });
});

// Teste de validação de dados
describe('Validação de Dados', () => {
  it('Deve rejeitar dados inválidos', async () => {
    const res = await request(app)
      .put('/api/registros-saude/weight')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ usuario_id: testUserId, peso: -10 }); // Peso negativo é inválido
    
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body).toHaveProperty('errors');
  });
  
  it('Deve rejeitar email inválido no login', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'emailinvalido',
        senha: '123456'
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});

// Limpeza final
afterAll(async () => {
  // Remove dados criados
  await db.execute('DELETE FROM historico_metricas WHERE usuario_id = ?', [testUserId]);
  await db.execute('DELETE FROM registros_saude WHERE usuario_id = ?', [testUserId]);
  await db.execute('DELETE FROM usuarios WHERE id = ?', [testUserId]);
  await db.end();
});
