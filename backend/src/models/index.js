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
    const sampleProducts = [
      // === SALTEÑAS ===
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
        name: 'Salteña de Pollo',
        description: 'Salteña jugosa rellena de pollo, papa, arvejas y huevo duro, horneada a la perfección.',
        descriptionEn: 'Juicy salteña filled with chicken, potatoes, peas and hard-boiled egg, baked to perfection.',
        price: 13.00,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop',
        category: 'salteñas',
        stock: 45,
        featured: false,
        active: true
      },
      {
        name: 'Salteña de Queso',
        description: 'Salteña vegetariana con queso derretido, papa y especias, ideal para cualquier momento.',
        descriptionEn: 'Vegetarian salteña with melted cheese, potato and spices, perfect anytime.',
        price: 11.00,
        image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&h=400&fit=crop',
        category: 'salteñas',
        stock: 40,
        featured: false,
        active: true
      },
      // === PLATOS FUERTES ===
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
        name: 'Chicharrón de Cerdo',
        description: 'Cerdo frito crujiente acompañado de mote, papa y ensalada de cebolla, típico cochabambino.',
        descriptionEn: 'Crispy fried pork served with hominy, potato and onion salad, typical from Cochabamba.',
        price: 40.00,
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chicharrones_Cerdo_Salamanca_02.jpg?width=400',
        category: 'platos_fuertes',
        stock: 20,
        featured: true,
        active: true
      },
      {
        name: 'Picante de Pollo',
        description: 'Pollo cocido en salsa picante de ají amarillo, papa y arroz, un clásico de la cocina boliviana.',
        descriptionEn: 'Chicken cooked in spicy yellow chili sauce, potato and rice, a Bolivian classic.',
        price: 32.00,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=400&fit=crop',
        category: 'platos_fuertes',
        stock: 25,
        featured: false,
        active: true
      },
      {
        name: 'Falso Conejo',
        description: 'Carne de res molida empanizada con arroz, papa, huevo y ensalada, típico de La Paz.',
        descriptionEn: 'Breaded ground beef served with rice, potato, egg and salad, typical from La Paz.',
        price: 28.00,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
        category: 'platos_fuertes',
        stock: 20,
        featured: false,
        active: true
      },
      // === CARNES ===
      {
        name: 'Churrasco a la Piedra',
        description: 'Filete de res cocido en piedra caliente, servido con papas fritas y ensalada fresca.',
        descriptionEn: 'Beef fillet cooked on hot stone, served with french fries and fresh salad.',
        price: 55.00,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop',
        category: 'carnes',
        stock: 15,
        featured: true,
        active: true
      },
      {
        name: 'Lomo Montado',
        description: 'Lomo de res con arroz, papa frita, plátano frito, huevo y ensalada, un plato completo.',
        descriptionEn: 'Beef loin with rice, french fries, fried plantain, egg and salad, a complete dish.',
        price: 50.00,
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop',
        category: 'carnes',
        stock: 18,
        featured: true,
        active: true
      },
      {
        name: 'Parrillada Boliviana',
        description: 'Selección de carnes a la parrilla: chorizo, churrasco, pollo y costilla, con guarniciones.',
        descriptionEn: 'Grilled meat selection: sausage, beef steak, chicken and ribs, with sides.',
        price: 75.00,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
        category: 'carnes',
        stock: 10,
        featured: true,
        active: true
      },
      {
        name: 'Asado de Tira',
        description: 'Costillas de res a la parrilla, marinadas en especias y cerveza, con chimichurri.',
        descriptionEn: 'Grilled beef ribs, marinated in spices and beer, served with chimichurri.',
        price: 60.00,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
        category: 'carnes',
        stock: 12,
        featured: false,
        active: true
      },
      // === BEBIDAS ===
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
        name: 'Café de Altura Boliviano',
        description: 'Café orgánico de los Yungas de La Paz, tueste medio, aroma intenso y sabor equilibrado.',
        descriptionEn: 'Organic coffee from the Yungas of La Paz, medium roast, intense aroma and balanced flavor.',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
        category: 'bebidas',
        stock: 60,
        featured: true,
        active: true
      },
      {
        name: 'Mate de Coca',
        description: 'Infusión tradicional de hojas de coca, reconfortante y digestiva, ideal después de la comida.',
        descriptionEn: 'Traditional coca leaf infusion, comforting and digestive, ideal after meals.',
        price: 8.00,
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop',
        category: 'bebidas',
        stock: 70,
        featured: false,
        active: true
      },
      {
        name: 'Refresco de Tamarindo',
        description: 'Refrescante bebida natural de tamarindo, dulce y ácida, perfecta para el calor.',
        descriptionEn: 'Refreshing natural tamarind drink, sweet and sour, perfect for hot weather.',
        price: 10.00,
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tamarind_drink_in_plastic.jpg?width=400',
        category: 'bebidas',
        stock: 60,
        featured: false,
        active: true
      },
      // === ENTRADAS ===
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
        name: 'Sopa de Quinoa',
        description: 'Sopa nutritiva de quinoa con verduras frescas, papa y hierbas aromáticas.',
        descriptionEn: 'Nutritious quinoa soup with fresh vegetables, potato and aromatic herbs.',
        price: 16.00,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop',
        category: 'entradas',
        stock: 30,
        featured: false,
        active: true
      },
      {
        name: 'Choclo con Queso',
        description: 'Mazorca de maíz tierno hervido, acompañada de queso fresco y ají picante opcional.',
        descriptionEn: 'Boiled tender corn on the cob, served with fresh cheese and optional spicy chili.',
        price: 14.00,
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop',
        category: 'entradas',
        stock: 35,
        featured: false,
        active: true
      },
      {
        name: 'Papas Rellenas',
        description: 'Papas rellenas de carne molida, huevo y especias, fritas hasta dorar, con salsa de la casa.',
        descriptionEn: 'Potatoes stuffed with ground beef, egg and spices, fried until golden, with house sauce.',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop',
        category: 'entradas',
        stock: 30,
        featured: false,
        active: true
      },
      // === POSTRES ===
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
      },
      {
        name: 'Arroz con Leche',
        description: 'Arroz cocido lentamente en leche con canela, pasas y cáscara de naranja, servido frío o caliente.',
        descriptionEn: 'Rice slowly cooked in milk with cinnamon, raisins and orange peel, served cold or hot.',
        price: 14.00,
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arroz_con_leche.jpg?width=400',
        category: 'postres',
        stock: 35,
        featured: false,
        active: true
      },
      {
        name: 'Mazamorra de Manzana',
        description: 'Postre espeso de manzana con canela y clavo, adornado con pasas y canela espolvoreada.',
        descriptionEn: 'Thick apple dessert with cinnamon and cloves, topped with raisins and sprinkled cinnamon.',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
        category: 'postres',
        stock: 30,
        featured: false,
        active: true
      },
      {
        name: 'Helado de Canela',
        description: 'Helado artesanal de canela boliviana, cremoso y aromático, perfecto para el clima cálido.',
        descriptionEn: 'Artisanal Bolivian cinnamon ice cream, creamy and aromatic, perfect for warm weather.',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=400&fit=crop',
        category: 'postres',
        stock: 40,
        featured: true,
        active: true
      },
      // === ESPECIALES ===
      {
        name: 'Plato Paceño',
        description: 'Clásico plato de La Paz con choclo, habas, papa, queso y llajwa, servido con carne opcional.',
        descriptionEn: 'Classic La Paz dish with corn, fava beans, potato, cheese and llajwa, optional meat.',
        price: 38.00,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
        category: 'especiales',
        stock: 15,
        featured: true,
        active: true
      },
      {
        name: 'Calapurca',
        description: 'Sopa espesa de maíz molido con carne de res, papa, cebolla y hierbabuena, típica de Potosí.',
        descriptionEn: 'Thick ground corn soup with beef, potato, onion and mint, typical from Potosí.',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop',
        category: 'especiales',
        stock: 20,
        featured: false,
        active: true
      },
      {
        name: 'Lawa de Maíz',
        description: 'Sopa prehispánica de maíz molido con carne, ají y hierbas, tradición milenaria boliviana.',
        descriptionEn: 'Pre-Hispanic ground corn soup with meat, chili and herbs, ancient Bolivian tradition.',
        price: 22.00,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop',
        category: 'especiales',
        stock: 20,
        featured: false,
        active: true
      },
      {
        name: 'Charque de Llama',
        description: 'Carne de llama deshidratada y rehidratada, guisada con papa, mote y ají, herencia andina.',
        descriptionEn: 'Dehydrated and rehydrated llama meat, stewed with potato, hominy and chili, Andean heritage.',
        price: 42.00,
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Charque.jpg?width=400',
        category: 'especiales',
        stock: 12,
        featured: true,
        active: true
      }
    ];

    const productCount = await Product.count();
    
    if (productCount === 0) {
      console.log('📦 Creando todos los productos de ejemplo...');
      await Product.bulkCreate(sampleProducts);
      console.log(`✅ ${sampleProducts.length} productos creados`);
    } else {
      console.log(`✅ Ya existen ${productCount} productos. Añadiendo nuevos si faltan...`);
      let added = 0;
      for (const p of sampleProducts) {
        const existing = await Product.findOne({ where: { name: p.name } });
        if (!existing) {
          await Product.create(p);
          added++;
        } else if (!existing.descriptionEn && p.descriptionEn) {
          await existing.update({ descriptionEn: p.descriptionEn });
        }
      }
      console.log(`✅ ${added} nuevos productos añadidos (${sampleProducts.length} total en catalogo)`);
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