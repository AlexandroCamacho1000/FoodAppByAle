// frontend/src/pages/Checkout.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Clave pública de prueba de Stripe
const stripePromise = loadStripe('pk_test_51Q0DnVP6bo7qOg3ONWkjpWzxBoSj2mQa9zdwbjRAyD0nxTxU5IGSnmX1IYi70rU6FH7m4VJKAbLRdyq9QvHWBvaY00gQddc76H');

// Componente interno para formulario de tarjeta
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
      // Crear PaymentMethod
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Simular éxito para testing
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

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const { 
    cart,
    clearCart,
    subtotal,
    shipping,
    tax,
    total,
    isEmpty,
    totalItems
  } = useCart();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cardPaymentSuccess, setCardPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    department: '',
    city: '',
    notes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [errors, setErrors] = useState({});
  
  const departments = [
    { value: '', label: 'Selecciona un departamento' },
    { value: 'lp', label: 'La Paz' },
    { value: 'cbb', label: 'Cochabamba' },
    { value: 'scz', label: 'Santa Cruz' },
    { value: 'oru', label: 'Oruro' },
    { value: 'pts', label: 'Potosí' },
    { value: 'tja', label: 'Tarija' },
    { value: 'chu', label: 'Chuquisaca' },
    { value: 'ben', label: 'Beni' },
    { value: 'pan', label: 'Pando' }
  ];
  
  const citiesByDepartment = {
    'lp': ['La Paz', 'El Alto', 'Viacha', 'Caranavi', 'Patacamaya'],
    'cbb': ['Cochabamba', 'Quillacollo', 'Sacaba', 'Tiquipaya', 'Vinto'],
    'scz': ['Santa Cruz de la Sierra', 'Montero', 'Warnes', 'La Guardia', 'El Torno'],
    'oru': ['Oruro', 'Challapata', 'Huanuni', 'Caracollo'],
    'pts': ['Potosí', 'Villazón', 'Tupiza', 'Uyuni'],
    'tja': ['Tarija', 'Yacuiba', 'Bermejo', 'Villamontes'],
    'chu': ['Sucre', 'Monteagudo', 'Padilla', 'Tarabuco'],
    'ben': ['Trinidad', 'Riberalta', 'Guayaramerín', 'San Borja'],
    'pan': ['Cobija', 'Porvenir', 'Bella Flor', 'Filadelfia']
  };
  
  // Verificar autenticación al cargar
  useEffect(() => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
      return;
    }
    
    // Pre-llenar datos del usuario
    if (user && !formData.fullName) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (isEmpty && step !== 3) {
      navigate('/cart');
    }
  }, [isEmpty, navigate, step]);
  
  // CALCULAR errores usando useMemo
  const calculatedErrors = useMemo(() => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nombre completo es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Teléfono es requerido';
    } else if (formData.phone.length < 8) {
      newErrors.phone = 'Teléfono debe tener al menos 8 dígitos';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Dirección es requerida';
    }
    
    if (!formData.department) {
      newErrors.department = 'Departamento es requerido';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Ciudad es requerida';
    }
    
    return newErrors;
  }, [formData]);
  
  // Sincronizar errors con calculatedErrors
  useEffect(() => {
    setErrors(calculatedErrors);
  }, [calculatedErrors]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        department: value,
        city: ''
      }));
    }
  };
  
  // Función SIMPLE para validar si el formulario es válido
  const isFormValid = useMemo(() => {
    return Object.keys(calculatedErrors).length === 0;
  }, [calculatedErrors]);
  
  // Función CON alerts para cuando el usuario hace click
  const validateStep1 = () => {
    if (!isFormValid) {
      const firstErrorKey = Object.keys(calculatedErrors)[0];
      if (firstErrorKey && calculatedErrors[firstErrorKey]) {
        alert(calculatedErrors[firstErrorKey]);
      } else {
        alert('Por favor completa todos los campos requeridos');
      }
      return false;
    }
    return true;
  };
  
  // Función para manejar éxito de pago con tarjeta
  const handleCardPaymentSuccess = (paymentDetails) => {
    setCardPaymentSuccess(true);
    setCardDetails(paymentDetails);
    setPaymentMethod('card');
    
    // Mostrar confirmación
    alert(`¡Pago exitoso! Tarjeta ${paymentDetails.brand} terminada en ${paymentDetails.last4}`);
  };

  const handleCardPaymentError = (error) => {
    alert(`Error en el pago: ${error}`);
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      // Para tarjeta, necesitamos procesar pago primero
      if (paymentMethod === 'card' && !cardPaymentSuccess) {
        // El formulario Stripe manejará esto
        return;
      }
      // Para otros métodos o tarjeta ya exitosa, ir al paso 3
      setStep(3);
    } else if (step === 3) {
      // FINALIZAR - Aquí sí procesamos el pedido
      handlePlaceOrder();
    }
  };
  
  const handlePlaceOrder = () => {
    if (!user) {
      alert('Error: Debes iniciar sesión para completar la compra.');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    // Guardar pedido en localStorage
    const orderId = `BOL-${Date.now().toString().slice(-6)}`;
    const orderData = {
      id: orderId,
      // CRÍTICO: Asociar pedido al usuario
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      items: cart,
      shippingInfo: formData,
      paymentMethod: paymentMethod,
      cardDetails: cardPaymentSuccess ? cardDetails : null,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      status: 'pending',
      date: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // 1. Guardar en lista general de pedidos
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    // 2. Guardar específicamente para este usuario
    const userOrdersKey = `user_orders_${user.id}`;
    const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
    userOrders.push(orderData);
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
    
    // Limpiar carrito después de un delay
    setTimeout(() => {
      clearCart();
      
      // Redirigir a confirmación con los datos del pedido
      navigate('/order-confirmation', {
        state: {
          orderId,
          orderDate: new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          total: total,
          customerName: formData.fullName,
          address: `${formData.address}, ${formData.city}`,
          items: cart.length,
          paymentMethod,
          cardDetails: cardPaymentSuccess ? cardDetails : null,
          orderData: orderData
        }
      });
      
      setLoading(false);
    }, 2000);
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/cart');
    }
  };
  
  const availableCities = formData.department 
    ? citiesByDepartment[formData.department] || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="max-w-4xl mx-auto mb-8">
          <button
            onClick={handlePrevStep}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6"
          >
            ← Volver {step === 1 ? 'al carrito' : 'atrás'}
          </button>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {step === 1 ? 'Información de envío' : 
             step === 2 ? 'Método de pago' : 
             'Revisar pedido'}
          </h1>
          <p className="text-slate-600">
            {step === 1 ? 'Completa tus datos para la entrega' : 
             step === 2 ? 'Selecciona cómo quieres pagar' : 
             'Confirma tu pedido antes de finalizar'}
          </p>
          
          {/* Stepper */}
          <div className="flex items-center justify-between mt-8 mb-12 relative">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step === stepNumber 
                    ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white' 
                    : step > stepNumber 
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {step > stepNumber ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span className="font-bold">{stepNumber}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {stepNumber === 1 ? 'Envío' : 
                   stepNumber === 2 ? 'Pago' : 
                   'Confirmar'}
                </span>
              </div>
            ))}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-fuchsia-600 transition-all duration-300"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  📍 Dirección de entrega
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.fullName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Juan Pérez"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="juan@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="+591 70000000"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Departamento *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.department ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      {departments.map(dept => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-red-500 text-sm">{errors.department}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Ciudad *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-slate-300'
                      }`}
                      disabled={!formData.department}
                    >
                      <option value="">Selecciona una ciudad</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-sm">{errors.city}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Dirección completa *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.address ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Calle, número, zona"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Instrucciones adicionales (opcional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Timbre azul, dejar con el portero, etc."
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  💳 Método de pago
                </h2>
                
                <div className="space-y-4">
                  {/* Opción: Efectivo */}
                  <div className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setPaymentMethod('cash');
                    setCardPaymentSuccess(false);
                  }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'cash' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          💵
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">Pago en efectivo</h3>
                          <p className="text-slate-600">Paga cuando recibas tu pedido</p>
                        </div>
                      </div>
                      {paymentMethod === 'cash' && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Opción: QR */}
                  <div className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'qr' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setPaymentMethod('qr');
                    setCardPaymentSuccess(false);
                  }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'qr' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          📱
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">Pago con QR</h3>
                          <p className="text-slate-600">Escanea el código con tu banco</p>
                        </div>
                      </div>
                      {paymentMethod === 'qr' && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                    
                    {paymentMethod === 'qr' && (
                      <div className="mt-6 p-4 bg-white border border-slate-300 rounded-lg text-center">
                        <p className="text-sm text-slate-600 mb-3">Escanea este código QR para pagar</p>
                        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-fuchsia-100 flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📱</div>
                            <p className="text-xs text-slate-500">QR Simulado</p>
                            <p className="text-xs text-slate-500">Bs. {total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Opción: Tarjeta de crédito/débito */}
                  <div className={`p-6 border-2 rounded-xl transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-slate-200'
                  }`}>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        setPaymentMethod('card');
                        setCardPaymentSuccess(false);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'card' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          💳
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">Tarjeta de crédito/débito</h3>
                          <p className="text-slate-600">Visa, Mastercard, American Express</p>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                    
                    {/* Mostrar formulario Stripe solo si tarjeta está seleccionada */}
                    {paymentMethod === 'card' && (
                      <div className="mt-6">
                        <Elements stripe={stripePromise}>
                          <CardPaymentForm 
                            total={total}
                            onSuccess={handleCardPaymentSuccess}
                            onError={handleCardPaymentError}
                          />
                        </Elements>
                        
                        {cardPaymentSuccess && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✓</span>
                              <p className="text-green-700 font-medium">
                                ¡Pago confirmado! {cardDetails?.brand} terminada en {cardDetails?.last4}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Información de seguridad */}
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600">🛡️</span>
                    <p className="text-sm text-slate-700">
                      Tu pago está protegido. No almacenamos datos de tarjetas de crédito.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  ✅ Resumen del pedido
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">Información de entrega</h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">{formData.fullName}</p>
                      <p className="text-slate-600">{formData.address}</p>
                      <p className="text-slate-600">{formData.city}, {departments.find(d => d.value === formData.department)?.label || formData.department}</p>
                      <p className="text-slate-600">{formData.phone}</p>
                      <p className="text-slate-600">{formData.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">Productos</h3>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="text-slate-900 font-medium">
                            Bs. {((item.price || 0) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">Método de pago</h3>
                    <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-3">
                      {paymentMethod === 'cash' ? (
                        <>
                          <span className="text-blue-600">💵</span>
                          <span className="font-medium text-slate-900">Pago en efectivo</span>
                        </>
                      ) : paymentMethod === 'qr' ? (
                        <>
                          <span className="text-blue-600">📱</span>
                          <span className="font-medium text-slate-900">Pago con QR</span>
                        </>
                      ) : (
                        <>
                          <span className="text-purple-600">💳</span>
                          <div>
                            <span className="font-medium text-slate-900">Tarjeta de crédito/débito</span>
                            {cardDetails && (
                              <p className="text-sm text-slate-500">
                                {cardDetails.brand} terminada en {cardDetails.last4}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {formData.notes && (
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-3">Instrucciones adicionales</h3>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-slate-600">{formData.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Tu pedido</h2>
              
              {/* Productos */}
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-slate-900 font-medium">{item.name}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          x{item.quantity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">Bs. {item.price?.toFixed(2) || '0.00'} c/u</p>
                    </div>
                    <div className="text-slate-900 font-medium">
                      Bs. {((item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totales */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Bs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span>Bs. {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Impuestos (13%)</span>
                  <span>Bs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-blue-600">Bs. {total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Botón de acción */}
              <button
                onClick={handleNextStep}
                disabled={
                  loading || 
                  (step === 1 && !isFormValid) || 
                  (step === 2 && paymentMethod === 'card' && !cardPaymentSuccess)
                }
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                  loading
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white hover:from-blue-700 hover:to-fuchsia-700 hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </span>
                ) : step === 1 ? (
                  'Continuar al pago'
                ) : step === 2 && paymentMethod === 'card' && !cardPaymentSuccess ? (
                  'Procesar pago'
                ) : step === 2 ? (
                  'Revisar pedido'
                ) : step === 3 ? (
                  'Finalizar compra'
                ) : (
                  'Continuar'
                )}
              </button>
              
              {/* Información de seguridad */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-green-600">🛡️</span>
                  <p>Tu información personal está protegida. No compartimos tus datos con terceros.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;