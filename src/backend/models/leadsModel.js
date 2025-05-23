const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {

    static async findById(id, options = {}) {
      return await this.findByPk(id, options);
    }

    static async findByEmail(email, options = {}) {
      if (!email) return null;
      return await this.findOne({
        where: { email: email.toLowerCase().trim() },
        ...options,
      });
    }
  }

  Lead.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
        notEmpty: {
          msg: 'Email cannot be empty',
        },
      },
    },
    property_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: 'Property value must be a decimal number',
        },
        min: {
          args: [0],
          msg: 'Property value cannot be negative',
        },
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000], // limite arbitrário para observações
          msg: 'Notes cannot exceed 1000 characters',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Lead',
    tableName: 'leads',
    timestamps: false,
    hooks: {
      beforeCreate: (lead) => {
        if (lead.email) {
          lead.email = lead.email.toLowerCase().trim();
        }
        if (lead.notes) {
          lead.notes = lead.notes.trim();
        }
      },
      beforeUpdate: (lead) => {
        if (lead.changed('email') && lead.email) {
          lead.email = lead.email.toLowerCase().trim();
        }
        if (lead.changed('notes') && lead.notes) {
          lead.notes = lead.notes.trim();
        }
      },
    },
  });

  return Lead;
};