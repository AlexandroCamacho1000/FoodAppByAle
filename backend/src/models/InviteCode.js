const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InviteCode = sequelize.define('InviteCode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('active', 'used', 'expired'),
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usedAt: {
    type: DataTypes.DATE
  },
  usedBy: {
    type: DataTypes.UUID
  }
}, {
  timestamps: true
});

module.exports = InviteCode;