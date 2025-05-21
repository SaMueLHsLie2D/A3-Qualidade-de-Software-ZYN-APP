const request = require('supertest');
const app = require('../app');
const { clearDatabase } = require('./setup');
const HealthRecord = require('../models/HealthRecord');

// Mock do modelo HealthRecord para testes
jest.mock('../models/HealthRecord');

describe('Rotas de Registros de Saúde', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('PUT /api/registros-saude/update-full', () => {
    it('deve atualizar todos os dados de saúde de um usuário', async () => {
      // Mock para verificar se registro existe
      HealthRecord.findByUserId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      // Mock para atualização
      HealthRecord.updateFull.mockResolvedValue(true);

      const healthData = {
        usuario_id: 1,
        peso: 72.5,
        altura: 1.78,
        gordura_corporal: 16,
        faz_exercicio: true,
        meta_perda_peso: 3
      };

      const response = await request(app)
        .put('/api/registros-saude/update-full')
        .send(healthData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('mensagem', 'Registro de saúde atualizado com sucesso!');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(healthData.usuario_id);
      expect(HealthRecord.updateFull).toHaveBeenCalledWith(healthData);
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      // Mock para registro não encontrado
      HealthRecord.findByUserId.mockResolvedValue(null);

      const healthData = {
        usuario_id: 999,
        peso: 72.5,
        altura: 1.78,
        gordura_corporal: 16,
        faz_exercicio: true,
        meta_perda_peso: 3
      };

      const response = await request(app)
        .put('/api/registros-saude/update-full')
        .send(healthData)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('mensagem', 'Registro de saúde não encontrado.');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(healthData.usuario_id);
      expect(HealthRecord.updateFull).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando campos obrigatórios estiverem faltando', async () => {
      const healthData = {
        usuario_id: 1
        // Faltando outros campos obrigatórios
      };

      const response = await request(app)
        .put('/api/registros-saude/update-full')
        .send(healthData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(HealthRecord.findByUserId).not.toHaveBeenCalled();
      expect(HealthRecord.updateFull).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/registros-saude/weight', () => {
    it('deve atualizar o peso do usuário', async () => {
      // Mock para verificar se registro existe
      HealthRecord.findByUserId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      // Mock para atualização
      HealthRecord.updateWeight.mockResolvedValue(true);

      const weightData = {
        usuario_id: 1,
        peso: 71.5
      };

      const response = await request(app)
        .put('/api/registros-saude/weight')
        .send(weightData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('mensagem', 'Peso atualizado com sucesso!');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(weightData.usuario_id);
      expect(HealthRecord.updateWeight).toHaveBeenCalledWith(weightData.usuario_id, weightData.peso);
    });

    it('deve retornar erro 404 quando registro não existir', async () => {
      // Mock para registro não encontrado
      HealthRecord.findByUserId.mockResolvedValue(null);

      const weightData = {
        usuario_id: 999,
        peso: 71.5
      };

      const response = await request(app)
        .put('/api/registros-saude/weight')
        .send(weightData)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('mensagem', 'Registro de saúde não encontrado.');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(weightData.usuario_id);
      expect(HealthRecord.updateWeight).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando campos obrigatórios estiverem faltando', async () => {
      const weightData = {
        usuario_id: 1
        // Faltando peso
      };

      const response = await request(app)
        .put('/api/registros-saude/weight')
        .send(weightData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(HealthRecord.findByUserId).not.toHaveBeenCalled();
      expect(HealthRecord.updateWeight).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/registros-saude/height', () => {
    it('deve atualizar a altura do usuário', async () => {
      // Mock para verificar se registro existe
      HealthRecord.findByUserId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      // Mock para atualização
      HealthRecord.updateHeight.mockResolvedValue(true);

      const heightData = {
        usuario_id: 1,
        altura: 1.79
      };

      const response = await request(app)
        .put('/api/registros-saude/height')
        .send(heightData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('mensagem', 'Altura atualizada com sucesso!');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(heightData.usuario_id);
      expect(HealthRecord.updateHeight).toHaveBeenCalledWith(heightData.usuario_id, heightData.altura);
    });
  });

  describe('PUT /api/registros-saude/body-fat', () => {
    it('deve atualizar a gordura corporal do usuário', async () => {
      // Mock para verificar se registro existe
      HealthRecord.findByUserId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      // Mock para atualização
      HealthRecord.updateBodyFat.mockResolvedValue(true);

      const bodyFatData = {
        usuario_id: 1,
        gordura_corporal: 15.5
      };

      const response = await request(app)
        .put('/api/registros-saude/body-fat')
        .send(bodyFatData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('mensagem', 'Gordura corporal atualizada com sucesso!');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(bodyFatData.usuario_id);
      expect(HealthRecord.updateBodyFat).toHaveBeenCalledWith(bodyFatData.usuario_id, bodyFatData.gordura_corporal);
    });
  });

  describe('PUT /api/registros-saude/exercise', () => {
    it('deve atualizar o status de exercício do usuário', async () => {
      // Mock para verificar se registro existe
      HealthRecord.findByUserId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      // Mock para atualização
      HealthRecord.updateExerciseStatus.mockResolvedValue(true);

      const exerciseData = {
        usuario_id: 1,
        faz_exercicio: true
      };

      const response = await request(app)
        .put('/api/registros-saude/exercise')
        .send(exerciseData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('mensagem', 'Registro de exercício atualizado com sucesso!');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(exerciseData.usuario_id);
      expect(HealthRecord.updateExerciseStatus).toHaveBeenCalledWith(exerciseData.usuario_id, exerciseData.faz_exercicio);
    });
  });

  describe('PUT /api/registros-saude/weight-goal', () => {
    it('deve atualizar a meta de perda de peso do usuário', async () => {
      // Mock para verificar se registro existe
      HealthRecord.findByUserId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      // Mock para atualização
      HealthRecord.updateWeightGoal.mockResolvedValue(true);

      const goalData = {
        usuario_id: 1,
        meta_perda_peso: 4.5
      };

      const response = await request(app)
        .put('/api/registros-saude/weight-goal')
        .send(goalData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('mensagem', 'Meta de perda de peso atualizada com sucesso!');
      expect(HealthRecord.findByUserId).toHaveBeenCalledWith(goalData.usuario_id);
      expect(HealthRecord.updateWeightGoal).toHaveBeenCalledWith(goalData.usuario_id, goalData.meta_perda_peso);
    });
  });
});
