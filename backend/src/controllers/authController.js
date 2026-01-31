const jwt = require('jsonwebtoken');
const { User, InviteCode } = require('../models');
const { validationResult } = require('express-validator');

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRE || '7d' 
  });
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user.id);
    
    // Preparar respuesta sin password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      user: userResponse,
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Registro de usuario
const register = async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;
    
    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y contraseña son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }

    // Determinar rol (user por defecto, admin si tiene código válido)
    let role = 'user';
    
    if (inviteCode) {
      const invite = await InviteCode.findOne({ 
        where: { 
          code: inviteCode.toUpperCase(),
          status: 'active'
        }
      });
      
      if (invite && new Date(invite.expiresAt) > new Date()) {
        role = 'admin';
        // Marcar código como usado
        invite.status = 'used';
        invite.usedAt = new Date();
        await invite.save();
      }
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${role === 'admin' ? '805AD5' : '0BC5EA'}&color=fff`
    });

    // Generar token
    const token = generateToken(user.id);
    
    // Preparar respuesta
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
      message: role === 'admin' 
        ? '¡Registro exitoso como administrador!' 
        : '¡Registro exitoso!'
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar perfil
const updateProfile = async (req, res) => {
  try {
    const { name, location, phone } = req.body;
    const user = req.user;
    
    // Actualizar campos permitidos
    if (name) user.name = name;
    if (location) user.location = location;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.json({
      success: true,
      user,
      message: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// ========== FUNCIONES ADMINISTRATIVAS ==========

// 1. Obtener todos los usuarios (solo superadmin)
const getAllUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Verificar permisos - SOLO superadmin
    if (currentUser.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo superadministradores pueden ver todos los usuarios'
      });
    }

    // Obtener todos los usuarios (sin passwords)
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// 2. Cambiar rol de usuario (solo superadmin)
const changeUserRole = async (req, res) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;
    const { role } = req.body;

    // Verificar permisos - SOLO superadmin
    if (currentUser.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo superadministradores pueden cambiar roles'
      });
    }

    // Validar nuevo rol
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Rol inválido. Debe ser "user" o "admin"'
      });
    }

    // No permitir cambiar rol del propio superadmin
    if (id === currentUser.id) {
      return res.status(400).json({
        success: false,
        error: 'No puedes cambiar tu propio rol'
      });
    }

    // Buscar usuario
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // No permitir modificar a otro superadmin
    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'No puedes modificar a otro superadministrador'
      });
    }

    // Actualizar rol
    user.role = role;
    await user.save();

    // Preparar respuesta sin password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: `Rol actualizado a "${role}" exitosamente`,
      user: userResponse
    });
  } catch (error) {
    console.error('Error cambiando rol:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// 3. Eliminar usuario (solo superadmin)
const deleteUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;

    // Verificar permisos - SOLO superadmin
    if (currentUser.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo superadministradores pueden eliminar usuarios'
      });
    }

    // No permitir eliminarse a sí mismo
    if (id === currentUser.id) {
      return res.status(400).json({
        success: false,
        error: 'No puedes eliminar tu propia cuenta'
      });
    }

    // Buscar usuario
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // No permitir eliminar a otro superadmin
    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'No puedes eliminar a otro superadministrador'
      });
    }

    // Eliminar usuario
    await user.destroy();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  getAllUsers,
  changeUserRole,
  deleteUser,
  generateToken
};