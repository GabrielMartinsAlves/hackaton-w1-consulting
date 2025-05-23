const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associações com outros modelos
      this.hasMany(models.Contract, { foreignKey: 'user_id', as: 'contracts' });
      this.hasMany(models.Document, { foreignKey: 'user_id', as: 'documents' });
      this.hasOne(models.Step, { foreignKey: 'user_id', as: 'step' });
    }

    // Método para buscar usuário por ID
    static async findById(id, options = {}) {
      return await this.findByPk(id, options);
    }

    // Método para buscar usuário por email
    static async findByEmail(email, options = {}) {
      if (!email) return null;
      return await this.findOne({ 
        where: { email: email.toLowerCase().trim() }, 
        ...options 
      });
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
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Name must be between 2 and 100 characters'
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email already exists'
      },
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters long'
        }
      },
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
        if (user.password && user.password.trim() !== '') {
          // Verificar se a senha já não está hasheada
          const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
          if (!isHashed) {
            user.password = await bcrypt.hash(user.password, 10); // Aumentei de 8 para 10 rounds
          }
        } else {
          throw new Error('Password is required and cannot be empty');
        }
        
        // Normalizar email
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }
        
        // Normalizar nome
        if (user.name) {
          user.name = user.name.trim();
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password && user.password.trim() !== '') {
          // Verificar se a senha já não está hasheada
          const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
          if (!isHashed) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        } else if (user.changed('password')) {
          throw new Error('Password cannot be empty when updated');
        }
        
        // Normalizar email se alterado
        if (user.changed('email') && user.email) {
          user.email = user.email.toLowerCase().trim();
        }
        
        // Normalizar nome se alterado
        if (user.changed('name') && user.name) {
          user.name = user.name.trim();
        }
      },
    },
  });

  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};