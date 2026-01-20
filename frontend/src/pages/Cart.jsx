import { useLanguage } from '../context/LanguageContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

export default function Cart() {
  const { t } = useLanguage();

  // Datos de ejemplo del carrito
  const cartItems = [
    {
      id: 1,
      name: t('products.saltenas.name'),
      description: t('products.saltenas.description'),
      price: 15,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150',
    },
    {
      id: 2,
      name: 'Anticuchos',
      description: 'Brochetas de corazón de res marinadas',
      price: 28,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150',
    },
    {
      id: 3,
      name: 'Sillpancho',
      description: 'Arroz, papa dorada, carne empanizada',
      price: 42,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=150',
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15;
  const tax = subtotal * 0.13;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-8">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex items-center gap-6"
                >
                  {/* Imagen */}
                  <div className="w-24 h-24 bg-gradient-to-br from-[#DBEAFE] to-[#E0F2FE] rounded-lg flex-shrink-0"></div>

                  {/* Detalles */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-[#1E293B]">{item.name}</h3>
                        <p className="text-sm text-[#64748B] mt-1">{item.description}</p>
                      </div>
                      <button className="text-[#94A3B8] hover:text-[#DC2626]">
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Contador */}
                      <div className="flex items-center gap-3">
                        <button className="w-8 h-8 rounded-full border border-[#CBD5E1] text-[#475569] hover:border-[#2563EB] flex items-center justify-center">
                          <FaMinus size={12} />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button className="w-8 h-8 rounded-full border border-[#CBD5E1] text-[#475569] hover:border-[#2563EB] flex items-center justify-center">
                          <FaPlus size={12} />
                        </button>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#2563EB]">
                          Bs. {item.price * item.quantity}
                        </div>
                        <div className="text-sm text-[#94A3B8]">
                          Bs. {item.price} c/u
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-2xl p-12 text-center border border-[#E2E8F0]">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#2563EB] to-[#D946EF] rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-3">{t('cart.empty')}</h3>
              <p className="text-[#64748B] mb-6">{t('cart.emptyDescription')}</p>
              <button className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-8 py-3 rounded-lg font-medium">
                {t('menu')}
              </button>
            </div>
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 sticky top-6">
            <h2 className="text-xl font-bold text-[#1E293B] mb-6">{t('cart.summary')}</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[#475569]">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium">Bs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>{t('cart.shipping')}</span>
                <span className="font-medium">Bs. {shipping}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>{t('cart.tax')}</span>
                <span className="font-medium">Bs. {tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4">
                <div className="flex justify-between text-lg font-bold text-[#1E293B]">
                  <span>{t('cart.total')}</span>
                  <span>Bs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow mb-4">
              {t('cart.checkout')}
            </button>

            <button className="w-full border-2 border-[#475569] text-[#475569] py-3 rounded-lg font-medium hover:bg-[#F8FAFC] transition-colors">
              {t('cart.continue')}
            </button>

            {/* Info adicional */}
            <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">
                {t('cart.securityInfo')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}