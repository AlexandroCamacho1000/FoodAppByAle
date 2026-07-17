const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

console.log('🔧 Configurando PostgreSQL...');
console.log('   Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');

// Conexión a PostgreSQL REAL
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
    console.log('✅ PostgreSQL conectado exitosamente');
    
    // Mostrar info de conexión (sin contraseña)
    const url = new URL(process.env.DATABASE_URL);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Database: ${url.pathname.replace('/', '')}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    console.log('');
    console.log('💡 SOLUCIÓN:');
    console.log('   1. Verifica que PostgreSQL esté corriendo');
    console.log('   2. psql -U postgres (para probar conexión)');
    console.log('   3. CREATE DATABASE bolivianmarket_dev;');
    console.log('   4. Revisa DATABASE_URL en .env');
    
    return false;
  }
};

module.exports = { sequelize, testConnection };