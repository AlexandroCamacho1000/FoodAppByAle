import api from './api';

const CART_KEY = 'cart_items';

const getLocalCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const transformBackendItem = (item) => ({
  id: item.productId,
  productId: item.productId,
  name: item.name || item.product?.name || 'Producto',
  price: parseFloat(item.price || item.product?.price || 0),
  image: item.image || item.product?.image || '/images/placeholder.jpg',
  quantity: item.quantity,
  description: item.product?.description || '',
  category: item.product?.category || '',
  addedAt: item.addedAt || new Date().toISOString()
});

export const getCart = async () => {
  const token = localStorage.getItem('token');
  if (!token) return getLocalCart();
  try {
    const response = await api.get('/cart');
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch {
    return getLocalCart();
  }
};

export const addToCart = async (product, quantity = 1) => {
  const token = localStorage.getItem('token');
  if (!token) {
    const items = getLocalCart();
    const existing = items.find(i => String(i.id) === String(product.id));
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        productId: product.id,
        name: product.name || 'Producto',
        price: parseFloat(product.price || 0),
        image: product.image || '/images/placeholder.jpg',
        quantity,
        description: product.description || '',
        category: product.category || '',
        addedAt: new Date().toISOString()
      });
    }
    saveLocalCart(items);
    return items;
  }
  try {
    const response = await api.post('/cart/add', { productId: product.id, quantity });
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch {
    const items = getLocalCart();
    const existing = items.find(i => String(i.id) === String(product.id));
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        productId: product.id,
        name: product.name || 'Producto',
        price: parseFloat(product.price || 0),
        image: product.image || '/images/placeholder.jpg',
        quantity,
        description: product.description || '',
        category: product.category || '',
        addedAt: new Date().toISOString()
      });
    }
    saveLocalCart(items);
    return items;
  }
};

export const removeFromCart = async (productId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    const items = getLocalCart().filter(i => String(i.id) !== String(productId));
    saveLocalCart(items);
    return items;
  }
  try {
    const response = await api.delete(`/cart/item/${productId}`);
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch {
    const items = getLocalCart().filter(i => String(i.id) !== String(productId));
    saveLocalCart(items);
    return items;
  }
};

export const updateCartItemQuantity = async (productId, quantity) => {
  if (quantity < 1) return removeFromCart(productId);
  const token = localStorage.getItem('token');
  if (!token) {
    const items = getLocalCart().map(i =>
      String(i.id) === String(productId) ? { ...i, quantity } : i
    );
    saveLocalCart(items);
    return items;
  }
  try {
    const response = await api.put(`/cart/item/${productId}`, { quantity });
    if (response.data?.cart?.items) {
      return response.data.cart.items.map(transformBackendItem);
    }
    return [];
  } catch {
    const items = getLocalCart().map(i =>
      String(i.id) === String(productId) ? { ...i, quantity } : i
    );
    saveLocalCart(items);
    return items;
  }
};

export const clearCart = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    saveLocalCart([]);
    return [];
  }
  try {
    await api.delete('/cart/clear');
    return [];
  } catch {
    saveLocalCart([]);
    return [];
  }
};

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

export const isProductInCart = (cart, productId) => {
  return cart.some(item => String(item.id) === String(productId));
};

export const getProductQuantity = (cart, productId) => {
  const item = cart.find(item => String(item.id) === String(productId));
  return item ? Number(item.quantity) : 0;
};

const cartService = {
  getCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart,
  calculateCartTotal, getCartItemCount, calculateShipping, calculateTax,
  calculateGrandTotal, isProductInCart, getProductQuantity
};

export default cartService;
