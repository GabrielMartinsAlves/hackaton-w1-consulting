const express = require('express');
const router = express.Router();
const db = require('../models');
const { authMiddleware } = require('./authController');

const Status = db.Status;

// Listar todos os status (pode ser público, mas vamos proteger por consistência)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.json(statuses);
  } catch (err) {
    console.error('Erro ao listar status:', err);
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

// Criar um novo status (protegido, associado ao usuário)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || status.trim() === '') {
      return res.status(400).json({ 
        error: 'O campo status é obrigatório' 
      });
    }

    const newStatus = await Status.create({ 
      status: status.trim() 
    });
    res.status(201).json(newStatus);
  } catch (err) {
    console.error('Erro ao criar status:', err);
    
    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map(error => ({
        field: error.path,
        message: error.message
      }));
      return res.status(400).json({ 
        error: 'Erro de validação', 
        details: validationErrors 
      });
    }
    
    res.status(400).json({ error: 'Erro ao criar status' });
  }
});

// Atualizar um status (apenas se criado pelo usuário, mas status geralmente é global)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || status.trim() === '') {
      return res.status(400).json({ 
        error: 'O campo status é obrigatório' 
      });
    }

    const statusToUpdate = await Status.findByPk(id);
    if (!statusToUpdate) {
      return res.status(404).json({ error: 'Status não encontrado' });
    }

    const [updated] = await Status.update(
      { status: status.trim() },
      { where: { id } }
    );

    if (updated) {
      const updatedStatus = await Status.findByPk(id);
      res.json(updatedStatus);
    } else {
      res.status(404).json({ error: 'Status não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    
    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map(error => ({
        field: error.path,
        message: error.message
      }));
      return res.status(400).json({ 
        error: 'Erro de validação', 
        details: validationErrors 
      });
    }
    
    res.status(400).json({ error: 'Erro ao atualizar status' });
  }
});

// Deletar um status (apenas se criado pelo usuário, mas status geralmente é global)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const statusToDelete = await Status.findByPk(id);
    
    if (!statusToDelete) {
      return res.status(404).json({ error: 'Status não encontrado' });
    }

    const deleted = await Status.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Status deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Status não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao deletar status:', err);
    res.status(500).json({ error: 'Erro ao deletar status' });
  }
});

module.exports = { router: router, authMiddleware };