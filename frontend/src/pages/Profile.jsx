// frontend/src/pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    ciudad: user?.ciudad || 'Santa Cruz'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Mi Perfil</h1>
      <p className="text-[#64748B] mb-8">Administra tu información personal</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Panel izquierdo - Info */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-[#E2E8F0]">
          <div className="text-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-[#60A5FA]/20"
            />
            <h2 className="text-xl font-bold text-[#1E293B]">{user.name}</h2>
            <p className="text-[#64748B]">{user.email}</p>
            
            <div className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role === 'admin' ? 'Administrador' : 'Cliente'}
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <div className="flex items-center text-[#475569]">
              <span className="mr-3">📱</span>
              <span>{user.phone || 'Sin teléfono'}</span>
            </div>
            <div className="flex items-center text-[#475569]">
              <span className="mr-3">📍</span>
              <span>{user.ciudad || 'Bolivia'}</span>
            </div>
            <div className="flex items-center text-[#475569]">
              <span className="mr-3">👤</span>
              <span>Miembro desde: Hoy</span>
            </div>
          </div>
        </div>
        
        {/* Panel derecho - Editar */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#1E293B]">
                {isEditing ? 'Editar Información' : 'Información Personal'}
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isEditing 
                    ? 'bg-[#64748B] text-white hover:bg-[#475569]' 
                    : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                }`}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-gray-50"
                      required
                      disabled
                    />
                    <p className="text-xs text-[#64748B] mt-1">El email no se puede cambiar</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      placeholder="+591 1234567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1">Ciudad</label>
                    <select
                      value={formData.ciudad}
                      onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                      className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                      <option value="La Paz">La Paz</option>
                      <option value="Santa Cruz">Santa Cruz</option>
                      <option value="Cochabamba">Cochabamba</option>
                      <option value="Oruro">Oruro</option>
                      <option value="Potosi">Potosí</option>
                      <option value="Beni">Beni</option>
                      <option value="Pando">Pando</option>
                      <option value="Tarija">Tarija</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg font-medium hover:shadow-lg transition"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#64748B]">Nombre completo</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Teléfono</p>
                    <p className="font-medium">{user.phone || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Ciudad</p>
                    <p className="font-medium">{user.ciudad || 'Bolivia'}</p>
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