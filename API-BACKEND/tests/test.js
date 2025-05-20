const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testUserId;

// Teste de integração para a API

describe('Testando API', () => {
  it('Retorna 200 na rota raiz (exemplo)', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
  });
});

// Teste de integração para os endpoints de atualização de registros de saúde

beforeAll(async () => {
  // Cria usuário de teste
  const [result] = await db.execute(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    ['User Test', 'usertest@example.com', '123456']
  );
  testUserId = result.insertId;

  // Cria registro de saúde relacionado
  await db.execute(
    `INSERT INTO registros_saude 
      (usuario_id, peso, altura, gordura_corporal, faz_exercicio, meta_perda_peso)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [testUserId, 70, 1.70, 15, false, 5]
  );
});

afterAll(async () => {
  // Remove dados criados
  await db.execute('DELETE FROM registros_saude WHERE usuario_id = ?', [testUserId]);
  await db.execute('DELETE FROM usuarios WHERE id = ?', [testUserId]);
  db.end();
});

describe('Registros de Saúde - Endpoints', () => {
  it('Atualiza registro completo', async () => {
    const res = await request(app)
      .put('/api/registros-saude/update-full')
      .send({
        usuario_id: testUserId,
        peso: 75.5,
        altura: 1.75,
        gordura_corporal: 18,
        faz_exercicio: true,
        meta_perda_peso: 4
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Registro de saúde atualizado com sucesso!');
  });

    // Testa atualização parcial

  it('Atualiza apenas o peso', async () => {
    const res = await request(app)
      .put('/api/registros-saude/weight')
      .send({ usuario_id: testUserId, peso: 80 });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Peso atualizado com sucesso!');
  });

  it('Atualiza apenas a altura', async () => {
    const res = await request(app)
      .put('/api/registros-saude/height')
      .send({ usuario_id: testUserId, altura: 1.80 });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Altura atualizada com sucesso!');
  });

  it('Atualiza apenas a gordura corporal', async () => {
    const res = await request(app)
      .put('/api/registros-saude/body-fat')
      .send({ usuario_id: testUserId, gordura_corporal: 14 });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Gordura corporal atualizada com sucesso!');
  });

  it('Atualiza apenas o exercício', async () => {
    const res = await request(app)
      .put('/api/registros-saude/exercise')
      .send({ usuario_id: testUserId, faz_exercicio: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Registro de exercício atualizado com sucesso!');
  });

  it('Atualiza apenas a meta de perda de peso', async () => {
    const res = await request(app)
      .put('/api/registros-saude/weight-goal')
      .send({ usuario_id: testUserId, meta_perda_peso: 6 });

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Meta de perda de peso atualizada com sucesso!');
  });

  it('Retorna 404 para usuário inexistente', async () => {
    const res = await request(app)
      .put('/api/registros-saude/weight')
      .send({ usuario_id: 999999, peso: 85 });

    expect(res.statusCode).toBe(404);
    expect(res.body.mensagem).toBe('Registro de saúde não encontrado.');
  });
});