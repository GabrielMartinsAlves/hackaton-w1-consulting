const express = require('express');
const router = express.Router();
const db = require('../models');
const { authMiddleware } = require('./authController');

const Step = db.Step;

// Listar etapas do usuário autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const steps = await Step.findAll({ where: { user_id: req.user.id } });
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar uma nova etapa (apenas para o usuário autenticado)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { registration, documentation, structuring, drafting } = req.body;
    const newStep = await Step.create({
      user_id: req.user.id,
      registration,
      documentation,
      structuring,
      drafting,
    });
    res.status(201).json(newStep);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar uma etapa (apenas se for do usuário autenticado)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { registration, documentation, structuring, drafting } = req.body;
    const stepToUpdate = await Step.findByPk(id);
    if (!stepToUpdate || stepToUpdate.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own steps' });
    }
    const [updated] = await Step.update(
      { registration, documentation, structuring, drafting },
      { where: { id } }
    );
    if (updated) {
      const updatedStep = await Step.findByPk(id);
      res.json(updatedStep);
    } else {
      res.status(404).json({ error: 'Step not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar uma etapa (apenas se for do usuário autenticado)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const stepToDelete = await Step.findByPk(id);
    if (!stepToDelete || stepToDelete.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own steps' });
    }
    const deleted = await Step.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Step deleted' });
    } else {
      res.status(404).json({ error: 'Step not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router: router, authMiddleware };