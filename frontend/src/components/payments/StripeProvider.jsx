// frontend/components/payment/StripeProvider.jsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Clave pública de prueba - REEMPLAZA ESTA CON TU CLAVE REAL
const stripePromise = loadStripe('pk_test_51P...tu_clave_publica_aqui');

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;