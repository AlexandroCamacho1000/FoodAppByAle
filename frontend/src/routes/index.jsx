// frontend/src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductDetail from '../pages/ProductDetail';
import Checkout from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import TestPage from '../pages/TestPage';
import NotFound from '../pages/NotFound';

// Importa el Layout de Admin y sus páginas
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminProducts from '../pages/admin/AdminProducts';

// ✅ CORREGIDO: Este es el router para usar con RouterProvider
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'menu',
        element: <Menu />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />
      },
      {
        path: 'order-confirmation',
        element: <OrderConfirmation />
      },
    ],
  },
  
  // RUTA SEPARADA PARA ADMIN
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'products',
        element: <AdminProducts />,
      },
    ],
  },
  
  // ✅ 404 DEBE ESTAR A NIVEL RAIZ, NO DENTRO DE LAYOUT
  {
    path: '*',
    element: <NotFound />,
  }
]);

export default router;