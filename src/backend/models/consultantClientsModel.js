const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConsultantClient extends Model {
    static associate(models) {
      // Define associations
      this.belongsTo(models.Consultant, { foreignKey: 'consultant_id', as: 'consultant' });
      this.belongsTo(models.User, { foreignKey: 'client_id', as: 'client' });
    }
  }

  ConsultantClient.init({
    consultant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Added due to composite primary key
      references: {
        model: 'consultant',
        key: 'id'
      }
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Added due to composite primary key
      references: {
        model: 'users', // Corrected to reference the users table
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ConsultantClient',
    tableName: 'consultant_clients',
    timestamps: false
  });

  return ConsultantClient;
};