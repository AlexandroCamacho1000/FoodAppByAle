// frontend/src/routes/index.jsx - VERSIÓN FINAL
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
import Profile from '../pages/Profile';          
import MyOrders from '../pages/MyOrders';        
import TestPage from '../pages/TestPage';
import NotFound from '../pages/NotFound';

// Importa el Layout de Admin y sus páginas
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminProducts from '../pages/admin/AdminProducts';

// Importa ProtectedRoute
import { ProtectedRoute } from '../components/ProtectedRoute';

// Importa la nueva página de invitaciones
import CreateInvitePage from '../pages/admin/CreateInvitePage';

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
      
      // ✅ RUTAS PROTEGIDAS PARA USUARIOS AUTENTICADOS
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-orders',
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        )
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      
      // ✅ NUEVA RUTA: GENERADOR DE INVITACIONES (solo superadmin)
      {
        path: 'create-invite',
        element: (
          <ProtectedRoute requireSuperadmin>
            <CreateInvitePage />
          </ProtectedRoute>
        )
      },
    ],
  },
  
  // ✅ RUTA ADMIN (accesible para admin y superadmin)
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
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
  
  // ✅ 404
  {
    path: '*',
    element: <NotFound />,
  }
]);

export default router;