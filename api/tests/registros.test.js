const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Testes de registros de saúde', () => {
  let usuarioId;

  beforeAll(async () => {
    const email = `registro_${Date.now()}@exemplo.com`;
    const [res] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      ['Registro Teste', email, 'senha_hash_fake']
    );
    usuarioId = res.insertId;
  });

  afterAll(async () => {
    await db.execute('DELETE FROM usuarios WHERE id = ?', [usuarioId]);
    await db.end();
  });

  test('Criar registro de saúde', async () => {
    const res = await request(app).post('/registros').send({
      usuario_id: usuarioId,
      peso: 70.5,
      altura: 1.75,
      gordura_corporal: 18.5,
      faz_exercicio: true,
      meta_perda_peso: 5.0
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('mensagem', 'Registro criado com sucesso');
  });
});
