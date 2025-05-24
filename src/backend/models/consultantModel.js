const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Consultant extends Model {
    static associate(models) {
      // Associações podem ser adicionadas aqui futuramente, se necessário
    }

    // Método para buscar consultor por ID
    static async findById(id, options = {}) {
      return await this.findByPk(id, options);
    }

    // Método para buscar consultor por email
    static async findByEmail(email, options = {}) {
      if (!email) return null;
      return await this.findOne({ 
        where: { email: email.toLowerCase().trim() }, 
        ...options 
      });
    }
  }

  Consultant.init({
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
    modelName: 'Consultant',
    tableName: 'consultant',
    timestamps: false,
    hooks: {
      beforeCreate: async (consultant) => {
        if (consultant.password && consultant.password.trim() !== '') {
          const isHashed = consultant.password.startsWith('$2a$') || consultant.password.startsWith('$2b$');
          if (!isHashed) {
            consultant.password = await bcrypt.hash(consultant.password, 10);
          }
        } else {
          throw new Error('Password is required and cannot be empty');
        }

        if (consultant.email) {
          consultant.email = consultant.email.toLowerCase().trim();
        }

        if (consultant.name) {
          consultant.name = consultant.name.trim();
        }
      },
      beforeUpdate: async (consultant) => {
        if (consultant.changed('password') && consultant.password && consultant.password.trim() !== '') {
          const isHashed = consultant.password.startsWith('$2a$') || consultant.password.startsWith('$2b$');
          if (!isHashed) {
            consultant.password = await bcrypt.hash(consultant.password, 10);
          }
        } else if (consultant.changed('password')) {
          throw new Error('Password cannot be empty when updated');
        }

        if (consultant.changed('email') && consultant.email) {
          consultant.email = consultant.email.toLowerCase().trim();
        }

        if (consultant.changed('name') && consultant.name) {
          consultant.name = consultant.name.trim();
        }
      },
    },
  });

  Consultant.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  return Consultant;
};
