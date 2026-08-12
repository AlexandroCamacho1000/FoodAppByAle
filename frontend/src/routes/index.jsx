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
import NotFound from '../pages/NotFound';

import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';

import { ProtectedRoute } from '../components/ProtectedRoute';

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
        path: 'product/:id',
        element: <ProductDetail />
      },
      {
        path: 'order-confirmation',
        element: <OrderConfirmation />
      },
      
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
      {
        path: 'customers',
        element: <AdminCustomers />,
      },
      {
        path: 'analytics',
        element: <AdminAnalytics />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
    ],
  },
  
  {
    path: '*',
    element: <NotFound />,
  }
]);

export default router;