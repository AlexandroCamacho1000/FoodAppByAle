import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductDetail from '../pages/ProductDetail';
import Checkout from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation'; // ← AÑADE ESTE IMPORT
import AdminDashboard from '../pages/admin/Dashboard';
import TestPage from '../pages/TestPage';
import NotFound from '../pages/NotFound';

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
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: 'product/:id', // ← SOLO UNA VEZ
        element: <ProductDetail />
      },
      {
        path: 'order-confirmation', // ← AÑADE ESTA RUTA
        element: <OrderConfirmation />
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ],
  },
]);

export default router;