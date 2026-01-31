const { Order, OrderItem, Product } = require('../models');

// Carrito en memoria (simplificado - en producción usar Redis o DB)
const carts = new Map();

// ========== HELPERS ==========

// Obtener carrito de usuario
const getCart = (userId) => {
  if (!carts.has(userId)) {
    carts.set(userId, { items: [], updatedAt: new Date() });
  }
  return carts.get(userId);
};

// Guardar carrito
const saveCart = (userId, cart) => {
  cart.updatedAt = new Date();
  carts.set(userId, cart);
};

// Calcular total del carrito
const calculateCartTotal = (cart) => {
  return cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// ========== ENDPOINTS ==========

// 1. Añadir producto al carrito
const addToCart = async (req, res) => {
  try {
    const currentUser = req.user;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'productId es requerido'
      });
    }

    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    if (!product.active) {
      return res.status(400).json({
        success: false,
        error: 'Este producto no está disponible'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuficiente. Disponible: ${product.stock}`
      });
    }

    // Obtener carrito del usuario
    const cart = getCart(currentUser.id);
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Añadir nuevo item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        stock: product.stock
      });
    }

    // Guardar carrito
    saveCart(currentUser.id, cart);

    res.json({
      success: true,
      message: 'Producto añadido al carrito',
      cart: {
        items: cart.items,
        itemCount: cart.items.length,
        total: calculateCartTotal(cart),
        updatedAt: cart.updatedAt
      }
    });

  } catch (error) {
    console.error('Error añadiendo al carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al añadir al carrito'
    });
  }
};

// 2. Ver carrito actual
const getCartItems = async (req, res) => {
  try {
    const currentUser = req.user;
    const cart = getCart(currentUser.id);

    res.json({
      success: true,
      cart: {
        items: cart.items,
        itemCount: cart.items.length,
        total: calculateCartTotal(cart),
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener carrito'
    });
  }
};

// 3. Actualizar cantidad en carrito
const updateCartItem = async (req, res) => {
  try {
    const currentUser = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Cantidad inválida'
      });
    }

    const cart = getCart(currentUser.id);
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado en el carrito'
      });
    }

    // Verificar stock
    const product = await Product.findByPk(productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuficiente. Disponible: ${product.stock}`
      });
    }

    if (quantity === 0) {
      // Eliminar item
      cart.items.splice(itemIndex, 1);
    } else {
      // Actualizar cantidad
      cart.items[itemIndex].quantity = quantity;
    }

    saveCart(currentUser.id, cart);

    res.json({
      success: true,
      message: 'Carrito actualizado',
      cart: {
        items: cart.items,
        itemCount: cart.items.length,
        total: calculateCartTotal(cart),
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Error actualizando carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar carrito'
    });
  }
};

// 4. Eliminar item del carrito
const removeFromCart = async (req, res) => {
  try {
    const currentUser = req.user;
    const { productId } = req.params;

    const cart = getCart(currentUser.id);
    const initialLength = cart.items.length;
    
    // Filtrar para remover el item
    cart.items = cart.items.filter(item => item.productId !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado en el carrito'
      });
    }

    saveCart(currentUser.id, cart);

    res.json({
      success: true,
      message: 'Producto eliminado del carrito',
      cart: {
        items: cart.items,
        itemCount: cart.items.length,
        total: calculateCartTotal(cart),
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar del carrito'
    });
  }
};

// 5. Vaciar carrito
const clearCart = async (req, res) => {
  try {
    const currentUser = req.user;
    
    carts.delete(currentUser.id);

    res.json({
      success: true,
      message: 'Carrito vaciado'
    });
  } catch (error) {
    console.error('Error vaciando carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al vaciar carrito'
    });
  }
};

// 6. Crear pedido (checkout)
const checkout = async (req, res) => {
  try {
    const currentUser = req.user;
    const { shippingAddress, phone, notes } = req.body;

    const cart = getCart(currentUser.id);

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El carrito está vacío'
      });
    }

    // Verificar stock de todos los productos
    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Producto ${item.name} no encontrado`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${item.name}. Disponible: ${product.stock}`
        });
      }
    }

    // Calcular total
    const total = calculateCartTotal(cart);

    // Crear pedido en la base de datos
    const order = await Order.create({
      userId: currentUser.id,
      status: 'pendiente',
      total,
      shippingAddress: shippingAddress || currentUser.location,
      phone: phone || currentUser.phone,
      notes
    });

    // Crear items del pedido y actualizar stock
    for (const item of cart.items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });

      // Actualizar stock del producto
      const product = await Product.findByPk(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Vaciar carrito
    carts.delete(currentUser.id);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        items: cart.items,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Error en checkout:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar el pedido'
    });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout
};