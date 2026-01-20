import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold">
              {isLogin ? t('auth.signIn') : t('auth.signUp')}
            </h1>
            <p className="text-blue-100 mt-2">
              {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex border-b border-[#E2E8F0]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                isLogin
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-[#64748B] hover:text-[#475569]'
              }`}
            >
              {t('auth.signIn')}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                !isLogin
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-[#64748B] hover:text-[#475569]'
              }`}
            >
              {t('auth.signUp')}
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <form className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-[#CBD5E1] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                  <span className="ml-2 text-sm text-[#475569]">{t('auth.rememberMe')}</span>
                </label>
                <a href="#" className="text-sm text-[#2563EB] hover:text-[#1D4ED8]">
                  {t('auth.forgotPassword')}
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                {isLogin ? t('auth.signIn') : t('auth.signUp')}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
              <span className="mx-4 text-sm text-[#94A3B8]">{t('auth.orContinueWith')}</span>
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-[#CBD5E1] text-[#475569] py-3 rounded-lg hover:border-[#DB4437] hover:text-[#DB4437] transition-colors">
                <FaGoogle />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 border border-[#CBD5E1] text-[#475569] py-3 rounded-lg hover:border-[#4267B2] hover:text-[#4267B2] transition-colors">
                <FaFacebook />
                <span>Facebook</span>
              </button>
            </div>

            {/* Switch auth mode */}
            <div className="text-center mt-6 pt-6 border-t border-[#E2E8F0]">
              <p className="text-[#64748B]">
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                >
                  {isLogin ? t('auth.signUp') : t('auth.signIn')}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Info extra */}
        <div className="mt-6 text-center text-sm text-[#64748B]">
          <p>{t('auth.securityNotice')}</p>
        </div>
      </div>
    </div>
  );
}