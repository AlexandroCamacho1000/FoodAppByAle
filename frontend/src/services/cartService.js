import api from './api';

// Clave para localStorage
const CART_STORAGE_KEY = 'sabores_cart_v2';

// ========== LOCALSTORAGE ==========

// Obtener carrito de localStorage
export const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('❌ Error leyendo carrito:', error);
    return [];
  }
};

// Guardar carrito en localStorage
export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('❌ Error guardando carrito:', error);
    return false;
  }
};

// ========== FUNCIONES PRINCIPALES ==========

// Obtener carrito
export const getCart = async () => {
  // Si tenemos API configurada, usarla
  if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
    try {
      const response = await api.get('/cart');
      console.log('🔄 Carrito cargado desde API');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Error cargando de API, usando localStorage:', error.message);
    }
  }
  
  // Fallback a localStorage
  const cart = getCartFromStorage();
  console.log('📦 Carrito cargado:', cart.length, 'items');
  return cart;
};

// Agregar producto al carrito - CORREGIDO
export const addToCart = async (product, quantity = 1) => {
  console.log('➕ Agregando:', product.name, 'x', quantity);
  
  const cart = getCartFromStorage();
  
  // Normalizar ID a string para comparación consistente
  const productId = String(product.id);
  
  // Buscar si el producto ya está en el carrito
  const existingIndex = cart.findIndex(item => String(item.id) === productId);
  
  let updatedCart;
  if (existingIndex >= 0) {
    // Si ya existe, actualizar cantidad
    updatedCart = [...cart];
    updatedCart[existingIndex] = {
      ...updatedCart[existingIndex],
      quantity: updatedCart[existingIndex].quantity + quantity,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Si no existe, agregar nuevo item
    updatedCart = [...cart, {
      ...product,
      id: productId, // Guardar como string para consistencia
      quantity,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  }
  
  // Guardar localmente
  saveCartToStorage(updatedCart);
  
  // Sincronizar con API si está disponible
  if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
    try {
      await api.post('/cart/items', {
        productId: productId,
        quantity,
        name: product.name,
        price: product.price
      });
      console.log('✅ Carrito sincronizado con API');
    } catch (error) {
      console.warn('⚠️ Error sincronizando con API:', error.message);
    }
  }
  
  return updatedCart;
};

// Eliminar producto del carrito - CORREGIDO
export const removeFromCart = async (productId) => {
  console.log('🗑️ Eliminando ID:', productId);
  
  const cart = getCartFromStorage();
  // Comparar como strings
  const updatedCart = cart.filter(item => String(item.id) !== String(productId));
  
  saveCartToStorage(updatedCart);
  
  // Sincronizar con API
  if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
    try {
      await api.delete(`/cart/items/${productId}`);
    } catch (error) {
      console.warn('⚠️ Error eliminando de API:', error.message);
    }
  }
  
  return updatedCart;
};

// Actualizar cantidad de un producto - CORREGIDO
export const updateCartItemQuantity = async (productId, quantity) => {
  console.log('✏️ Actualizando ID:', productId, 'a', quantity);
  
  if (quantity < 1) {
    return removeFromCart(productId);
  }
  
  const cart = getCartFromStorage();
  // Comparar como strings
  const updatedCart = cart.map(item => 
    String(item.id) === String(productId) 
      ? { 
          ...item, 
          quantity, 
          updatedAt: new Date().toISOString(),
          totalPrice: item.price * quantity
        }
      : item
  );
  
  saveCartToStorage(updatedCart);
  
  // Sincronizar con API
  if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
    try {
      await api.put(`/cart/items/${productId}`, { quantity });
    } catch (error) {
      console.warn('⚠️ Error actualizando en API:', error.message);
    }
  }
  
  return updatedCart;
};

// Vaciar carrito completamente
export const clearCart = async () => {
  console.log('🧹 Vaciando carrito');
  saveCartToStorage([]);
  
  // Sincronizar con API
  if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
    try {
      await api.delete('/cart');
    } catch (error) {
      console.warn('⚠️ Error vaciando en API:', error.message);
    }
  }
};

// ========== FUNCIONES DE CÁLCULO ==========

// Calcular subtotal del carrito
export const calculateCartTotal = (cart) => {
  return cart.reduce((total, item) => {
    return total + (Number(item.price) * Number(item.quantity));
  }, 0);
};

// Contar total de items en el carrito
export const getCartItemCount = (cart) => {
  return cart.reduce((count, item) => count + Number(item.quantity), 0);
};

// Calcular costo de envío
export const calculateShipping = (cart, subtotal) => {
  if (cart.length === 0) return 0;
  if (subtotal > 100) return 0; // Envío gratis sobre Bs. 100
  return 15; // Costo fijo de envío
};

// Calcular impuestos (13% IVA boliviano)
export const calculateTax = (subtotal) => {
  return subtotal * 0.13;
};

// Calcular total final
export const calculateGrandTotal = (cart) => {
  const subtotal = calculateCartTotal(cart);
  const shipping = calculateShipping(cart, subtotal);
  const tax = calculateTax(subtotal);
  return subtotal + shipping + tax;
};

// ========== UTILIDADES ==========

// Verificar si un producto está en el carrito - CORREGIDO
export const isProductInCart = (cart, productId) => {
  return cart.some(item => String(item.id) === String(productId));
};

// Obtener cantidad de un producto específico - CORREGIDO
export const getProductQuantity = (cart, productId) => {
  const item = cart.find(item => String(item.id) === String(productId));
  return item ? Number(item.quantity) : 0;
};

// Exportar carrito (para futuras features)
export const exportCart = () => {
  return getCartFromStorage();
};

// Importar carrito (para futuras features)
export const importCart = (cartData) => {
  saveCartToStorage(cartData);
  return cartData;
};

// ========== EXPORTACIÓN ==========
// Exportar todas las funciones como objeto (opcional)
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
  getProductQuantity,
  exportCart,
  importCart
};

export default cartService;