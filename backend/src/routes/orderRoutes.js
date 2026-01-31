const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

// ========== RUTAS PARA USUARIOS AUTENTICADOS ==========

// 1. Historial de pedidos del usuario
router.get('/', authMiddleware, orderController.getUserOrders);

// 2. Detalle de un pedido específico
router.get('/:id', authMiddleware, orderController.getOrderById);

// 3. Crear nuevo pedido ← ¡AÑADIDO!
router.post('/create', authMiddleware, orderController.createOrder);

// ========== RUTAS PARA ADMINISTRADORES ==========

// 4. Obtener todos los pedidos (solo admin/superadmin)
router.get('/admin/all', authMiddleware, orderController.getAllOrders);

// 5. Actualizar estado de pedido (solo admin/superadmin)
router.put('/admin/:id/status', authMiddleware, orderController.updateOrderStatus);

// 6. Estadísticas de pedidos (solo admin/superadmin)
router.get('/admin/stats', authMiddleware, orderController.getOrderStats);

module.exports = router;