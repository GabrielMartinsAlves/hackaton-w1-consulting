const express = require('express')
const router = express.Router()
const db = require('../models')
const { authMiddleware } = require('./authController')
const { route } = require('./contractsController')

const Status = db.Status

router.get('/', authMiddleware, async (req, res) => {
  try {
    const statusList = await Status.findAll({ order: [['nome', 'ASC']] })
    res.json(statusList)
  } catch (err) {
    console.error('Erro ao listar status:', err)
    res.status(500).json({ error: 'Erro ao buscar status' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const status = await Status.findByPk(id)
    if (!status) return res.status(404).json({ error: 'Status não encontrado' })
    res.json(status)
  } catch (err) {
    console.error('Erro ao buscar status:', err)
    res.status(500).json({ error: 'Erro ao buscar status' })
  }
})

module.exports = { router, authMiddleware }
