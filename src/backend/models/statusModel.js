const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      // Associações
      this.hasMany(models.Contract, { foreignKey: 'status_id', as: 'contracts' });
      this.hasMany(models.Document, { foreignKey: 'status_id', as: 'documents' });
    }
  }

  Status.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Status',
    tableName: 'status',
    timestamps: false,
  });

  return Status;
};