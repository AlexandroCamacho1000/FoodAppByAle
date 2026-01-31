const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/auth');

// ========== RUTAS PÚBLICAS (sin autenticación) ==========
router.get('/', productController.getAllProducts); // Listar todos con filtros
router.get('/featured', productController.getFeaturedProducts); // Destacados
router.get('/category/:category', productController.getProductsByCategory); // Por categoría
router.get('/:id', productController.getProductById); // Detalle por ID

// ========== RUTAS PROTEGIDAS (solo admin/superadmin) ==========
router.post('/', authMiddleware, productController.createProduct); // Crear
router.put('/:id', authMiddleware, productController.updateProduct); // Actualizar
router.delete('/:id', authMiddleware, productController.deleteProduct); // Eliminar

module.exports = router;