const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      // Associações
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.Status, { foreignKey: 'status_id', as: 'status' });
    }
  }

  Document.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'status',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: false,
  });

  return Document;
};