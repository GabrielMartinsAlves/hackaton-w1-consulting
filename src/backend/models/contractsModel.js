const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate(models) {
      // Associações
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.Status, { foreignKey: 'status_id', as: 'status' });
    }
  }

  Contract.init({
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
    contract: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'status',
        key: 'id',
      },
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Contract',
    tableName: 'contracts',
    timestamps: false,
  });

  return Contract;
};