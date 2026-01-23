// frontend/src/context/AuthContext.jsx - VERSIÓN CORREGIDA
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

  // DEBUG: Mostrar variables de entorno al cargar
  console.log('=== AUTH CONTEXT DEBUG ===');
  console.log('VITE_SUPERADMIN_EMAIL desde env:', import.meta.env.VITE_SUPERADMIN_EMAIL);
  console.log('VITE_SUPERADMIN_PASSWORD desde env:', import.meta.env.VITE_SUPERADMIN_PASSWORD ? 'DEFINIDA' : 'NO DEFINIDA');
  console.log('=== FIN DEBUG ===');

  // Credenciales de superadmin
  const SUPERADMIN_EMAIL = import.meta.env.VITE_SUPERADMIN_EMAIL || 'superadmin@bolivianmarket.com';
  const SUPERADMIN_PASSWORD = import.meta.env.VITE_SUPERADMIN_PASSWORD || 'superadmin123';
  const INVITE_CODE_EXPIRY_DAYS = import.meta.env.VITE_INVITE_CODE_EXPIRY_DAYS || 30;

  useEffect(() => {
    console.log('🔧 AuthProvider montado');
    console.log('SUPERADMIN_EMAIL config:', SUPERADMIN_EMAIL);
    console.log('SUPERADMIN_PASSWORD config:', SUPERADMIN_PASSWORD ? '***' : 'UNDEFINED');
    
    // Recuperar usuario del localStorage
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const savedInviteCodes = localStorage.getItem(INVITE_CODES_STORAGE_KEY);
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Usuario recuperado:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } else {
      console.log('No hay usuario guardado en localStorage');
    }
    
    if (savedInviteCodes) {
      try {
        const parsedCodes = JSON.parse(savedInviteCodes);
        setInviteCodes(parsedCodes);
      } catch (error) {
        console.error('Error al parsear códigos:', error);
        localStorage.removeItem(INVITE_CODES_STORAGE_KEY);
      }
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
    console.log('=== LOGIN DEBUG INICIO ===');
    console.log('SUPERADMIN_EMAIL config:', SUPERADMIN_EMAIL);
    console.log('SUPERADMIN_PASSWORD config:', SUPERADMIN_PASSWORD);
    console.log('Email ingresado:', email);
    console.log('Password ingresado:', password);
    console.log('¿Email igual?', email === SUPERADMIN_EMAIL);
    console.log('¿Password igual?', password === SUPERADMIN_PASSWORD);
    
    // Verificar si es superadmin - COMPARACIÓN EXACTA
    const isSuperadmin = email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD;
    console.log('¿Es superadmin?', isSuperadmin);
    
    if (isSuperadmin) {
      console.log('✅ ¡ES SUPERADMIN! Creando usuario...');
      
      const superadminUser = {
        id: 'superadmin-001',
        email: SUPERADMIN_EMAIL,
        name: 'Super Administrador',
        role: 'superadmin',
        avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=805AD5&color=fff',
        location: 'La Paz, Bolivia',
        phone: '+591 0000000',
        createdAt: new Date().toISOString()
      };
      
      console.log('Usuario superadmin creado:', superadminUser);
      
      setUser(superadminUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(superadminUser));
      
      // Asegurarse que esté en la lista de usuarios
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const userExists = existingUsers.find(u => u.email === SUPERADMIN_EMAIL);
      
      if (!userExists) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...existingUsers, superadminUser]));
      }
      
      console.log('=== LOGIN DEBUG FIN - SUPERADMIN ===');
      return { success: true, user: superadminUser, isSuperadmin: true };
    }

    console.log('No es superadmin, buscando usuarios normales...');
    
    // Usuarios de prueba (simulación)
    const mockUsers = {
      admin: {
        id: 'admin-001',
        email: 'admin@bolivianmarket.com',
        name: 'Administrador',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+BM&background=805AD5&color=fff',
        location: 'La Paz, Bolivia',
        phone: '+591 1234567',
        createdAt: new Date().toISOString()
      },
      user: {
        id: 'user-001',
        email: 'cliente@bolivia.com',
        name: 'Juan Pérez',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Juan+P&background=0BC5EA&color=fff',
        location: 'Santa Cruz, Bolivia',
        phone: '+591 7654321',
        createdAt: new Date().toISOString()
      }
    };

    // Simular login
    let loggedUser;
    
    if (email === mockUsers.admin.email && password === 'admin123') {
      loggedUser = mockUsers.admin;
      console.log('✅ Usuario admin encontrado');
    } else if (email === mockUsers.user.email && password === 'cliente123') {
      loggedUser = mockUsers.user;
      console.log('✅ Usuario normal encontrado');
    } else {
      // Buscar usuario registrado
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const existingUser = existingUsers.find(u => u.email === email);
      
      if (existingUser) {
        // Si el usuario existe, verificar contraseña
        // NOTA: En un sistema real aquí habría hash de contraseñas
        loggedUser = existingUser;
        console.log('✅ Usuario existente encontrado:', loggedUser);
      } else {
        // Usuario demo - permitir login sin registro
        console.log('⚠️ Usuario no encontrado, creando demo...');
        loggedUser = {
          id: `demo-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'user',
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=48BB78&color=fff`,
          location: 'Bolivia',
          createdAt: new Date().toISOString()
        };
        
        // Guardar este usuario demo
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...existingUsers, loggedUser]));
      }
    }

    setUser(loggedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    
    console.log('=== LOGIN DEBUG FIN ===');
    return { success: true, user: loggedUser, isSuperadmin: false };
  };

  const register = (userData) => {
    console.log('=== REGISTER DEBUG ===');
    const { inviteCode, ...userInfo } = userData;
    let userRole = 'user';
    
    // Verificar si se proporcionó un código de invitación válido
    if (inviteCode) {
      console.log('Código de invitación proporcionado:', inviteCode);
      const validation = validateInviteCode(inviteCode);
      console.log('Validación del código:', validation);
      
      if (validation.valid) {
        userRole = 'admin';
        console.log('✅ Código válido - Asignando rol admin');
        // Marcar el código como usado
        markInviteCodeAsUsed(inviteCode, userInfo.email);
      } else {
        console.log('❌ Código inválido:', validation.message);
      }
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userInfo,
      role: userRole,
      avatar: `https://ui-avatars.com/api/?name=${userInfo.name}&background=${userRole === 'admin' ? '805AD5' : 'ED8936'}&color=fff`,
      createdAt: new Date().toISOString()
    };
    
    console.log('Nuevo usuario creado:', newUser);
    
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    
    // Guardar en lista de usuarios
    const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...existingUsers, newUser]));
    
    return { 
      success: true, 
      user: newUser,
      isAdmin: userRole === 'admin',
      message: userRole === 'admin' 
        ? '¡Registro exitoso como administrador!' 
        : '¡Registro exitoso!'
    };
  };

  const logout = () => {
    console.log('👋 Usuario cerrando sesión');
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    return { success: true };
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
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
      isSuperadmin: user?.role === 'superadmin',
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};