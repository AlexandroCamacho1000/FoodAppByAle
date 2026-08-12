const { Product } = require('../models');

// ========== FUNCIONES PÚBLICAS ==========

// 1. Obtener todos los productos (PÚBLICO)
const getAllProducts = async (req, res) => {
  try {
    const { category, featured, active } = req.query;
    
    // Construir filtros
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }
    
    // Por defecto solo productos activos
    where.active = active === 'false' ? false : true;
    
    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos'
    });
  }
};

// 2. Obtener producto por ID (PÚBLICO)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener producto'
    });
  }
};

// 3. Obtener productos por categoría (PÚBLICO)
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validar categoría
    const validCategories = ['salteñas', 'platos_fuertes', 'bebidas', 'postres', 'especiales'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Categoría inválida',
        validCategories
      });
    }
    
    const products = await Product.findAll({
      where: { 
        category,
        active: true 
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos'
    });
  }
};

// ========== FUNCIONES PROTEGIDAS (SOLO ADMIN) ==========

// 4. Crear producto (SOLO ADMIN)
const createProduct = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Verificar permisos - solo admin/superadmin
    if (!['admin', 'superadmin'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden crear productos'
      });
    }
    
    const { name, description, price, image, category, stock, featured } = req.body;
    
    // Validaciones básicas
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, descripción y precio son requeridos'
      });
    }
    
    // Crear producto
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      image: image || '',
      category: category || 'platos_fuertes',
      stock: stock ? parseInt(stock) : 0,
      featured: featured || false,
      active: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al crear producto'
    });
  }
};

// 5. Actualizar producto (SOLO ADMIN)
const updateProduct = async (req, res) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;
    
    // Verificar permisos
    if (!['admin', 'superadmin'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden actualizar productos'
      });
    }
    
    // Buscar producto
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    // Campos a actualizar
    const { name, description, price, image, category, stock, featured, active } = req.body;
    
    // Actualizar solo los campos enviados
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (featured !== undefined) product.featured = featured;
    if (active !== undefined) product.active = active;
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: error.errors.map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al actualizar producto'
    });
  }
};

// 6. Eliminar producto (SOLO ADMIN)
const deleteProduct = async (req, res) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;
    
    // Verificar permisos
    if (!['admin', 'superadmin'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Solo administradores pueden eliminar productos'
      });
    }
    
    // Buscar producto
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    // Soft delete (marcar como inactivo en lugar de eliminar)
    product.active = false;
    await product.save();
    
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar producto'
    });
  }
};

// 7. Obtener productos destacados (PÚBLICO)
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        featured: true,
        active: true 
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos destacados'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};