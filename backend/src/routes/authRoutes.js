const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Validaciones
const registerValidation = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// ========== RUTAS PÚBLICAS ==========
router.post('/login', loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);

// ========== RUTAS PROTEGIDAS (cualquier usuario autenticado) ==========
router.get('/me', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

// ========== RUTAS ADMINISTRATIVAS (solo admin/superadmin) ==========
// 1. Listar todos los usuarios (solo superadmin)
router.get('/users', authMiddleware, authController.getAllUsers);

// 2. Cambiar rol de usuario (solo superadmin)
router.put('/users/:id/role', authMiddleware, authController.changeUserRole);

// 3. Eliminar usuario (solo superadmin)
router.delete('/users/:id', authMiddleware, authController.deleteUser);

module.exports = router;