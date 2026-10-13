import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || 'Santa Cruz'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-gray-100 mb-2 leading-tight">{t('profile.title')}</h1>
      <p className="text-[#64748B] dark:text-gray-300 mb-8">{t('profile.subtitle')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-1 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg dark:shadow-black/20 p-6 border border-[#E2E8F0] dark:border-[#334155]">
          <div className="text-center">
            <img
              src={user.avatar}
              alt={user.name || 'Profile'}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-400/20 dark:border-blue-300/20"
            />
            <h2 className="text-xl font-bold text-[#1E293B] dark:text-gray-100 break-words px-2">{user.name}</h2>
            <p className="text-[#64748B] dark:text-gray-300 break-all text-sm px-2">{user.email}</p>
            
            <div className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin' 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' 
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
            }`}>
              {user.role === 'admin' ? t('profile.roleAdmin') : t('profile.roleClient')}
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <div className="flex items-center text-[#475569] dark:text-gray-300">
              <span className="mr-3">📱</span>
              <span>{user.phone || t('profile.noPhone')}</span>
            </div>
            <div className="flex items-center text-[#475569] dark:text-gray-300">
              <span className="mr-3">📍</span>
              <span>{user.location || t('profile.defaultLocation')}</span>
            </div>
            <div className="flex items-center text-[#475569] dark:text-gray-300">
              <span className="mr-3">👤</span>
              <span>{t('profile.memberSince')}</span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg dark:shadow-black/20 p-6 border border-[#E2E8F0] dark:border-[#334155]">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-6">
              <h3 className="text-lg font-semibold text-[#1E293B] dark:text-gray-100">
                {isEditing ? t('profile.editTitle') : t('profile.personalInfo')}
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isEditing 
                    ? 'bg-[#64748B] text-white hover:bg-[#475569]' 
                    : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                }`}
              >
                {isEditing ? t('profile.cancel') : t('profile.edit')}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#475569] dark:text-gray-300 mb-1">{t('profile.nameLabel')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#475569] dark:text-gray-300 mb-1">{t('profile.emailLabel')}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100"
                      required
                      disabled
                    />
                    <p className="text-xs text-[#64748B] dark:text-gray-300 mt-1">{t('profile.emailNoEdit')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#475569] dark:text-gray-300 mb-1">{t('profile.phoneLabel')}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100"
                      placeholder={t('profile.phonePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#475569] dark:text-gray-300 mb-1">{t('profile.locationLabel')}</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100"
                    >
                      <option value="La Paz">{t('register.cityLaPaz')}</option>
                      <option value="Santa Cruz">{t('register.citySantaCruz')}</option>
                      <option value="Cochabamba">{t('register.cityCochabamba')}</option>
                      <option value="Oruro">{t('register.cityOruro')}</option>
                      <option value="Potosi">{t('register.cityPotosi')}</option>
                      <option value="Beni">{t('register.cityBeni')}</option>
                      <option value="Pando">{t('register.cityPando')}</option>
                      <option value="Tarija">{t('register.cityTarija')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg font-medium hover:shadow-lg transition"
                  >
                    {t('profile.save')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-gray-300">{t('profile.viewName')}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-gray-300">{t('profile.viewEmail')}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-gray-300">{t('profile.viewPhone')}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.phone || t('profile.noRegistered')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-gray-300">{t('profile.viewLocation')}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.location || t('profile.defaultLocation')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
