const express = require('express')
const router = express.Router()
const db = require('../models')
const { authMiddleware } = require('./authController')

const Contract = db.Contract;

router.get('/', authMiddleware, async (req, res) => {
  try {
    const contracts = await db.Contract.findAll({ 
      where: { user_id: req.user.id },
      include: [
        {
          model: db.Status,
          as: 'status',
          attributes: ['id', 'status']
        }
      ]
    });
    res.json(contracts);
  } catch (err) {
    console.error('Erro ao listar contratos:', err);
    res.status(500).json({ error: 'Erro ao buscar contratos' });
  }
});


router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findOne({
      where: { 
        id: id,
        user_id: req.user.id
      },
      include: [
        { model: db.Status, as: 'status' },
        { model: db.User, as: 'user' }
      ]
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    res.json(contract);
  } catch (err) {
    console.error('Erro ao buscar contrato:', err);
    res.status(500).json({ error: 'Erro ao buscar contrato' });
  }
});

// Criar um novo contrato (apenas para o usuário autenticado)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { contract, status_id, document } = req.body;

    // Validações
    if (!contract || !status_id) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: contract e status_id' 
      });
    }

    // Verificar se o status existe
    const statusExists = await db.Status.findByPk(status_id);
    if (!statusExists) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const newContract = await Contract.create({
      user_id: req.user.id,
      contract,
      status_id,
      document: document || null,
    });

    // Carregar relacionamentos
    const contractWithRelations = await Contract.findByPk(newContract.id, {
      include: [
        { model: db.Status, as: 'status' },
        { model: db.User, as: 'user' }
      ]
    });

    res.status(201).json(contractWithRelations);
  } catch (err) {
    console.error('Erro ao criar contrato:', err);
    
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
    
    res.status(400).json({ error: 'Erro ao criar contrato' });
  }
});

// Atualizar um contrato (apenas se for do usuário autenticado)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { contract, status_id, document } = req.body;

    // Validações
    if (!contract && !status_id && document === undefined) {
      return res.status(400).json({ 
        error: 'Nenhum campo válido para atualização' 
      });
    }

    const contractToUpdate = await Contract.findByPk(id);
    if (!contractToUpdate) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    if (contractToUpdate.user_id !== req.user.id) {
      return res.status(403).json({ 
        error: 'Não autorizado: Você só pode atualizar seus próprios contratos' 
      });
    }

    // Se status_id for fornecido, verificar se existe
    if (status_id) {
      const statusExists = await db.Status.findByPk(status_id);
      if (!statusExists) {
        return res.status(400).json({ error: 'Status inválido' });
      }
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData = {};
    if (contract !== undefined) updateData.contract = contract;
    if (status_id !== undefined) updateData.status_id = status_id;
    if (document !== undefined) updateData.document = document;

    const [updated] = await Contract.update(updateData, { where: { id } });

    if (updated) {
      const updatedContract = await Contract.findByPk(id, {
        include: [
          { model: db.Status, as: 'status' },
          { model: db.User, as: 'user' }
        ]
      });
      res.json(updatedContract);
    } else {
      res.status(404).json({ error: 'Contrato não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao atualizar contrato:', err);
    
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
    
    res.status(400).json({ error: 'Erro ao atualizar contrato' });
  }
});

// Deletar um contrato (apenas se for do usuário autenticado)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const contractToDelete = await Contract.findByPk(id);
    
    if (!contractToDelete) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    if (contractToDelete.user_id !== req.user.id) {
      return res.status(403).json({ 
        error: 'Não autorizado: Você só pode deletar seus próprios contratos' 
      });
    }

    const deleted = await Contract.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Contrato deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Contrato não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao deletar contrato:', err);
    res.status(500).json({ error: 'Erro ao deletar contrato' });
  }
});

module.exports = {router, authMiddleware}