/**
 * Rotas para gerenciamento de registros de saúde
 * 
 * Este módulo define as rotas da API relacionadas aos registros de saúde dos usuários,
 * incluindo atualização de métricas como peso, altura, gordura corporal, status de exercício
 * e meta de perda de peso.(isso é o que vai pra o front-end)
 * 
 * @module routes/healthRecords
 */

const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');

/**
 * @route PUT /api/registros-saude/update-full
 * @description Atualiza todos os dados de saúde de um usuário
 * @access Privado (recomendado implementar autenticação)
 */
router.put('/update-full', healthRecordController.updateFull);

/**
 * @route PUT /api/registros-saude/weight
 * @description Atualiza apenas o peso do usuário
 * @access Privado (recomendado implementar autenticação)
 */
router.put('/weight', healthRecordController.updateWeight);

/**
 * @route PUT /api/registros-saude/height
 * @description Atualiza apenas a altura do usuário
 * @access Privado (recomendado implementar autenticação)
 */
router.put('/height', healthRecordController.updateHeight);

/**
 * @route PUT /api/registros-saude/body-fat
 * @description Atualiza apenas o percentual de gordura corporal do usuário
 * @access Privado (recomendado implementar autenticação)
 */
router.put('/body-fat', healthRecordController.updateBodyFat);

/**
 * @route PUT /api/registros-saude/exercise
 * @description Atualiza o status de prática de exercícios do usuário
 * @access Privado (recomendado implementar autenticação)
 */
router.put('/exercise', healthRecordController.updateExerciseStatus);

/**
 * @route PUT /api/registros-saude/weight-goal
 * @description Atualiza a meta de perda de peso do usuário
 * @access Privado (recomendado implementar autenticação)
 */
router.put('/weight-goal', healthRecordController.updateWeightGoal);

module.exports = router;
