const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    static associate(models) {
      // Associações
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Step.init({
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
    registration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100 // Assumindo que é uma porcentagem ou um valor entre 0-100
      }
    },
    documentation: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    structuring: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    drafting: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
  }, {
    sequelize,
    modelName: 'Step',
    tableName: 'steps',
    timestamps: false,
  });

  return Step;
};