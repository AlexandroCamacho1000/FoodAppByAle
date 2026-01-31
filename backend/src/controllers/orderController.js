// ========== IMPORTACIÓN CORRECTA ==========
const { Order, OrderItem } = require('../models/Order');  // ¡DIRECTAMENTE desde Order.js!
const db = require('../models');
const { Product, User, sequelize } = db;
const { Op } = require('sequelize');

// ========== FUNCIONES PARA USUARIOS ==========

// 1. Obtener historial de pedidos del usuario actual
const getUserOrders = async (req, res) => {
  try {
    const currentUser = req.user;
    console.log('🔄 Buscando pedidos para usuario:', currentUser.id);
    
    // PRIMERO: Obtener solo los pedidos básicos
    const orders = await Order.findAll({
      where: { userId: currentUser.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('✅ Pedidos encontrados:', orders.length);
    
    if (orders.length === 0) {
      return res.json({
        success: true,
        count: 0,
        total: 0,
        page: 1,
        totalPages: 0,
        orders: []
      });
    }
    
    // SEGUNDO: Para cada pedido, obtener sus items
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderData = order.toJSON();
        
        // Obtener items de ESTE pedido
        const orderItems = await OrderItem.findAll({
          where: { orderId: order.id },
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'image', 'description', 'category']
          }]
        });
        
        // Formatear items
        orderData.items = orderItems.map(item => {
          const itemData = item.toJSON();
          
          if (itemData.product) {
            itemData.productName = itemData.product.name;
            itemData.productImage = itemData.product.image;
            itemData.productDescription = itemData.product.description;
            itemData.productCategory = itemData.product.category;
            delete itemData.product;
          }
          
          itemData.subtotal = itemData.quantity * itemData.price;
          return itemData;
        });
        
        return orderData;
      })
    );
    
    res.json({
      success: true,
      count: ordersWithDetails.length,
      total: ordersWithDetails.length,
      page: 1,
      totalPages: 1,
      orders: ordersWithDetails
    });
    
  } catch (error) {
    console.error('❌ ERROR en getUserOrders:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Error al obtener pedidos: ' + error.message
    });
  }
};

// 2. Obtener detalle de un pedido específico
const getOrderById = async (req, res) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;
    
    console.log('🔍 Buscando pedido:', id, 'para usuario:', currentUser.id);
    
    // Buscar pedido básico
    const order = await Order.findOne({
      where: { 
        id,
        userId: currentUser.id 
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado o no autorizado'
      });
    }
    
    // Obtener items del pedido
    const orderItems = await OrderItem.findAll({
      where: { orderId: id },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'image', 'description', 'category']
      }]
    });
    
    // Obtener info del usuario
    const user = await User.findByPk(currentUser.id, {
      attributes: ['id', 'name', 'email', 'phone']
    });
    
    // Formatear respuesta
    const orderJSON = order.toJSON();
    orderJSON.user = user ? user.toJSON() : null;
    
    // Formatear items
    orderJSON.items = orderItems.map(item => {
      const itemData = item.toJSON();
      
      if (itemData.product) {
        itemData.productName = itemData.product.name;
        itemData.productImage = itemData.product.image;
        itemData.productDescription = itemData.product.description;
        itemData.productCategory = itemData.product.category;
        delete itemData.product;
      }
      
      itemData.subtotal = itemData.quantity * itemData.price;
      return itemData;
    });
    
    res.json({
      success: true,
      order: orderJSON
    });
  } catch (error) {
    console.error('❌ Error obteniendo pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener pedido: ' + error.message
    });
  }
};

