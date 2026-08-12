const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

if (process.env.DATABASE_URL) {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: isProduction ? false : console.log,
    dialectOptions: {
      ssl: isProduction && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('database') ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  // Función para probar conexión
  const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL conectado');
      return true;
    } catch (error) {
      console.error('Error conectando a PostgreSQL:', error.message);
      console.error('Verifica que PostgreSQL esté corriendo y que DATABASE_URL sea correcto.');
      return false;
    }
  };

  module.exports = { sequelize, testConnection };
} else {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });

  const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('SQLite conectado');
      return true;
    } catch (error) {
      console.error('Error conectando a SQLite:', error.message);
      return false;
    }
  };

  module.exports = { sequelize, testConnection };
}