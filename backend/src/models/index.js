const User = require('./User');
const Product = require('./Product');
const { Order, OrderItem } = require('./Order');
const InviteCode = require('./InviteCode');
const { sequelize, Sequelize } = require('../config/database');

// ==================== RELACIONES ENTRE MODELOS ====================
// ¡ESTO ES LO QUE FALTABA!

// 1. Order <-> OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});

// 2. OrderItem <-> Product (¡CRÍTICO PARA EL ERROR!)
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'  // Alias 'product' para los includes
});

Product.hasMany(OrderItem, {
  foreignKey: 'productId'
});

// 3. Order <-> User
Order.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasMany(Order, {
  foreignKey: 'userId'
});

// ==================== SINCRONIZACIÓN SEGURA ====================
const syncModels = async () => {
  try {
    const force = false;  // NO borrar datos
    
    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ force });
    
    if (force) {
      console.warn('⚠️  ¡ADVERTENCIA! Se usó force:true - Todos los datos fueron borrados');
    } else {
      console.log('✅ Modelos sincronizados (sin borrar datos)');
    }
    
    await createSuperAdmin();
    await createSampleProducts();
    
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando modelos:', error);
    return false;
  }
};

// ==================== CREAR SUPERADMIN ====================
const createSuperAdmin = async () => {
  try {
    const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@bolivianmarket.com';
    const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'superadmin123';
    
    if (!superadminEmail || !superadminPassword) {
      console.log('⚠️  Credenciales de superadmin no configuradas en .env');
      return;
    }
    
    const existingSuperadmin = await User.findOne({ 
      where: { email: superadminEmail } 
    });
    
    if (!existingSuperadmin) {
      await User.create({
        name: 'Super Administrador',
        email: superadminEmail,
        password: superadminPassword,
        role: 'superadmin',
        avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=805AD5&color=fff',
        location: 'La Paz, Bolivia',
        phone: '+591 0000000'
      });
      console.log('✅ Superadmin creado automáticamente');
      console.log(`   Email: ${superadminEmail}`);
      console.log(`   Password: ${superadminPassword}`);
    } else {
      console.log('✅ Superadmin ya existe en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error creando superadmin:', error.message);
  }
};

// ==================== CREAR PRODUCTOS DE EJEMPLO ====================
const createSampleProducts = async () => {
  try {
    const productCount = await Product.count();
    
    if (productCount === 0) {
      console.log('📦 Creando productos de ejemplo...');
      
      const sampleProducts = [
        {
          name: 'Salteña Paceña',
          description: 'Deliciosa salteña tradicional paceña con jugoso relleno de carne, papa, arvejas y especias.',
          price: 12.50,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          category: 'salteñas',
          stock: 50,
          featured: true,
          active: true
        },
        {
          name: 'Anticuchos',
          description: 'Brochetas de corazón de res marinadas en ají y especias, acompañadas de papas y salsa de maní.',
          price: 25.00,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
          category: 'platos_fuertes',
          stock: 30,
          featured: true,
          active: true
        },
        {
          name: 'Sopa de Maní',
          description: 'Crema espesa de maní con papa, arroz y carne, acompañada de chuño phuti.',
          price: 18.00,
          image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400',
          category: 'platos_fuertes',
          stock: 25,
          featured: false,
          active: true
        }
      ];
      
      await Product.bulkCreate(sampleProducts);
      console.log(`✅ ${sampleProducts.length} productos de ejemplo creados`);
    } else {
      console.log(`✅ Ya existen ${productCount} productos en la base de datos`);
    }
  } catch (error) {
    console.error('❌ Error creando productos de ejemplo:', error.message);
  }
};

// ==================== VERIFICAR DATOS EXISTENTES ====================
const checkExistingData = async () => {
  try {
    const userCount = await User.count();
    const productCount = await Product.count();
    
    console.log('📊 Datos actuales en la base de datos:');
    console.log(`   👥 Usuarios: ${userCount}`);
    console.log(`   🛒 Productos: ${productCount}`);
    
    return { userCount, productCount };
  } catch (error) {
    console.error('❌ Error verificando datos:', error);
    return { userCount: 0, productCount: 0 };
  }
};

// ==================== RESET SEGURO (solo para desarrollo) ====================
const safeReset = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ NO se puede resetear en producción');
    return false;
  }
  
  console.warn('⚠️  ¡ADVERTENCIA! Esto borrará TODOS los datos');
  console.log('   Ejecutando reset seguro...');
  
  await sequelize.sync({ force: true });
  
  await createSuperAdmin();
  await createSampleProducts();
  
  console.log('✅ Reset completo - Base de datos reiniciada');
  return true;
};

// ==================== OBJETO DB COMPLETO ====================
const db = {
  sequelize,
  Sequelize,
  User,
  Product,
  Order,
  OrderItem,
  InviteCode
};

// ==================== EXPORTAR ====================
module.exports = {
  ...db,
  syncModels,
  checkExistingData,
  safeReset
};