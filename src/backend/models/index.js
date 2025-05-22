const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('./config.js');  

const db = {};
const sequelize = new Sequelize(config.url, config);

const modelFiles = [
  'statusModel.js',
  'usersModel.js',
  'contractsModel.js',
  'documentsModel.js',
  'stepsModel.js'
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