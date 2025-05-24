const express = require('express')
const router = express.Router()
const db = require('../models')
const { authMiddleware } = require('./authController')

const ConsultantClient = db.ConsultantClient

// GET all ConsultantClient associations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const consultantClients = await ConsultantClient.findAll()
    res.json(consultantClients)
  } catch (err) {
    console.error('Erro ao listar ConsultantClient:', err)
    res.status(500).json({ error: 'Erro ao buscar ConsultantClient' })
  }
})

router.get('/consultants/:id/clients', async (req, res) => {
  const { id: consultant_id } = req.params;

  try {
    const associations = await db.ConsultantClient.findAll({
      where: { consultant_id },
      include: [
        {
          model: db.User,
          as: 'client',
          attributes: ['id','name', 'email'],
        },
      ],
    });

    const clients = associations
      .filter(assoc => assoc.client)
      .map((assoc) => ({
        id: assoc.client.id,
        nome: assoc.client.name,
        email: assoc.client.email,
      }));

    res.json(clients);
  } catch (err) {
    console.error('Erro ao buscar clientes do consultor:', err);
    res.status(500).json({ error: 'Erro ao buscar clientes do consultor' });
  }
});


// GET a specific ConsultantClient association by consultant_id and client_id
router.get('/:consultant_id/:client_id', authMiddleware, async (req, res) => {
  try {
    const { consultant_id, client_id } = req.params
    const consultantClient = await ConsultantClient.findOne({
      where: { consultant_id, client_id }
    })
    if (!consultantClient) {
      return res.status(404).json({ error: 'Associação não encontrada' })
    }
    res.json(consultantClient)
  } catch (err) {
    console.error('Erro ao buscar ConsultantClient:', err)
    res.status(500).json({ error: 'Erro ao buscar ConsultantClient' })
  }
})

// POST - Create a new ConsultantClient association
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { consultant_id, client_id } = req.body
    const newAssociation = await ConsultantClient.create({ consultant_id, client_id })
    res.status(201).json(newAssociation)
  } catch (err) {
    console.error('Erro ao criar ConsultantClient:', err)
    res.status(500).json({ error: 'Erro ao criar ConsultantClient' })
  }
})

// DELETE - Remove a ConsultantClient association
router.delete('/:consultant_id/:client_id', authMiddleware, async (req, res) => {
  try {
    const { consultant_id, client_id } = req.params
    const deleted = await ConsultantClient.destroy({
      where: { consultant_id, client_id }
    })
    if (!deleted) {
      return res.status(404).json({ error: 'Associação não encontrada' })
    }
    res.status(204).send()
  } catch (err) {
    console.error('Erro ao deletar ConsultantClient:', err)
    res.status(500).json({ error: 'Erro ao deletar ConsultantClient' })
  }
})

module.exports = { router, authMiddleware }