import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    
    if (!email || !password) {
      setError(t('login.error.required'));
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await login(email, password);
      
      console.log('🔍 Login.jsx - Resultado del login:', result);
      
      if (result.success) {
        console.log('✅ Login.jsx - Login exitoso, redirigiendo...');
        
        // Redirigir a la página que intentaba acceder o al inicio
        const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
      } else {
        console.log('❌ Login.jsx - Error en login:', result.error);
        setError(result.error || t('login.error.invalid'));
      }
    } catch (error) {
      console.error('❌ Login.jsx - Error inesperado:', error);
      setError(t('login.error.connection'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCredentials = (type) => {
    if (type === 'cliente') {
      setEmail('cliente@test.com');
      setPassword('cliente123');
    } else if (type === 'superadmin') {
      setEmail('superadmin@bolivianmarket.com');
      setPassword('superadmin123');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">{t('login.title')}</h1>
            <p className="text-[#64748B]">{t('login.subtitle')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('login.emailPlaceholder')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('login.passwordPlaceholder')}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('login.loading') : t('login.submit')}
            </button>
          </form>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-center text-[#64748B]">{t('login.quickTest')}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTestCredentials('cliente')}
                className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition"
              >
                {t('login.clientBtn')}
              </button>
              <button
                type="button"
                onClick={() => handleTestCredentials('superadmin')}
                className="flex-1 bg-purple-50 text-purple-700 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition"
              >
                {t('login.superadminBtn')}
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[#64748B]">
              {t('login.noAccount')}{' '}
              <Link to="/register" className="text-[#2563EB] font-medium hover:underline">
                {t('login.registerLink')}
              </Link>
            </p>
          </div>
      
          {/* Información de credenciales reales */}
          <div className="mt-8 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <p className="text-sm font-medium text-[#475569] mb-2">{t('login.credentialsTitle')}</p>
            <p className="text-xs text-[#64748B]">
              • Cliente: <span className="font-mono">cliente@test.com</span> / <span className="font-mono">cliente123</span>
            </p>
            <p className="text-xs text-[#64748B]">
              • Superadmin: <span className="font-mono">superadmin@bolivianmarket.com</span> / <span className="font-mono">superadmin123</span>
            </p>
            <p className="text-xs text-[#64748B] mt-1 text-green-600">
              ✓ {t('login.credentialsReal')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}