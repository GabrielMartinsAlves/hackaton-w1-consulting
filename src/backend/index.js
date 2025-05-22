const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./models');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const authRoutes = require('./controllers/authController');
const { authMiddleware } = require('./controllers/authController');

app.use('/auth', authRoutes.router);

app.get('/', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

app.get('/db-test', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ message: 'Conexão com o banco de dados estabelecida com sucesso!' });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    res.status(500).json({ 
      message: 'Erro ao conectar com o banco de dados', 
      error: error.message 
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Express started at http://localhost:${PORT}`);
  
  try {
    await db.sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    // Sincroniza os modelos com o banco de dados (cria as tabelas se não existirem)
    await db.sequelize.sync({ force: false }); // Use force: true apenas para testes (recria as tabelas)
    console.log('Modelos sincronizados com o banco de dados!');
  } catch (err) {
    console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
  }
});