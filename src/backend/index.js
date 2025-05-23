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
const contractsController = require('./controllers/contractsController');
const usersController = require('./controllers/usersController');
const documentsController = require('./controllers/documentsController');
const statusController = require('./controllers/statusController');
const stepsController = require('./controllers/stepsController');
const informationController = require('./controllers/informationController');
const { sendWhatsAppMessage } = require('./controllers/whatsappController');


app.use('/auth', authRoutes.router);
app.use('/contracts', contractsController.router);
app.use('/users', usersController.router);
app.use('/documents', documentsController.router);
app.use('/status', statusController.router);
app.use('/steps', stepsController.router);
app.use('/informations', informationController.router);
app.post('/send-whatsapp', sendWhatsAppMessage);

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

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


app.use(express.json());

const PORT = process.env.PORT || 9000;
app.listen(PORT, async () => {
  console.log(`Express started at http://localhost:${PORT}`);
  try {
    await db.sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    await db.sequelize.sync({ force: false });
    console.log('Modelos sincronizados com o banco de dados!');
  } catch (err) {
    console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
  }
});
