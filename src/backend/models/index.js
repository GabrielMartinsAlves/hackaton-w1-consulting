const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('./config.js');  

const db = {};

// CORREÇÃO: Usar DATABASE_URL se disponível, senão usar configurações individuais
const sequelize = config.url 
  ? new Sequelize(config.url, {
      dialect: config.dialect,
      dialectOptions: config.dialectOptions,
      logging: config.logging,
      pool: config.pool,
      define: config.define
    })
  : new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      dialectOptions: config.dialectOptions,
      logging: config.logging,
      pool: config.pool,
      define: config.define
    });

const modelFiles = [
  'statusModel.js',
  'usersModel.js',
  'contractsModel.js',
  'documentsModel.js',
  'stepsModel.js',
  'leadsModel.js'
];

modelFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
});

// Configura as associações entre os modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;