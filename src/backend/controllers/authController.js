const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Consultant = db.Consultant;

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
    console.log('   - userType:', decoded.userType);
    
    let user = null;
    let userType = decoded.userType || 'user'; // Default para 'user' se não especificado
    
    // Determinar qual modelo usar baseado no userType
    const Model = userType === 'consultant' ? Consultant : User;
    const modelName = userType === 'consultant' ? 'Consultant' : 'User';
    
    console.log(`9. Buscando no modelo: ${modelName}`);
    
    // Tentar buscar por ID primeiro
    if (decoded.id) {
      console.log(`10. Tentando buscar ${modelName.toLowerCase()} pelo ID:`, decoded.id);
      try {
        user = await Model.findByPk(decoded.id, { 
          attributes: ['id', 'name', 'email', 'is_active'] 
        });
        console.log(`11. Resultado da busca por ID no ${modelName}:`, user ? {
          id: user.id,
          email: user.email,
          name: user.name,
          is_active: user.is_active
        } : 'null');
      } catch (findError) {
        console.log(`11. ERRO ao buscar por ID no ${modelName}:`, findError.message);
      }
    } else {
      console.log('10. ID não encontrado no token, pulando busca por ID');
    }
    
    // Se não encontrou por ID, tentar por email
    if (!user && decoded.email) {
      console.log(`12. Tentando buscar ${modelName.toLowerCase()} pelo email:`, decoded.email);
      try {
        user = await Model.findByEmail(decoded.email, { 
          attributes: ['id', 'name', 'email', 'is_active'] 
        });
        console.log(`13. Resultado da busca por email no ${modelName}:`, user ? {
          id: user.id,
          email: user.email,
          name: user.name,
          is_active: user.is_active
        } : 'null');
      } catch (findError) {
        console.log(`13. ERRO ao buscar por email no ${modelName}:`, findError.message);
      }
    } else if (!decoded.email) {
      console.log('12. Email não encontrado no token, pulando busca por email');
    }

    // Verificar se o método findByEmail existe
    if (typeof Model.findByEmail !== 'function') {
      console.log(`14. ERRO: Método ${modelName}.findByEmail não existe!`);
      console.log('    Métodos disponíveis:', Object.getOwnPropertyNames(Model).filter(name => typeof Model[name] === 'function'));
    }

    if (!user) {
      console.log(`15. RESULTADO FINAL: ${modelName} não encontrado em nenhuma busca`);
      
      // Vamos tentar uma busca manual para debug
      console.log(`16. Tentando busca manual no banco ${modelName}...`);
      try {
        const allUsers = await Model.findAll({ 
          attributes: ['id', 'name', 'email', 'is_active'],
          limit: 5 
        });
        console.log(`17. Primeiros 5 registros no ${modelName}:`, allUsers.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          is_active: u.is_active
        })));
      } catch (dbError) {
        console.log(`17. ERRO ao buscar registros no ${modelName}:`, dbError.message);
      }
      
      return res.status(404).json({ error: `${modelName} not found` });
    }

    // Verificar se o usuário está ativo
    if (!user.is_active) {
      console.log(`18. ERRO: ${modelName} encontrado mas está inativo`);
      return res.status(401).json({ error: `${modelName} account is inactive` });
    }

    console.log(`19. SUCESSO: ${modelName} autenticado com sucesso:`, {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: userType
    });
    console.log('=== FIM AUTH MIDDLEWARE DEBUG ===\n');

    // Adicionar informações do usuário e tipo à requisição
    req.user = user;
    req.userType = userType;
    req.isConsultant = userType === 'consultant';
    req.isUser = userType === 'user';
    
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

// Middleware para verificar se é consultor
const consultantOnly = (req, res, next) => {
  if (!req.isConsultant) {
    return res.status(403).json({ error: 'Access denied: Consultant privileges required' });
  }
  next();
};

// Middleware para verificar se é usuário comum
const userOnly = (req, res, next) => {
  if (!req.isUser) {
    return res.status(403).json({ error: 'Access denied: User privileges required' });
  }
  next();
};

