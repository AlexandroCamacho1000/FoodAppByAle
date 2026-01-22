// frontend/src/pages/Register.jsx - VERSIÓN COMPLETA ACTUALIZADA
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    inviteCode: ''  // ← NUEVO CAMPO
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // NUEVO: usar el register del contexto (no login)
  const { register } = useAuth();

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
    
    // Validaciones
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      // Preparar datos para registro
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        location: formData.location || '',
        // Solo incluir inviteCode si no está vacío
        ...(formData.inviteCode.trim() && { inviteCode: formData.inviteCode.trim() })
      };
      
      // Usar la función register del AuthContext
      const result = register(userData);
      
      if (result.success) {
        setSuccess(result.message || '¡Registro exitoso!');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          // Si se registró como admin, redirigir al panel admin
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        }, 2000);
      } else {
        setError(result.message || 'Error al crear la cuenta');
      }
    } catch (err) {
      setError(err.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Crear Cuenta</h1>
            <p className="text-[#64748B]">Únete a Bolivian Market</p>
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
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="Juan Pérez"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="+591 71234567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Ciudad (opcional)
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="">Selecciona tu ciudad</option>
                <option value="La Paz">La Paz</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="Cochabamba">Cochabamba</option>
                <option value="Oruro">Oruro</option>
                <option value="Potosí">Potosí</option>
                <option value="Chuquisaca">Chuquisaca</option>
                <option value="Tarija">Tarija</option>
                <option value="Beni">Beni</option>
                <option value="Pando">Pando</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* NUEVO: CAMPO DE CÓDIGO DE INVITACIÓN */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <span className="text-purple-600">🔑</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Código de Invitación</h3>
                  <p className="text-sm text-gray-500">Opcional - Solo para administradores</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Código de Invitación
                </label>
                <input
                  type="text"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="BM-XXXXXXXX"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Si tienes un código de invitación válido, ingrésalo para registrarte como administrador.
                  <br/>
                  <span className="text-blue-600 font-medium">Dejar en blanco para registro como usuario normal.</span>
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
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[#64748B]">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-[#2563EB] font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
          
          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Información importante:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Usuario normal: Acceso a compras y perfil personal</li>
              <li>• Administrador: Acceso al panel de administración</li>
              <li>• Los códigos de invitación son generados por el Super Administrador</li>
              <li>• Cada código es válido por 30 días y solo puede usarse una vez</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}