// 3. Crear nuevo pedido
const createOrder = async (req, res) => {
  try {
    const currentUser = req.user;
    const { items, shippingAddress, phone, notes } = req.body;
    
    console.log('🛒 Creando pedido para usuario:', currentUser.id);
    
    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El pedido debe contener al menos un item'
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'La dirección de envío es requerida'
      });
    }
    
    // Usar transacción para atomicidad
    const transaction = await sequelize.transaction();
    
    try {
      // 1. Crear el pedido
      const order = await Order.create({
        userId: currentUser.id,
        status: 'pendiente',
        total: 0,
        shippingAddress,
        phone: phone || null,
        notes: notes || null
      }, { transaction });
      
      let orderTotal = 0;
      const orderItemsDetails = [];
      
      // 2. Procesar cada item
      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });
        
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para: ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
        }
        
        // Reducir stock
        product.stock -= item.quantity;
        await product.save({ transaction });
        
        // Crear OrderItem
        const orderItem = await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        }, { transaction });
        
        // Calcular subtotal
        const subtotal = item.quantity * product.price;
        orderTotal += subtotal;
        
        orderItemsDetails.push({
          ...orderItem.toJSON(),
          productName: product.name,
          productImage: product.image,
          productDescription: product.description,
          productCategory: product.category,
          subtotal
        });
      }
      
      // 3. Actualizar total del pedido
      order.total = orderTotal;
      await order.save({ transaction });
      
      // 4. Confirmar transacción
      await transaction.commit();
      
      console.log('✅ Pedido creado:', order.id, 'Total:', orderTotal);
      
      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        order: {
          ...order.toJSON(),
          items: orderItemsDetails
        }
      });
      
    } catch (error) {
      // Rollback en caso de error
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Error creando pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear pedido: ' + error.message
    });
  }
};

// ========== FUNCIONES PARA ADMINISTRADORES ==========

// 4. Obtener todos los pedidos (solo admin/superadmin)
const getAllOrders = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Verificar permisos
    if (!['admin', 'superadmin'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden ver todos los pedidos'
      });
    }
    
    const { status, userId, limit = 20, page = 1 } = req.query;
    
    // Construir filtros
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    const offset = (page - 1) * limit;
    
    // Obtener pedidos con paginación
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Para cada pedido, obtener usuario e items
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderData = order.toJSON();
        
        // Obtener usuario
        const user = await User.findByPk(orderData.userId, {
          attributes: ['id', 'name', 'email', 'phone']
        });
        
        if (user) {
          orderData.user = user.toJSON();
        }
        
        // Obtener items
        const orderItems = await OrderItem.findAll({
          where: { orderId: orderData.id },
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'image']
          }]
        });
        
        // Formatear items
        orderData.items = orderItems.map(item => {
          const itemData = item.toJSON();
          
          if (itemData.product) {
            itemData.productName = itemData.product.name;
            itemData.productImage = itemData.product.image;
            delete itemData.product;
          }
          
          itemData.subtotal = itemData.quantity * itemData.price;
          return itemData;
        });
        
        return orderData;
      })
    );
    
    res.json({
      success: true,
      count: ordersWithDetails.length,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      orders: ordersWithDetails
    });
  } catch (error) {
    console.error('❌ Error obteniendo todos los pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener pedidos: ' + error.message
    });
  }
};

// 5. Actualizar estado de un pedido (solo admin/superadmin)
const updateOrderStatus = async (req, res) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;
    const { status } = req.body;
    
    // Verificar permisos
    if (!['admin', 'superadmin'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden actualizar estados de pedidos'
      });
    }
    
    // Validar nuevo estado
    const validStatuses = ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado inválido',
        validStatuses
      });
    }
    
    // Buscar pedido
    const order = await Order.findByPk(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }
    
    // Obtener usuario para la respuesta
    const user = await User.findByPk(order.userId, {
      attributes: ['name', 'email']
    });
    
    // Guardar estado anterior
    const previousStatus = order.status;
    
    // Actualizar estado
    order.status = status;
    await order.save();
    
    // Formatear respuesta
    const orderJSON = order.toJSON();
    if (user) {
      orderJSON.user = user.toJSON();
    }
    
    res.json({
      success: true,
      message: `Estado del pedido actualizado de "${previousStatus}" a "${status}"`,
      order: orderJSON
    });
  } catch (error) {
    console.error('❌ Error actualizando estado del pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar estado del pedido: ' + error.message
    });
  }
};

// 6. Obtener estadísticas de pedidos (admin/superadmin)
const getOrderStats = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Verificar permisos
    if (!['admin', 'superadmin'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden ver estadísticas'
      });
    }
    
    // Estadísticas básicas
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total') || 0;
    
    // Pedidos por estado
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total']
      ],
      group: ['status']
    });
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue),
        byStatus: ordersByStatus.map(item => ({
          status: item.status,
          count: parseInt(item.get('count')),
          total: parseFloat(item.get('total') || 0)
        }))
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas: ' + error.message
    });
  }
};

// ========== EXPORTAR TODAS LAS FUNCIONES ==========
module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,      // ← ¡AHORA SÍ ESTÁ INCLUIDA!
  getAllOrders,
  updateOrderStatus,
  getOrderStats
};