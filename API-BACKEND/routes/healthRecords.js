const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');

// Atualizar registro de saúde completo
router.put('/update-full', healthRecordController.updateFull);

// Atualizar peso
router.put('/weight', healthRecordController.updateWeight);

// Atualizar altura
router.put('/height', healthRecordController.updateHeight);

// Atualizar gordura corporal
router.put('/body-fat', healthRecordController.updateBodyFat);

// Atualizar status de exercício
router.put('/exercise', healthRecordController.updateExerciseStatus);

// Atualizar meta de perda de peso
router.put('/weight-goal', healthRecordController.updateWeightGoal);

module.exports = router;
