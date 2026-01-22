// frontend/components/payment/CardPaymentForm.jsx
import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const CardPaymentForm = ({ total, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Crear PaymentMethod
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // 2. En un entorno real, aquí enviarías el paymentMethod.id a tu backend
      // 3. Simular éxito para testing
      setTimeout(() => {
        setProcessing(false);
        onSuccess({
          paymentMethodId: paymentMethod.id,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4
        });
      }, 1500);

    } catch (err) {
      setError(err.message);
      setProcessing(false);
      onError(err.message);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-slate-300 rounded-lg bg-white">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Información de la tarjeta
        </label>
        <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
          <CardElement options={cardElementOptions} />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-600">🔒</span>
          <p className="text-sm text-blue-700 font-medium">Pago seguro con Stripe</p>
        </div>
        <p className="text-xs text-blue-600">
          Tu información de tarjeta está encriptada y nunca toca nuestros servidores.
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          !stripe || processing
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Procesando pago...
          </span>
        ) : (
          `Pagar Bs. ${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

export default CardPaymentForm;