// Rota protegida para obter informações do usuário autenticado
router.get('/@me', authMiddleware, async (req, res) => {
  try {
    console.log('=== ROTA /@me ===');
    console.log('User do req:', req.user);
    console.log('User type:', req.userType);
    
    const user = req.user;
    if (!user) {
      console.log('ERRO: req.user está vazio na rota /@me');
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      id: user.id,
      email: user.email,
      name: user.name,
      is_active: user.is_active,
      userType: req.userType,
      isConsultant: req.isConsultant,
      isUser: req.isUser
    };
    
    console.log('Resposta da rota /@me:', response);
    console.log('=== FIM ROTA /@me ===\n');
    
    res.json(response);
  } catch (err) {
    console.error('Error in /@me route:', err);
    res.status(500).json({ error: err.message });
  }
});

// ROTA DE DEBUG ESPECIAL - Para testar conexão com ambos os bancos
router.get('/debug-db', async (req, res) => {
  try {
    console.log('=== DEBUG DATABASE ===');
    
    // Testar conexão
    await db.sequelize.authenticate();
    console.log('1. Conexão com banco: OK');
    
    // Testar modelo User
    console.log('2. Modelo User:', User ? 'OK' : 'ERRO');
    console.log('3. Modelo Consultant:', Consultant ? 'OK' : 'ERRO');
    
    // Listar métodos dos modelos
    const userMethods = Object.getOwnPropertyNames(User).filter(name => typeof User[name] === 'function');
    const consultantMethods = Object.getOwnPropertyNames(Consultant).filter(name => typeof Consultant[name] === 'function');
    console.log('4. Métodos do User:', userMethods);
    console.log('5. Métodos do Consultant:', consultantMethods);
    
    // Testar findByEmail
    console.log('6. User.findByEmail:', typeof User.findByEmail === 'function' ? 'OK' : 'NÃO EXISTE');
    console.log('7. Consultant.findByEmail:', typeof Consultant.findByEmail === 'function' ? 'OK' : 'NÃO EXISTE');
    
    // Contar registros
    const userCount = await User.count();
    const consultantCount = await Consultant.count();
    console.log('8. Total de usuários no banco:', userCount);
    console.log('9. Total de consultores no banco:', consultantCount);
    
    // Listar alguns registros
    const users = await User.findAll({ 
      attributes: ['id', 'name', 'email', 'is_active'],
      limit: 3 
    });
    const consultants = await Consultant.findAll({ 
      attributes: ['id', 'name', 'email', 'is_active'],
      limit: 3 
    });
    
    console.log('10. Primeiros usuários:', users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      is_active: u.is_active
    })));
    
    console.log('11. Primeiros consultores:', consultants.map(c => ({
      id: c.id,
      email: c.email,
      name: c.name,
      is_active: c.is_active
    })));
    
    console.log('=== FIM DEBUG DATABASE ===');
    
    res.json({
      message: 'Debug completed',
      connectionOk: true,
      userModel: !!User,
      consultantModel: !!Consultant,
      userFindByEmailExists: typeof User.findByEmail === 'function',
      consultantFindByEmailExists: typeof Consultant.findByEmail === 'function',
      userCount: userCount,
      consultantCount: consultantCount,
      sampleUsers: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        is_active: u.is_active
      })),
      sampleConsultants: consultants.map(c => ({
        id: c.id,
        email: c.email,
        name: c.name,
        is_active: c.is_active
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

// Login unificado - busca automaticamente em ambas as tabelas
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN UNIFICADO DEBUG ===');
    const { email, password, userType } = req.body;
    console.log('1. Dados recebidos:', { 
      email, 
      password: password ? '[HIDDEN]' : 'undefined',
      userType: userType || 'não especificado - busca automática'
    });
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = null;
    let foundUserType = null;

    // Se userType foi especificado, tentar buscar na tabela específica primeiro
    if (userType) {
      const Model = userType === 'consultant' ? Consultant : User;
      const modelName = userType === 'consultant' ? 'Consultant' : 'User';
      
      console.log(`2. UserType especificado: tentando buscar ${modelName} pelo email:`, cleanEmail);
      
      try {
        user = await Model.findByEmail(cleanEmail);
        if (user) {
          foundUserType = userType;
          console.log(`3. ${modelName} encontrado:`, {
            id: user.id,
            email: user.email,
            name: user.name,
            is_active: user.is_active
          });
        } else {
          console.log(`3. ${modelName} não encontrado para o email`);
        }
      } catch (err) {
        console.log(`3. ERRO ao buscar ${modelName}:`, err.message);
      }
    }

    // Se não encontrou na tabela específica ou userType não foi especificado,
    // buscar em ambas as tabelas
    if (!user) {
      console.log('4. Iniciando busca unificada em ambas as tabelas...');
      
      // Tentar na tabela User primeiro
      console.log('5. Tentando buscar na tabela User...');
      try {
        user = await User.findByEmail(cleanEmail);
        if (user) {
          foundUserType = 'user';
          console.log('6. Usuário encontrado na tabela User:', {
            id: user.id,
            email: user.email,
            name: user.name,
            is_active: user.is_active
          });
        } else {
          console.log('6. Usuário não encontrado na tabela User');
        }
      } catch (err) {
        console.log('6. ERRO ao buscar na tabela User:', err.message);
      }

      // Se não encontrou na tabela User, tentar na tabela Consultant
      if (!user) {
        console.log('7. Tentando buscar na tabela Consultant...');
        try {
          user = await Consultant.findByEmail(cleanEmail);
          if (user) {
            foundUserType = 'consultant';
            console.log('8. Consultor encontrado na tabela Consultant:', {
              id: user.id,
              email: user.email,
              name: user.name,
              is_active: user.is_active
            });
          } else {
            console.log('8. Consultor não encontrado na tabela Consultant');
          }
        } catch (err) {
          console.log('8. ERRO ao buscar na tabela Consultant:', err.message);
        }
      }
    }
    
    if (!user) {
      console.log('9. RESULTADO: Usuário não encontrado em nenhuma tabela');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`10. Usuário encontrado como ${foundUserType}`);

    if (!user.is_active) {
      console.log('11. ERRO: Conta está inativa');
      return res.status(401).json({ error: 'Account is inactive' });
    }

    console.log('12. Verificando senha...');
    const isPasswordValid = await user.checkPassword(password);
    console.log('13. Senha válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Atualizar último acesso na tabela correta
    const UpdateModel = foundUserType === 'consultant' ? Consultant : User;
    await UpdateModel.update(
      { last_access: new Date() },
      { where: { id: user.id } }
    );

    const tokenPayload = { 
      id: user.id,
      email: user.email,
      name: user.name,
      userType: foundUserType
    };
    
    console.log('14. Payload do token:', tokenPayload);
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '5d' });
    console.log('15. Token gerado:', token ? `${token.substring(0, 20)}...` : 'null');
    
    const response = { 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_active: user.is_active,
        userType: foundUserType
      }
    };
    
    console.log('16. Resposta do login:', { 
      ...response, 
      token: `${response.token.substring(0, 20)}...` 
    });
    console.log('=== FIM LOGIN UNIFICADO DEBUG ===\n');
    
    res.json(response);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Login específico para usuários (mantido para compatibilidade)
router.post('/login/user', async (req, res) => {
  console.log('Using specific user login - adding userType to request');
  req.body.userType = 'user';
  return router.handle(req, res);
});

// Login específico para consultores (mantido para compatibilidade)
router.post('/login/consultant', async (req, res) => {
  console.log('Using specific consultant login - adding userType to request');
  req.body.userType = 'consultant';
  return router.handle(req, res);
});

// Registro de usuários comuns
router.post('/register/user', async (req, res) => {
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

    // Verificar se email já existe em qualquer uma das tabelas
    const existingUser = await User.findByEmail(email);
    const existingConsultant = await Consultant.findByEmail(email);
    
    if (existingUser || existingConsultant) {
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
      userId: user.id,
      userType: 'user'
    });
  } catch (err) {
    console.error('User registration error:', err);
    
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
      error: 'Internal server error during user registration' 
    });
  }
});

// Registro de consultores
router.post('/register/consultant', async (req, res) => {
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

    // Verificar se email já existe em qualquer uma das tabelas
    const existingUser = await User.findByEmail(email);
    const existingConsultant = await Consultant.findByEmail(email);
    
    if (existingUser || existingConsultant) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const consultant = await Consultant.create({ 
      email: email.toLowerCase().trim(), 
      password: password.trim(), 
      name: name.trim() 
    });

    console.log('Consultant created successfully:', { id: consultant.id, email: consultant.email });

    res.status(201).json({ 
      message: 'Consultant created successfully', 
      consultantId: consultant.id,
      userType: 'consultant'
    });
  } catch (err) {
    console.error('Consultant registration error:', err);
    
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
      error: 'Internal server error during consultant registration' 
    });
  }
});

// Manter a rota de registro original para compatibilidade (registra como user)
router.post('/register', async (req, res) => {
  console.log('Using legacy /register route - redirecting to user registration');
  req.url = '/register/user';
  return router.handle(req, res);
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = { 
  router, authMiddleware, consultantOnly, userOnly 
};