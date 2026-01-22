// frontend/src/context/AuthContext.jsx - VERSIÓN COMPLETA CORREGIDA
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteCodes, setInviteCodes] = useState([]);

  // Claves para localStorage
  const USER_STORAGE_KEY = 'bolivian_market_user';
  const USERS_STORAGE_KEY = 'bolivian_market_users';
  const INVITE_CODES_STORAGE_KEY = 'bolivian_market_invite_codes';

  // Credenciales de superadmin desde variables de entorno
  const SUPERADMIN_EMAIL = import.meta.env.VITE_SUPERADMIN_EMAIL || 'superadmin@bolivianmarket.com';
  const SUPERADMIN_PASSWORD = import.meta.env.VITE_SUPERADMIN_PASSWORD || 'superadmin123';
  const INVITE_CODE_EXPIRY_DAYS = import.meta.env.VITE_INVITE_CODE_EXPIRY_DAYS || 30;

  useEffect(() => {
    // Recuperar usuario del localStorage
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const savedInviteCodes = localStorage.getItem(INVITE_CODES_STORAGE_KEY);
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedInviteCodes) {
      setInviteCodes(JSON.parse(savedInviteCodes));
    } else {
      // Inicializar con algunos códigos de ejemplo (solo para desarrollo)
      const exampleCodes = [
        {
          code: 'BM-ADMIN123',
          createdBy: SUPERADMIN_EMAIL,
          createdByName: 'Superadmin',
          note: 'Código de ejemplo para desarrollo',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
          used: false,
          usedBy: null,
          usedAt: null
        }
      ];
      setInviteCodes(exampleCodes);
      localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(exampleCodes));
    }
    
    setLoading(false);
  }, []);

  // Función para generar un código único
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `BM-${code}`;
  };

  // Crear un nuevo código de invitación (solo para superadmin)
  const createInviteCode = (note = '') => {
    if (!user || user.role !== 'superadmin') {
      throw new Error('No autorizado: Solo el superadmin puede crear códigos de invitación');
    }

    const newCode = {
      code: generateInviteCode(),
      createdBy: user.email,
      createdByName: user.name || user.email,
      note: note,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (INVITE_CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)).toISOString(),
      used: false,
      usedBy: null,
      usedAt: null
    };

    const updatedCodes = [...inviteCodes, newCode];
    setInviteCodes(updatedCodes);
    localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(updatedCodes));
    
    return newCode;
  };

  // Validar un código de invitación
  const validateInviteCode = (code) => {
    const inviteCode = inviteCodes.find(inv => inv.code === code);
    
    if (!inviteCode) {
      return { valid: false, message: 'Código de invitación inválido' };
    }
    
    if (inviteCode.used) {
      return { valid: false, message: 'Este código ya ha sido utilizado' };
    }
    
    if (new Date(inviteCode.expiresAt) < new Date()) {
      return { valid: false, message: 'Este código ha expirado' };
    }
    
    return { valid: true, message: 'Código válido', data: inviteCode };
  };

  // Marcar un código como usado
  const markInviteCodeAsUsed = (code, usedByEmail) => {
    const updatedCodes = inviteCodes.map(inv => {
      if (inv.code === code) {
        return {
          ...inv,
          used: true,
          usedBy: usedByEmail,
          usedAt: new Date().toISOString()
        };
      }
      return inv;
    });
    
    setInviteCodes(updatedCodes);
    localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(updatedCodes));
  };

  // Obtener códigos de invitación (solo para superadmin)
  const getInviteCodes = () => {
    if (!user || user.role !== 'superadmin') {
      return [];
    }
    return inviteCodes;
  };

  // Eliminar un código de invitación (solo para superadmin)
  const deleteInviteCode = (code) => {
    if (!user || user.role !== 'superadmin') {
      throw new Error('No autorizado');
    }
    
    const updatedCodes = inviteCodes.filter(inv => inv.code !== code);
    setInviteCodes(updatedCodes);
    localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(updatedCodes));
    return { success: true };
  };

  const login = (email, password) => {
    // Verificar si es superadmin
    if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
      const superadminUser = {
        id: 'superadmin-001',
        email: SUPERADMIN_EMAIL,
        name: 'Super Administrador',
        role: 'superadmin',
        avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=805AD5&color=fff',
        location: 'La Paz, Bolivia',
        phone: '+591 0000000'
      };
      
      setUser(superadminUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(superadminUser));
      return { success: true, user: superadminUser };
    }

    // Usuarios de prueba (simulación)
    const mockUsers = {
      admin: {
        id: 'admin-001',
        email: 'admin@bolivianmarket.com',
        name: 'Administrador',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+BM&background=805AD5&color=fff',
        location: 'La Paz, Bolivia',
        phone: '+591 1234567'
      },
      user: {
        id: 'user-001',
        email: 'cliente@bolivia.com',
        name: 'Juan Pérez',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Juan+P&background=0BC5EA&color=fff',
        location: 'Santa Cruz, Bolivia',
        phone: '+591 7654321'
      }
    };

    // Simular login
    let loggedUser;
    
    if (email === mockUsers.admin.email && password === 'admin123') {
      loggedUser = mockUsers.admin;
    } else if (email === mockUsers.user.email && password === 'cliente123') {
      loggedUser = mockUsers.user;
    } else {
      // Buscar usuario registrado
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const existingUser = existingUsers.find(u => u.email === email);
      
      if (existingUser) {
        loggedUser = existingUser;
      } else {
        // Usuario demo
        loggedUser = {
          id: `demo-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'user',
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=48BB78&color=fff`,
          location: 'Bolivia'
        };
      }
    }

    setUser(loggedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    return { success: true, user: loggedUser };
  };

  const register = (userData) => {
    const { inviteCode, ...userInfo } = userData;
    let userRole = 'user';
    
    // Verificar si se proporcionó un código de invitación válido
    if (inviteCode) {
      const validation = validateInviteCode(inviteCode);
      if (validation.valid) {
        userRole = 'admin';
        // Marcar el código como usado
        markInviteCodeAsUsed(inviteCode, userInfo.email);
      }
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userInfo,
      role: userRole,
      avatar: `https://ui-avatars.com/api/?name=${userInfo.name}&background=${userRole === 'admin' ? '805AD5' : 'ED8936'}&color=fff`,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    
    // Guardar en lista de usuarios
    const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...existingUsers, newUser]));
    
    return { 
      success: true, 
      user: newUser,
      message: userRole === 'admin' 
        ? '¡Registro exitoso como administrador!' 
        : '¡Registro exitoso!'
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    // Actualizar también en la lista de usuarios
    const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const updatedUsers = existingUsers.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    
    return { success: true, user: updatedUser };
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      createInviteCode,
      validateInviteCode,
      getInviteCodes,
      deleteInviteCode,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin', // ← ¡CORREGIDO AQUÍ!
      isSuperadmin: user?.role === 'superadmin',
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};