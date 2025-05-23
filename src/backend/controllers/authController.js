const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware de autenticação COM LOGS DETALHADOS
const authMiddleware = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('1. Headers recebidos:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('2. Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('3. ERRO: Token não fornecido ou formato inválido');
      return res.status(401).json({ error: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('4. Token extraído:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!JWT_SECRET) {
      console.log('5. ERRO CRÍTICO: JWT_SECRET não está definido!');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    console.log('6. JWT_SECRET está definido:', JWT_SECRET ? 'SIM' : 'NÃO');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('7. Token decodificado com sucesso:', decoded);
    
    // Verificar se decoded tem as propriedades esperadas
    console.log('8. Propriedades do token decodificado:');
    console.log('   - id:', decoded.id);
    console.log('   - email:', decoded.email);
    console.log('   - name:', decoded.name);
    
    let user = null;
    
    // Tentar buscar por ID primeiro
    if (decoded.id) {
      console.log('9. Tentando buscar usuário pelo ID:', decoded.id);
      try {
        user = await User.findByPk(decoded.id, { 
          attributes: ['id', 'name', 'email', 'is_active'] 
        });
        console.log('10. Resultado da busca por ID:', user ? {
          id: user.id,
          email: user.email,
          name: user.name,
          is_active: user.is_active
        } : 'null');
      } catch (findError) {
        console.log('10. ERRO ao buscar por ID:', findError.message);
      }
    } else {
      console.log('9. ID não encontrado no token, pulando busca por ID');
    }
    
    // Se não encontrou por ID, tentar por email
    if (!user && decoded.email) {
      console.log('11. Tentando buscar usuário pelo email:', decoded.email);
      try {
        user = await User.findByEmail(decoded.email, { 
          attributes: ['id', 'name', 'email', 'is_active'] 
        });
        console.log('12. Resultado da busca por email:', user ? {
          id: user.id,
          email: user.email,
          name: user.name,
          is_active: user.is_active
        } : 'null');
      } catch (findError) {
        console.log('12. ERRO ao buscar por email:', findError.message);
      }
    } else if (!decoded.email) {
      console.log('11. Email não encontrado no token, pulando busca por email');
    }

    // Verificar se o método findByEmail existe
    if (typeof User.findByEmail !== 'function') {
      console.log('13. ERRO: Método User.findByEmail não existe!');
      console.log('    Métodos disponíveis:', Object.getOwnPropertyNames(User).filter(name => typeof User[name] === 'function'));
    }

    if (!user) {
      console.log('14. RESULTADO FINAL: Usuário não encontrado em nenhuma busca');
      
      // Vamos tentar uma busca manual para debug
      console.log('15. Tentando busca manual no banco...');
      try {
        const allUsers = await User.findAll({ 
          attributes: ['id', 'name', 'email', 'is_active'],
          limit: 5 
        });
        console.log('16. Primeiros 5 usuários no banco:', allUsers.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          is_active: u.is_active
        })));
      } catch (dbError) {
        console.log('16. ERRO ao buscar usuários:', dbError.message);
      }
      
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar se o usuário está ativo
    if (!user.is_active) {
      console.log('17. ERRO: Usuário encontrado mas está inativo');
      return res.status(401).json({ error: 'User account is inactive' });
    }

    console.log('18. SUCESSO: Usuário autenticado com sucesso:', {
      id: user.id,
      email: user.email,
      name: user.name
    });
    console.log('=== FIM AUTH MIDDLEWARE DEBUG ===\n');

    req.user = user;
    next();
  } catch (err) {
    console.log('=== ERRO NO AUTH MIDDLEWARE ===');
    console.error('Tipo do erro:', err.name);
    console.error('Mensagem do erro:', err.message);
    console.error('Stack trace:', err.stack);
    console.log('=== FIM ERRO AUTH MIDDLEWARE ===\n');
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Rota protegida para obter informações do usuário
router.get('/@me', authMiddleware, async (req, res) => {
  try {
    console.log('=== ROTA /@me ===');
    console.log('User do req:', req.user);
    
    const user = req.user;
    if (!user) {
      console.log('ERRO: req.user está vazio na rota /@me');
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      id: user.id,
      email: user.email,
      name: user.name,
      is_active: user.is_active
    };
    
    console.log('Resposta da rota /@me:', response);
    console.log('=== FIM ROTA /@me ===\n');
    
    res.json(response);
  } catch (err) {
    console.error('Error in /@me route:', err);
    res.status(500).json({ error: err.message });
  }
});

// ROTA DE DEBUG ESPECIAL - Para testar conexão com banco
router.get('/debug-db', async (req, res) => {
  try {
    console.log('=== DEBUG DATABASE ===');
    
    // Testar conexão
    await db.sequelize.authenticate();
    console.log('1. Conexão com banco: OK');
    
    // Testar modelo User
    console.log('2. Modelo User:', User ? 'OK' : 'ERRO');
    
    // Listar métodos do User
    const userMethods = Object.getOwnPropertyNames(User).filter(name => typeof User[name] === 'function');
    console.log('3. Métodos do User:', userMethods);
    
    // Testar findByEmail
    if (typeof User.findByEmail === 'function') {
      console.log('4. Método findByEmail: OK');
    } else {
      console.log('4. Método findByEmail: NÃO EXISTE');
    }
    
    // Contar usuários
    const userCount = await User.count();
    console.log('5. Total de usuários no banco:', userCount);
    
    // Listar alguns usuários
    const users = await User.findAll({ 
      attributes: ['id', 'name', 'email', 'is_active'],
      limit: 3 
    });
    console.log('6. Primeiros usuários:', users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      is_active: u.is_active
    })));
    
    console.log('=== FIM DEBUG DATABASE ===');
    
    res.json({
      message: 'Debug completed',
      connectionOk: true,
      userModel: !!User,
      findByEmailExists: typeof User.findByEmail === 'function',
      userCount: userCount,
      sampleUsers: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        is_active: u.is_active
      }))
    });
    
  } catch (err) {
    console.error('Erro no debug do banco:', err);
    res.status(500).json({ 
      error: err.message,
      connectionOk: false 
    });
  }
});

// Login com logs extras
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN DEBUG ===');
    const { email, password } = req.body;
    console.log('1. Dados recebidos:', { email, password: password ? '[HIDDEN]' : 'undefined' });
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    console.log('2. Tentando buscar usuário pelo email:', email);
    const user = await User.findByEmail(email.toLowerCase().trim());
    console.log('3. Usuário encontrado:', user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      is_active: user.is_active
    } : 'null');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    const isPasswordValid = await user.checkPassword(password);
    console.log('4. Senha válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Atualizar último acesso
    await User.update(
      { last_access: new Date() },
      { where: { id: user.id } }
    );

    const tokenPayload = { 
      id: user.id,
      email: user.email,
      name: user.name
    };
    
    console.log('5. Payload do token:', tokenPayload);
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '5d' });
    console.log('6. Token gerado:', token ? `${token.substring(0, 20)}...` : 'null');
    
    const response = { 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_active: user.is_active
      }
    };
    
    console.log('7. Resposta do login:', { ...response, token: `${response.token.substring(0, 20)}...` });
    console.log('=== FIM LOGIN DEBUG ===\n');
    
    res.json(response);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Outras rotas mantidas
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'All fields are required: email, password, and name' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ 
      email: email.toLowerCase().trim(), 
      password: password.trim(), 
      name: name.trim() 
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    res.status(201).json({ 
      message: 'User created successfully', 
      userId: user.id 
    });
  } catch (err) {
    console.error('Registration error:', err);
    
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
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = { router, authMiddleware };