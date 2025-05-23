const express = require('express')
const router = express.Router()
const db = require('../models')

const Lead = db.Lead

router.post('/', async (req, res) => {
  try {
    const { email, valorImovel, obs } = req.body
    if (!email || !valorImovel) {
      return res.status(400).json({ error: 'Email e valor do imóvel são obrigatórios' })
    }

    const existingLead = await Lead.findByEmail(email)
    if (existingLead) {
      return res.status(400).json({ error: 'Esse email já foi registrado' })
    }

    const lead = await Lead.create({
      email,
      property_value: parseFloat(valorImovel),
      notes: obs || null
    })

    res.status(201).json({
      message: 'Informações registradas com sucesso',
      lead: {
        id: lead.id,
        email: lead.email,
        property_value: lead.property_value,
        notes: lead.notes
      }
    })
  } catch (err) {
    console.error('POST /informations error:', err)
    if (err.name === 'SequelizeValidationError') {
      const details = err.errors.map(error => ({
        field: error.path,
        message: error.message
      }))
      return res.status(400).json({ error: 'Erro de validação', details })
    }
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

module.exports = { router }