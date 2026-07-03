// frontend/src/services/cartService.js - VERSIÓN BACKEND REAL (SIN LOCALSTORAGE)

import api from './api';

// ========== VERIFICAR AUTENTICACIÓN ==========
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  return token;
};

// ========== TRANSFORMAR ITEM DEL BACKEND ==========
const transformBackendItem = (item) => {
  return {
    id: item.productId,
    productId: item.productId,
    name: item.name || item.product?.name || 'Producto',
    price: parseFloat(item.price || item.product?.price || 0),
    image: item.image || item.product?.image || '/images/placeholder.jpg',
    quantity: item.quantity,
    description: item.product?.description || '',
    category: item.product?.category || '',
    addedAt: item.addedAt || new Date().toISOString()
  };
};

// ========== OBTENER CARRITO (SOLO BACKEND) ==========
export const getCart = async () => {
  console.log('🛒 Obteniendo carrito desde BACKEND...');
  
  try {
    checkAuth(); // Lanza error si no hay token
    
    const response = await api.get('/cart');
    console.log('✅ Carrito cargado desde backend');
    
    if (response.data?.cart?.items) {
      const transformedCart = response.data.cart.items.map(transformBackendItem);
      console.log(`📦 ${transformedCart.length} productos en carrito`);
      return transformedCart;
    }
    return [];
  } catch (error) {
    console.error('❌ Error cargando carrito del backend:', error);
    if (error.response?.status === 401) {
      console.log('🔒 Token inválido - redirigir a login');
      // Aquí podrías disparar un evento para redirigir a login
    }
    throw error; // Propagamos el error para manejarlo en el contexto
  }
};

// ========== AGREGAR AL CARRITO (SOLO BACKEND) ==========
export const addToCart = async (product, quantity = 1) => {
  console.log('➕ Agregando al carrito en BACKEND:', product.name, 'x', quantity);
  
  try {
    checkAuth();
    
    const response = await api.post('/cart/add', {
      productId: product.id,
      quantity: quantity
    });
    
    console.log('✅ Producto agregado en backend');
    
    // Devolver el carrito actualizado
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch (error) {
    console.error('❌ Error agregando al carrito:', error);
    throw error;
  }
};

// ========== ELIMINAR DEL CARRITO (SOLO BACKEND) ==========
export const removeFromCart = async (productId) => {
  console.log('🗑️ Eliminando producto del BACKEND:', productId);
  
  try {
    checkAuth();
    
        const response = await api.delete(`/cart/item/${productId}`);
    console.log('✅ Eliminado del backend');
    
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch (error) {
    console.error('❌ Error eliminando del carrito:', error);
    throw error;
  }
};

// ========== ACTUALIZAR CANTIDAD (SOLO BACKEND) ==========
export const updateCartItemQuantity = async (productId, quantity) => {
  console.log('✏️ Actualizando cantidad en BACKEND:', productId, '→', quantity);
  
  if (quantity < 1) {
    return removeFromCart(productId);
  }
  
  try {
    checkAuth();
    
    const response = await api.put(`/cart/item/${productId}`, {
      quantity: quantity
    });
    
    console.log('✅ Cantidad actualizada en backend');
    
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch (error) {
    console.error('❌ Error actualizando cantidad:', error);
    throw error;
  }
};

// ========== VACIAR CARRITO (SOLO BACKEND) ==========
export const clearCart = async () => {
  console.log('🧹 Vaciando carrito en BACKEND');
  
  try {
    checkAuth();
    
    const response = await api.delete('/cart/clear');
    console.log('✅ Carrito vaciado en backend');
    
    return [];
  } catch (error) {
    console.error('❌ Error vaciando carrito:', error);
    throw error;
  }
};

// ========== FUNCIONES DE CÁLCULO (PUROS) ==========
export const calculateCartTotal = (cart) => {
  return cart.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
};

export const getCartItemCount = (cart) => {
  return cart.reduce((count, item) => count + Number(item.quantity), 0);
};

export const calculateShipping = (cart, subtotal) => {
  if (cart.length === 0) return 0;
  return subtotal > 100 ? 0 : 15;
};

export const calculateTax = (subtotal) => subtotal * 0.13;
export const calculateGrandTotal = (cart) => {
  const subtotal = calculateCartTotal(cart);
  return subtotal + calculateShipping(cart, subtotal) + calculateTax(subtotal);
};

// ========== UTILIDADES ==========
export const isProductInCart = (cart, productId) => {
  return cart.some(item => String(item.id) === String(productId));
};

export const getProductQuantity = (cart, productId) => {
  const item = cart.find(item => String(item.id) === String(productId));
  return item ? Number(item.quantity) : 0;
};

// ========== EXPORTACIÓN ==========
const cartService = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  calculateCartTotal,
  getCartItemCount,
  calculateShipping,
  calculateTax,
  calculateGrandTotal,
  isProductInCart,
  getProductQuantity
};

export default cartService;