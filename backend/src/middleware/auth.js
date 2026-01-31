const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 1. Verificar token JWT
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token no proporcionado' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expirado' 
      });
    }
    res.status(401).json({ 
      success: false, 
      error: 'Error de autenticación' 
    });
  }
};

// 2. Verificar rol admin
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      error: 'Requiere rol de administrador' 
    });
  }
};

// 3. Verificar rol superadmin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      error: 'Requiere rol de superadministrador' 
    });
  }
};

module.exports = { authMiddleware, isAdmin, isSuperAdmin };