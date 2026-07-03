import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  getCart, 
  addToCart as addToCartService, 
  removeFromCart as removeFromCartService,
  updateCartItemQuantity,
  clearCart as clearCartService,
  calculateCartTotal,
  getCartItemCount,
  calculateShipping,
  calculateTax,
  calculateGrandTotal,
  isProductInCart,
  getProductQuantity
} from '../services/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) loadCart();
  }, []);
  
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await getCart();
      setCart(cartData);
      console.log('🛒 Carrito cargado:', cartData.length, 'productos');
    } catch (err) {
      setError('Error al cargar el carrito');
      console.error('❌ Error cargando carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar al carrito
  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      setError(null);
      const updatedCart = await addToCartService(product, quantity);
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (err) {
      const errorMsg = 'Error al agregar al carrito';
      setError(errorMsg);
      console.error('❌', errorMsg, err);
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar del carrito
  const removeFromCart = useCallback(async (productId) => {
    try {
      setError(null);
      const updatedCart = await removeFromCartService(productId);
      setCart(updatedCart);
    } catch (err) {
      setError('Error al eliminar del carrito');
      console.error('❌ Error eliminando del carrito:', err);
    }
  }, []);

  // Actualizar cantidad
  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      setError(null);
      const updatedCart = await updateCartItemQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError('Error al actualizar cantidad');
      console.error('❌ Error actualizando cantidad:', err);
    }
  }, []);

  // Vaciar carrito
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await clearCartService();
      setCart([]);
    } catch (err) {
      setError('Error al vaciar el carrito');
      console.error('❌ Error vaciando carrito:', err);
    }
  }, []);

  // Cálculos derivados
  const totalItems = getCartItemCount(cart);
  const subtotal = calculateCartTotal(cart);
  const shipping = calculateShipping(cart, subtotal);
  const tax = calculateTax(subtotal);
  const total = calculateGrandTotal(cart);

  // Utilidades
  const isInCart = (productId) => isProductInCart(cart, productId);
  const getQuantity = (productId) => getProductQuantity(cart, productId);

  // Valor del contexto
  const contextValue = {
    // Estado
    cart,
    loading,
    error,
    
    // Acciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    reloadCart: loadCart,
    
    // Cálculos
    totalItems,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
    
    // Utilidades
    isInCart,
    getQuantity,
    
    // Información adicional
    isEmpty: cart.length === 0,
    itemCount: cart.length,
    hasFreeShipping: shipping === 0,
    freeShippingThreshold: 100, // Bs. 100 para envío gratis
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}