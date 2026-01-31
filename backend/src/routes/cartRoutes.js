const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

// ========== RUTAS DEL CARRITO (solo usuarios autenticados) ==========

// 1. Añadir producto al carrito
router.post('/add', authMiddleware, cartController.addToCart);

// 2. Ver carrito actual
router.get('/', authMiddleware, cartController.getCartItems);

// 3. Actualizar cantidad de un item
router.put('/item/:productId', authMiddleware, cartController.updateCartItem);

// 4. Eliminar item del carrito
router.delete('/item/:productId', authMiddleware, cartController.removeFromCart);

// 5. Vaciar carrito completo
router.delete('/clear', authMiddleware, cartController.clearCart);

// 6. Crear pedido (checkout)
router.post('/checkout', authMiddleware, cartController.checkout);

module.exports = router;