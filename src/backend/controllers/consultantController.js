const express = require('express');
const router = express.Router();
const db = require('../models');
const { authMiddleware } = require('./authController');

const Consultant = db.Consultant;

// Listar o próprio consultor (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('GET /consultants - Consultant from token:', req.user.id, req.user.email);

    const consultant = await Consultant.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'created_at', 'last_access', 'is_active']
    });

    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    res.json({
      id: consultant.id,
      name: consultant.name,
      email: consultant.email,
      created_at: consultant.created_at,
      last_access: consultant.last_access,
      is_active: consultant.is_active
    });
  } catch (err) {
    console.error('GET /consultants error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar o próprio consultor
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const consultantId = parseInt(id);

    console.log('PUT /consultants/:id - Params ID:', consultantId, 'Consultant ID:', req.user.id);

    if (consultantId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own profile' });
    }

    const { name, email, password } = req.body;

    // Validações
    if (email && email !== req.user.email) {
      const existingConsultant = await Consultant.findByEmail(email);
      if (existingConsultant && existingConsultant.id !== req.user.id) {
        return res.status(400).json({ error: 'Email already in use by another consultant' });
      }
    }

    // Preparar dados para atualização
    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (email && email.trim()) updateData.email = email.toLowerCase().trim();
    if (password && password.trim()) updateData.password = password.trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const [updated] = await Consultant.update(updateData, { where: { id: consultantId } });

    if (updated) {
      const updatedConsultant = await Consultant.findByPk(consultantId, {
        attributes: ['id', 'name', 'email', 'created_at', 'last_access', 'is_active']
      });
      res.json({
        message: 'Consultant updated successfully',
        consultant: {
          id: updatedConsultant.id,
          name: updatedConsultant.name,
          email: updatedConsultant.email,
          created_at: updatedConsultant.created_at,
          last_access: updatedConsultant.last_access,
          is_active: updatedConsultant.is_active
        }
      });
    } else {
      res.status(404).json({ error: 'Consultant not found' });
    }
  } catch (err) {
    console.error('PUT /consultants/:id error:', err);

    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map(error => ({
        field: error.path,
        message: error.message
      }));
      return res.status(400).json({
        error: 'Validation error',
        details: validationErrors
      });
    }

    res.status(400).json({ error: err.message });
  }
});

// Deletar (desativar) o próprio consultor
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const consultantId = parseInt(id);

    console.log('DELETE /consultants/:id - Params ID:', consultantId, 'Consultant ID:', req.user.id);

    if (consultantId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own profile' });
    }

    // Soft delete - desativar o consultor
    const [updated] = await Consultant.update(
      { is_active: false },
      { where: { id: consultantId } }
    );

    if (updated) {
      res.json({ message: 'Consultant account deactivated successfully' });
    } else {
      res.status(404).json({ error: 'Consultant not found' });
    }
  } catch (err) {
    console.error('DELETE /consultants/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router: router, authMiddleware };