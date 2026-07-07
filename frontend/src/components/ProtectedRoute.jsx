import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireSuperadmin = false 
}) => {
  const { user, isAdmin, isSuperadmin, loading } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (requireSuperadmin && !isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-center p-8 bg-white dark:bg-[#1e293b] rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('protected.restrictedTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('protected.restrictedDesc')}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {t('protected.goBack')}
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin && !isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-center p-8 bg-white dark:bg-[#1e293b] rounded-lg shadow-md max-w-md">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('protected.deniedTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('protected.deniedDesc')}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {t('protected.goBack')}
          </button>
        </div>
      </div>
    );
  }

  return children;
};
