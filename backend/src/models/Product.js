const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://via.placeholder.com/300'
  },
  category: {
    type: DataTypes.ENUM('salteñas', 'platos_fuertes', 'carnes', 'bebidas', 'postres', 'entradas', 'especiales'),
    allowNull: false,
    defaultValue: 'platos_fuertes'
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  descriptionEn: {
  type: DataTypes.STRING,
  allowNull: true
},
  
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Product;