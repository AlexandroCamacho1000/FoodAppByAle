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
      
      
      
      if (result.success) {
        
        
    
        const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
      } else {
        
        setError(result.error || t('login.error.invalid'));
      }
    } catch {
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
    <div className="min-h-[70vh] bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-200 dark:border-[#334155]">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">{t('login.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('login.subtitle')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-[#475569] rounded-lg dark:bg-[#0f172a] dark:text-gray-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('login.emailPlaceholder')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-[#475569] rounded-lg dark:bg-[#0f172a] dark:text-gray-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
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
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">{t('login.quickTest')}</p>
            <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
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
            <p className="text-gray-500 dark:text-gray-400">
              {t('login.noAccount')}{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                {t('login.registerLink')}
              </Link>
            </p>
          </div>
      
          <details className="mt-8 p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg border border-gray-200 dark:border-[#334155] cursor-pointer">
            <summary className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('login.credentialsTitle')}</summary>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                • Cliente: <span className="font-mono">cliente@test.com</span> / <span className="font-mono">cliente123</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                • Superadmin: <span className="font-mono">superadmin@bolivianmarket.com</span> / <span className="font-mono">superadmin123</span>
              </p>
              <p className="text-xs text-green-600 mt-1">✓ {t('login.credentialsReal')}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}