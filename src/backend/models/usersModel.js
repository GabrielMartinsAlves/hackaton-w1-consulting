const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Contract, { foreignKey: 'user_id', as: 'contracts' });
      this.hasMany(models.Document, { foreignKey: 'user_id', as: 'documents' });
      this.hasOne(models.Step, { foreignKey: 'user_id', as: 'step' });
    }

    // Método para buscar usuário por ID
    static async findById(id) {
      return await this.findByPk(id);
    }

    // Método para buscar usuário por email
    static async findByEmail(email) {
      return await this.findOne({ where: { email } });
    }

    // Método para criar um novo usuário
    static async create(userData) {
      return await this.create(userData);
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_access: {
      type: DataTypes.DATE,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 8);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 8);
        }
      },
    },
  });

  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};