// ============================================
// SERVIDOR PRINCIPAL - BOLIVIAN MARKET API
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de DB y modelos
const { testConnection } = require('./config/database');
const { syncModels } = require('./models');

// Crear aplicación Express
const app = express();

// Configurar CORS para desarrollo
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost',
  'http://localhost:80',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://food-app-by-ale.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para logs en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Ruta de prueba/health check MEJORADA
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    res.json({
      status: 'healthy',
      service: 'Bolivian Market API',
      environment: process.env.NODE_ENV || 'development',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      endpoints: {
        auth: '/api/auth/*',
        products: '/api/products/*',
        cart: '/api/cart/*',
        orders: '/api/orders/*',
        invites: '/api/invites/*'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a la API de Bolivian Market!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL + Sequelize',
    github: 'URL de tu repositorio'
  });
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));  
app.use('/api/invites', require('./routes/invitesRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/locales', require('./routes/localesRoutes'));

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    available_routes: ['/', '/api/health', '/api/auth/*', '/api/products/*', '/api/cart/*', '/api/orders/*']  // ← ACTUALIZADO
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  const statusCode = err.statusCode || 500;
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== INICIAR SERVIDOR ====================
const startServer = async () => {
  try {
    console.log('🔧 Iniciando Bolivian Market API...');
    
    // 1. Probar conexión a PostgreSQL
    console.log('🔗 Probando conexión a PostgreSQL...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('⚠️  ADVERTENCIA: PostgreSQL no está conectado');
      console.log('   Continuando en modo desarrollo sin DB...');
    } else {
      // 2. Sincronizar modelos (crear tablas)
      console.log('🔄 Sincronizando modelos de base de datos...');
      await syncModels();
    }

    // 3. Iniciar servidor
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`
      🚀 BOLIVIAN MARKET API INICIADA
      📍 Puerto: ${PORT}
      🌍 Entorno: ${process.env.NODE_ENV || 'development'}
      🗄️  Base de datos: ${dbConnected ? '✅ Conectada' : '❌ No conectada'}
      🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
      📡 Endpoints activos: /api/auth/*, /api/products/*, /api/cart/*, /api/orders/*  // ← ACTUALIZADO
      🕐 ${new Date().toLocaleString()}
      `);
      
      console.log('');
      console.log('🔍 PARA TESTEAR PRODUCTOS:');
      console.log('   curl http://localhost:5000/api/products');
      console.log('');
      console.log('🔍 PARA TESTEAR PEDIDOS:');
      console.log('   curl http://localhost:5000/api/orders \\');
      console.log('     -H "Authorization: Bearer [TOKEN]"');
      console.log('');
      console.log('🔍 PARA TESTEAR CARRITO:');
      console.log('   curl -X POST http://localhost:5000/api/cart/add \\');
      console.log('     -H "Authorization: Bearer [TOKEN]" \\');
      console.log('     -H "Content-Type: application/json" \\');
      console.log('     -d \'{"productId":"ID_DEL_PRODUCTO","quantity":1}\'');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error crítico iniciando servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor (omitir en tests)
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;