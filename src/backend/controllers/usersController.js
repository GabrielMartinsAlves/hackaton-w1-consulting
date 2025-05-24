const express = require('express');
const router = express.Router();
const db = require('../models');
const { authMiddleware } = require('./authController');

const User = db.User;

// Listar o próprio usuário (protegido) - CORRIGIDO
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('GET /users - User from token:', req.user.id, req.user.email); // Log para debug
    
    const user = await User.findByPk(req.user.id, { 
      attributes: ['id', 'name', 'email', 'created_at', 'last_access', 'is_active']
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      last_access: user.last_access,
      is_active: user.is_active
    });
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'created_at', 'last_access', 'is_active'],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      last_access: user.last_access,
      is_active: user.is_active,
    });
  } catch (err) {
    console.error('Erro ao buscar usuário por ID:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar o próprio usuário - MELHORADO
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    console.log('PUT /users/:id - Params ID:', userId, 'User ID:', req.user.id); // Log para debug
    
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own profile' });
    }
    
    const { name, email, password } = req.body;
    
    // Validações
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: 'Email already in use by another user' });
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
    
    const [updated] = await User.update(updateData, { where: { id: userId } });
    
    if (updated) {
      const updatedUser = await User.findByPk(userId, { 
        attributes: ['id', 'name', 'email', 'created_at', 'last_access', 'is_active']
      });
      res.json({
        message: 'User updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          created_at: updatedUser.created_at,
          last_access: updatedUser.last_access,
          is_active: updatedUser.is_active
        }
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('PUT /users/:id error:', err);
    
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

// Deletar o próprio usuário - MELHORADO
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    
    console.log('DELETE /users/:id - Params ID:', userId, 'User ID:', req.user.id); // Log para debug
    
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own profile' });
    }
    
    // Ao invés de deletar fisicamente, podemos desativar o usuário
    const [updated] = await User.update(
      { is_active: false },
      { where: { id: userId } }
    );
    
    if (updated) {
      res.json({ message: 'User account deactivated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router: router, authMiddleware };