// frontend/src/pages/Register.jsx - VERSIÓN COMPLETA ACTUALIZADA
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    inviteCode: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register } = useAuth();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!formData.name || !formData.email || !formData.password) {
      setError(t('register.error.required'));
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.error.passwordMatch'));
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError(t('register.error.passwordLength'));
      setLoading(false);
      return;
    }
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        location: formData.location || '',
        ...(formData.inviteCode.trim() && { inviteCode: formData.inviteCode.trim() })
      };
      
      const result = await register(userData);
      
      if (result.success) {
        setSuccess(result.message || t('register.success'));
        
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        }, 2000);
      } else {
        setError(result.message || t('register.error.api'));
      }
    } catch (err) {
      setError(err.message || t('register.error.api'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">{t('register.title')}</h1>
            <p className="text-[#64748B]">{t('register.subtitle')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('register.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('register.namePlaceholder')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('register.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('register.emailPlaceholder')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('register.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('register.phonePlaceholder')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('register.city')}
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="">{t('register.selectCity')}</option>
                <option value="La Paz">{t('register.cityLaPaz')}</option>
                <option value="Santa Cruz">{t('register.citySantaCruz')}</option>
                <option value="Cochabamba">{t('register.cityCochabamba')}</option>
                <option value="Oruro">{t('register.cityOruro')}</option>
                <option value="Potosí">{t('register.cityPotosi')}</option>
                <option value="Chuquisaca">{t('register.cityChuquisaca')}</option>
                <option value="Tarija">{t('register.cityTarija')}</option>
                <option value="Beni">{t('register.cityBeni')}</option>
                <option value="Pando">{t('register.cityPando')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('register.password')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('register.passwordPlaceholder')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                {t('register.confirmPassword')}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder={t('register.passwordPlaceholder')}
                required
              />
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <span className="text-purple-600">🔑</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{t('register.inviteSection')}</h3>
                  <p className="text-sm text-gray-500">{t('register.inviteOptional')}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  {t('register.inviteLabel')}
                </label>
                <input
                  type="text"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder={t('register.invitePlaceholder')}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {t('register.inviteHelp')}
                  <br/>
                  <span className="text-blue-600 font-medium">{t('register.inviteSkip')}</span>
                </p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-lg font-medium hover:shadow-lg transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? t('register.loading') : t('register.submit')}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[#64748B]">
              {t('register.hasAccount')}{' '}
              <Link to="/login" className="text-[#2563EB] font-medium hover:underline">
                {t('register.loginLink')}
              </Link>
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">{t('register.infoTitle')}</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>{t('register.infoUser')}</li>
              <li>{t('register.infoAdmin')}</li>
              <li>{t('register.infoCodes')}</li>
              <li>{t('register.infoExpiry')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}