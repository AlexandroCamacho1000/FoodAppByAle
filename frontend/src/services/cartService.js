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
  try {
    checkAuth();
    const response = await api.get('/cart');
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw error;
  }
};

// ========== AGREGAR AL CARRITO (SOLO BACKEND) ==========
export const addToCart = async (product, quantity = 1) => {
  try {
    checkAuth();
    const response = await api.post('/cart/add', {
      productId: product.id,
      quantity: quantity
    });
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

// ========== ELIMINAR DEL CARRITO (SOLO BACKEND) ==========
export const removeFromCart = async (productId) => {
  try {
    checkAuth();
    const response = await api.delete(`/cart/item/${productId}`);
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

// ========== ACTUALIZAR CANTIDAD (SOLO BACKEND) ==========
export const updateCartItemQuantity = async (productId, quantity) => {
  if (quantity < 1) {
    return removeFromCart(productId);
  }
  try {
    checkAuth();
    const response = await api.put(`/cart/item/${productId}`, {
      quantity: quantity
    });
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

// ========== VACIAR CARRITO (SOLO BACKEND) ==========
export const clearCart = async () => {
  try {
    checkAuth();
    const response = await api.delete('/cart/clear');
    return [];
  } catch (error) {
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
