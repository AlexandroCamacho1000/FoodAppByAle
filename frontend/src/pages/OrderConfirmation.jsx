import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiHome, FiPackage, FiClock, FiMail, FiPhone } from 'react-icons/fi';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId = 'BOL-' + Math.floor(100000 + Math.random() * 900000), orderDate = new Date().toLocaleDateString(), total = 0 } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Icono de éxito */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-8">
            <FiCheckCircle className="text-6xl text-green-500" />
          </div>
          
          {/* Mensaje principal */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Gracias por tu compra. Tu pedido está siendo procesado.
          </p>
          
          {/* Tarjeta de confirmación */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FiShoppingBag className="text-3xl text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900">Detalles del pedido</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-2">Número de pedido</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">{orderId}</p>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-2">Fecha del pedido</p>
                <p className="text-xl font-bold text-slate-900">{orderDate}</p>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-fuchsia-50 rounded-xl mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FiPackage className="text-2xl text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Estado del pedido</h3>
              </div>
              <div className="flex items-center justify-between mb-4">
                {['Confirmado', 'En preparación', 'En camino', 'Entregado'].map((status, index) => (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      index === 0 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-xs font-medium text-slate-700">{status}</span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-fuchsia-500 w-1/4"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                Bs. {total.toFixed(2)}
              </p>
              <p className="text-slate-500">Total pagado</p>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-slate-900 mb-4">¿Qué sigue?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-blue-600 text-2xl mb-2 flex justify-center">
                  <FiMail />
                </div>
                <p className="font-medium text-slate-800 mb-2">Recibirás un email</p>
                <p className="text-sm text-slate-600">Con la confirmación y detalles del pedido</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-green-600 text-2xl mb-2 flex justify-center">
                  <FiClock />
                </div>
                <p className="font-medium text-slate-800 mb-2">Tiempo de entrega</p>
                <p className="text-sm text-slate-600">30-45 minutos en zona céntrica</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-purple-600 text-2xl mb-2 flex justify-center">
                  <FiPhone />
                </div>
                <p className="font-medium text-slate-800 mb-2">Soporte</p>
                <p className="text-sm text-slate-600">WhatsApp: +591 12345678</p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-fuchsia-700"
            >
              <FiHome />
              Volver al inicio
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-blue-400 hover:text-blue-600"
            >
              <FiShoppingBag />
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;