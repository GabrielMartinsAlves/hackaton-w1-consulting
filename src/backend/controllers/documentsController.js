const express = require('express');
const router = express.Router();
const db = require('../models');
const { authMiddleware } = require('./authController');

const Document = db.Document;

// Listar documentos do usuário autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.findAll({ where: { user_id: req.user.id } });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar um novo documento (apenas para o usuário autenticado)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { document, status_id } = req.body;
    const newDocument = await Document.create({
      user_id: req.user.id,
      document,
      status_id,
    });
    res.status(201).json(newDocument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar um documento (apenas se for do usuário autenticado)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { document, status_id } = req.body;
    const documentToUpdate = await Document.findByPk(id);
    if (!documentToUpdate || documentToUpdate.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own documents' });
    }
    const [updated] = await Document.update(
      { document, status_id },
      { where: { id } }
    );
    if (updated) {
      const updatedDocument = await Document.findByPk(id);
      res.json(updatedDocument);
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar um documento (apenas se for do usuário autenticado)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const documentToDelete = await Document.findByPk(id);
    if (!documentToDelete || documentToDelete.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own documents' });
    }
    const deleted = await Document.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Document deleted' });
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router: router, authMiddleware };