import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] bg-gray-50 dark:bg-[#0f172a] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold bg-gradient-to-r from-[#2563EB] to-[#D946EF] bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6">
          {t('notFound.title') || 'Página no encontrada'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto">
          {t('notFound.description') || 'La página que buscas no existe o ha sido movida.'}
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
        >
          {t('notFound.goHome') || 'Volver al inicio'}
        </Link>
      </div>
    </div>
  );
}