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
import Toast from '../components/ui/Toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    loadCart();
  }, []);
  
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await getCart();
      setCart(cartData);
    } catch {
      setError('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      setError(null);
      const updatedCart = await addToCartService(product, quantity);
      setCart(updatedCart);
      setToast({ show: true, message: '✅ Agregado al carrito' });
      return { success: true, cart: updatedCart };
    } catch (err) {
      const errorMsg = 'Error al agregar al carrito';
      setError(errorMsg);
      setToast({ show: true, message: '❌ Error al agregar', type: 'error' });
      return { success: false, error: err.message };
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      setError(null);
      const updatedCart = await removeFromCartService(productId);
      setCart(updatedCart);
    } catch {
      setError('Error al eliminar del carrito');
    }
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      setError(null);
      const updatedCart = await updateCartItemQuantity(productId, quantity);
      setCart(updatedCart);
    } catch {
      setError('Error al actualizar cantidad');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await clearCartService();
      setCart([]);
    } catch {
      setError('Error al vaciar el carrito');
    }
  }, []);

  const totalItems = getCartItemCount(cart);
  const subtotal = calculateCartTotal(cart);
  const shipping = calculateShipping(cart, subtotal);
  const tax = calculateTax(subtotal);
  const total = calculateGrandTotal(cart);

  const isInCart = (productId) => isProductInCart(cart, productId);
  const getQuantity = (productId) => getProductQuantity(cart, productId);

  const contextValue = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    reloadCart: loadCart,
    totalItems,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
    isInCart,
    getQuantity,
    isEmpty: cart.length === 0,
    itemCount: cart.length,
    hasFreeShipping: shipping === 0,
    freeShippingThreshold: 100,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type || 'success'}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}