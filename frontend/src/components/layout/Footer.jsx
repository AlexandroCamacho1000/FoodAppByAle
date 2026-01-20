import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white border-t border-[#475569]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Logo con acento fucsia */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#D946EF] rounded-lg flex items-center justify-center">
              <span className="text-xl">🥘</span>
            </div>
            <h3 className="text-xl font-bold">
              {t('app.name')} <span className="text-[#60A5FA]">{t('app.country')}</span>
            </h3>
          </div>
          
          <p className="text-[#94A3B8] max-w-2xl mx-auto">
            {t('footer.description')}
          </p>
          
          {/* Línea divisoria con fucsia */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#475569] to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm">
            <span className="text-[#CBD5E1]">© 2026 alejandrocamacho - {t('footer.rights')}</span>
            <div className="flex gap-6">
              <a href="#" className="text-[#94A3B8] hover:text-[#60A5FA]">
                {t('footer.terms')}
              </a>
              <a href="#" className="text-[#94A3B8] hover:text-[#D946EF]">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-[#94A3B8] hover:text-[#60A5FA]">
                {t('footer.contact')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}