// frontend/src/pages/Login.jsx - MODIFICAR
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- NUEVO

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // NUEVO: usar el contexto de autenticación
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    // NUEVO: usar el login del AuthContext
    const result = login(email, password);
    
    if (result.success) {
      // Redirigir a la página que intentaba acceder o al inicio
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Iniciar Sesión</h1>
            <p className="text-[#64748B]">Accede a tu cuenta de Bolivian Market</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-3 rounded-lg font-medium hover:shadow-lg transition"
            >
              Ingresar
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[#64748B]">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-[#2563EB] font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          {/* Credenciales de prueba para desarrollo */}
          <div className="mt-8 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <p className="text-sm font-medium text-[#475569] mb-2">Credenciales de prueba:</p>
            <p className="text-xs text-[#64748B]">• Admin: admin@bolivianmarket.com (cualquier contraseña)</p>
            <p className="text-xs text-[#64748B]">• Usuario: cliente@bolivia.com (cualquier contraseña)</p>
            <p className="text-xs text-[#64748B] mt-1">• Cualquier otro email crea un usuario demo</p>
          </div>
        </div>
      </div>
    </div>
  );
}