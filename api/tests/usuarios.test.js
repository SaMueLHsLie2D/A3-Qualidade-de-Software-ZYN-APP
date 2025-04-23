const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Testes de usuários', () => {
  let email = `teste_${Date.now()}@exemplo.com`;

  afterAll(async () => {
    await db.execute('DELETE FROM usuarios WHERE email = ?', [email]);
    await db.end();
  });

  test('Cadastro de novo usuário', async () => {
    const res = await request(app).post('/usuarios/cadastro').send({
      nome: 'Usuário Teste',
      email,
      senha: 'senha123'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('Login do usuário', async () => {
    const res = await request(app).post('/usuarios/login').send({
      email,
      senha: 'senha123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensagem', 'Login bem-sucedido');
    expect(res.body.usuario).toHaveProperty('id');
  });
});
