import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-4">
        {t('auth.signUp')} - Página en construcción
      </h1>
      <p className="text-[#64748B]">
        Esta página estará disponible pronto
      </p>
    </div>
  );
}