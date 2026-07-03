const User = require('./User');
const Product = require('./Product');
const { Order, OrderItem } = require('./Order');
const InviteCode = require('./InviteCode');
const { sequelize, Sequelize } = require('../config/database');



Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

Product.hasMany(OrderItem, {
  foreignKey: 'productId'
});

const syncModels = async () => {
  try {
    const force = false;
    
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


const createSuperAdmin = async () => {
  try {
    const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@bolivianmarket.com';
    const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'superadmin123';
    
    if (!superadminEmail || !superadminPassword) {
      console.error('❌ Variables de superadmin no configuradas');
      return;
    }

    const [user, created] = await User.findOrCreate({
      where: { email: superadminEmail },
      defaults: {
        name: 'Super Administrador',
        email: superadminEmail,
        password: superadminPassword,
        role: 'superadmin',
        phone: '+591 70000000',
        location: 'La Paz, Bolivia',
        avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=805AD5&color=fff'
      }
    });

    if (created) {
      console.log('✅ Superadmin creado:', superadminEmail);
    } else {
      console.log('✅ Superadmin ya existe:', superadminEmail);
    }
  } catch (error) {
    console.error('❌ Error creando superadmin:', error.message);
  }
};

const createSampleProducts = async () => {
  try {
    const productCount = await Product.count();
    
    const sampleProducts = [
      {
        name: 'Salteña Paceña',
        description: 'Deliciosa salteña tradicional paceña con jugoso relleno de carne, papa, arvejas y especias.',
        descriptionEn: 'Traditional La Paz salteña with juicy beef filling, potatoes, peas and spices.',
        price: 12.50,
        image: '/images/saltena.jpg',
        category: 'salteñas',
        stock: 50,
        featured: true,
        active: true
      },
      {
        name: 'Anticuchos',
        description: 'Brochetas de corazón de res marinadas en ají y especias, acompañadas de papas y salsa de maní.',
        descriptionEn: 'Beef heart skewers marinated in chili and spices, served with potatoes and peanut sauce.',
        price: 25.00,
        image: '/images/anticuchos.jpg',
        category: 'platos_fuertes',
        stock: 30,
        featured: true,
        active: true
      },
      {
        name: 'Sopa de Maní',
        description: 'Crema espesa de maní con papa, arroz y carne, acompañada de chuño phuti.',
        descriptionEn: 'Thick peanut cream soup with potato, rice and beef, served with chuño phuti.',
        price: 18.00,
        image: '/images/sopa-mani.jpg',
        category: 'platos_fuertes',
        stock: 25,
        featured: false,
        active: true
      },
      {
        name: 'Pique Macho',
        description: 'Trozos de carne, salchicha, papas fritas, cebolla, locoto y huevo, bañados en salsa de la casa.',
        descriptionEn: 'Beef pieces, sausage, french fries, onion, locoto and egg, bathed in house sauce.',
        price: 45.00,
        image: '/images/pique-macho.jpg',
        category: 'platos_fuertes',
        stock: 20,
        featured: true,
        active: true
      },
      {
        name: 'Silpancho Cochabambino',
        description: 'Arroz, papa dorada, carne empanizada, huevo frito, salsa criolla y ensalada.',
        descriptionEn: 'Rice, golden potatoes, breaded beef, fried egg, criollo sauce and salad.',
        price: 35.00,
        image: '/images/silpancho.jpg',
        category: 'platos_fuertes',
        stock: 25,
        featured: true,
        active: true
      },
      {
        name: 'Majadito',
        description: 'Arroz con carne desmenuzada, plátano frito, huevo y yuca, típico del oriente boliviano.',
        descriptionEn: 'Rice with shredded beef, fried plantain, egg and yucca, typical of eastern Bolivia.',
        price: 30.00,
        image: '/images/majadito.jpg',
        category: 'platos_fuertes',
        stock: 20,
        featured: false,
        active: true
      },
      {
        name: 'Api con Pastel',
        description: 'Bebida caliente de maíz morado acompañada de pastel de queso o empanada de queso.',
        descriptionEn: 'Hot purple corn drink served with cheese pastry or cheese empanada.',
        price: 15.00,
        image: '/images/api-pastel.jpg',
        category: 'bebidas',
        stock: 40,
        featured: true,
        active: true
      },
      {
        name: 'Mocochinchi',
        description: 'Refrescante bebida de durazno deshidratado, canela y clavo de olor.',
        descriptionEn: 'Refreshing dried peach drink with cinnamon and cloves.',
        price: 12.00,
        image: '/images/mocochinchi.jpg',
        category: 'bebidas',
        stock: 50,
        featured: false,
        active: true
      },
      {
        name: 'Humintas',
        description: 'Choclo rallado envuelto en sus propias hojas, relleno de queso y anís.',
        descriptionEn: 'Grated corn wrapped in corn husks, filled with cheese and anise.',
        price: 10.00,
        image: '/images/humintas.jpg',
        category: 'entradas',
        stock: 35,
        featured: true,
        active: true
      },
      {
        name: 'Cuñapé',
        description: 'Panecillos de queso y yuca, típicos del oriente boliviano, crujientes por fuera y suaves por dentro.',
        descriptionEn: 'Cheese and yucca bread rolls, typical of eastern Bolivia, crispy outside and soft inside.',
        price: 8.00,
        image: '/images/cunape.jpg',
        category: 'entradas',
        stock: 40,
        featured: false,
        active: true
      },
      {
        name: 'Leche Asada',
        description: 'Postre tradicional boliviano a base de leche, huevos, azúcar y canela, horneado a la perfección.',
        descriptionEn: 'Traditional Bolivian dessert made with milk, eggs, sugar and cinnamon, baked to perfection.',
        price: 15.00,
        image: '/images/leche-asada.jpg',
        category: 'postres',
        stock: 30,
        featured: false,
        active: true
      }
    ];
    
    if (productCount === 0) {
      console.log('📦 Creando productos de ejemplo...');
      await Product.bulkCreate(sampleProducts);
      console.log(`✅ ${sampleProducts.length} productos de ejemplo creados`);
    } else {
      console.log(`✅ Ya existen ${productCount} productos. Actualizando descriptionEn...`);
      for (const p of sampleProducts) {
        await Product.update(
          { descriptionEn: p.descriptionEn },
          { where: { name: p.name, descriptionEn: null } }
        );
      }
      console.log(`✅ ${sampleProducts.length} productos actualizados con descriptionEn`);
    }
  } catch (error) {
    console.error('❌ Error creando productos de ejemplo:', error.message);
  }
};

const checkExistingData = async () => {
  try {
    const userCount = await User.count();
    const productCount = await Product.count();
    const inviteCount = await InviteCode.count();
    
    console.log('📊 ESTADÍSTICAS DE BASE DE DATOS:');
    console.log(`   👤 Usuarios: ${userCount}`);
    console.log(`   📦 Productos: ${productCount}`);
    console.log(`   🔑 Invitaciones: ${inviteCount}`);
    console.log('====================================');
  } catch (error) {
    console.error('❌ Error verificando datos:', error);
  }
};

const safeReset = async () => {
  try {
    console.log('🔄 Iniciando reset seguro...');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas');
    
    await createSuperAdmin();
    await createSampleProducts();
    
    console.log('✅ Reset completado');
  } catch (error) {
    console.error('❌ Error en reset:', error);
  }
};

const startDatabase = async (options = {}) => {
  try {
    console.log('🔄 Iniciando base de datos...');
    
    if (options.safeReset) {
      await safeReset();
    } else {
      await syncModels();
    }
    
    await checkExistingData();
    
    return true;
  } catch (error) {
    console.error('❌ Error iniciando base de datos:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Order,
  OrderItem,
  InviteCode,
  syncModels,
  startDatabase,
  safeReset
};