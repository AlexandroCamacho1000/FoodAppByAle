import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

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

  const USER_STORAGE_KEY = 'bolivian_market_user';
  const TOKEN_STORAGE_KEY = 'token';
  const USERS_STORAGE_KEY = 'bolivian_market_users';
  const INVITE_CODES_STORAGE_KEY = 'bolivian_market_invite_codes';

  
  const SUPERADMIN_EMAIL = import.meta.env.VITE_SUPERADMIN_EMAIL || 'superadmin@bolivianmarket.com';
  const SUPERADMIN_PASSWORD = import.meta.env.VITE_SUPERADMIN_PASSWORD || 'superadmin123';
  const INVITE_CODE_EXPIRY_DAYS = import.meta.env.VITE_INVITE_CODE_EXPIRY_DAYS || 30;

  useEffect(() => {
   
    
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const savedInviteCodes = localStorage.getItem(INVITE_CODES_STORAGE_KEY);
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    
    if (savedInviteCodes) {
      try {
        const parsedCodes = JSON.parse(savedInviteCodes);
        setInviteCodes(parsedCodes);
      } catch {
        localStorage.removeItem(INVITE_CODES_STORAGE_KEY);
      }
    } else {
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

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `BM-${code}`;
  };

  // Crear un nuevo código de invitación (solo para superadmin)
  const createInviteCode = async (note = '') => {
    if (!user || user.role !== 'superadmin') {
      throw new Error('No autorizado');
    }
    try {
      const response = await api.post('/invites/create', { note });
      const { invite } = response.data;
      const newCode = {
        code: invite.code,
        createdBy: user.email,
        createdByName: user.name,
        note: note,
        createdAt: invite.createdAt,
        expiresAt: invite.expiresAt,
        used: false,
        usedBy: null,
        usedAt: null
      };
      const updatedCodes = [...inviteCodes, newCode];
      setInviteCodes(updatedCodes);
      localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(updatedCodes));
      return newCode;
    } catch {
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
    }
  };

  // Validar un código de invitación
  const validateInviteCode = async (code) => {
    try {
      const response = await api.post('/invites/validate', { code });
      if (response.data.valid) {
        return { valid: true, message: 'Código válido' };
      }
      return { valid: false, message: response.data.message };
    } catch {
      const inviteCode = inviteCodes.find(inv => inv.code === code);
      if (!inviteCode) return { valid: false, message: 'Código inválido' };
      if (inviteCode.used) return { valid: false, message: 'Este código ya ha sido utilizado' };
      if (new Date(inviteCode.expiresAt) < new Date()) return { valid: false, message: 'Este código ha expirado' };
      return { valid: true, message: 'Código válido', data: inviteCode };
    }
  };

  // Marcar un código como usado
  const markInviteCodeAsUsed = async (code, usedByEmail) => {
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
  const getInviteCodes = async () => {
    if (!user || user.role !== 'superadmin') return [];
    try {
      const response = await api.get('/invites/');
      const formatted = response.data.invites.map(inv => ({
        code: inv.code,
        createdBy: user.email,
        createdByName: user.name,
        note: '',
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
        used: inv.used,
        usedBy: inv.usedBy,
        usedAt: inv.usedAt
      }));
      setInviteCodes(formatted);
      localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(formatted));
      return formatted;
    } catch {
      return inviteCodes;
    }
  };

  // Eliminar un código de invitación (solo para superadmin)
  const deleteInviteCode = async (code) => {
    if (!user || user.role !== 'superadmin') throw new Error('No autorizado');
    try {
      await api.delete(`/invites/${code}`);
      const updatedCodes = inviteCodes.filter(inv => inv.code !== code);
      setInviteCodes(updatedCodes);
      localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(updatedCodes));
      return { success: true };
    } catch {
      const updatedCodes = inviteCodes.filter(inv => inv.code !== code);
      setInviteCodes(updatedCodes);
      localStorage.setItem(INVITE_CODES_STORAGE_KEY, JSON.stringify(updatedCodes));
      return { success: true };
    }
  };

  const login = async (email, password) => {
    
    
    try {
     
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      if (data.token && data.user) {
       
        
        const userData = {
          ...data.user,
          id: data.user.id || `user-${Date.now()}`,
          avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || data.user.email.split('@')[0])}&background=${data.user.role === 'superadmin' ? '805AD5' : data.user.role === 'admin' ? '0BC5EA' : '48BB78'}&color=fff`
        };
        
        setUser(userData);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        
        
        return { 
          success: true, 
          user: userData, 
          isSuperadmin: data.user.role === 'superadmin',
          isAdmin: data.user.role === 'admin' || data.user.role === 'superadmin',
          token: data.token 
        };
      }
      
      throw new Error('Respuesta inválida del servidor');
      
    } catch {
      const mockUsers = {
        superadmin: {
          id: 'superadmin-001',
          email: SUPERADMIN_EMAIL,
          name: 'Super Administrador',
          role: 'superadmin',
          avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=805AD5&color=fff',
          location: 'La Paz, Bolivia',
          phone: '+591 0000000',
          createdAt: new Date().toISOString()
        },
        cliente: {
          id: 'user-001',
          email: 'cliente@test.com',
          name: 'Juan Cliente',
          role: 'user',
          avatar: 'https://ui-avatars.com/api/?name=Juan+C&background=0BC5EA&color=fff',
          location: 'Santa Cruz, Bolivia',
          phone: '+591 7654321',
          createdAt: new Date().toISOString()
        }
      };

      let loggedUser = null;
      
      if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
        loggedUser = mockUsers.superadmin;
       
      } else if (email === 'cliente@test.com' && password === 'cliente123') {
        loggedUser = mockUsers.cliente;
        
      } else if (email === 'superadmin@bolivianmarket.com' && password === 'superadmin123') {
        loggedUser = mockUsers.superadmin;
      
      } else {
        
        return { success: false, error: 'Credenciales incorrectas' };
      }

      setUser(loggedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, `mock-token-${loggedUser.role}`);
      
     
      return { 
        success: true, 
        user: loggedUser, 
        isSuperadmin: loggedUser.role === 'superadmin',
        isAdmin: loggedUser.role === 'admin' || loggedUser.role === 'superadmin',
        token: `mock-token-${loggedUser.role}`
      };
    }
  };

  const register = async (userData) => {
    
    
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data;

      if (data.token && data.user) {
        const userData = {
          ...data.user,
          avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || data.user.email.split('@')[0])}&background=48BB78&color=fff`
        };
        
        setUser(userData);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        
        return { success: true, user: userData, token: data.token };
      }
      
    } catch {
      const { inviteCode, ...userInfo } = userData;
      let userRole = 'user';
      
      if (inviteCode) {
        
        const validation = await validateInviteCode(inviteCode);
        
        if (validation.valid) {
          userRole = 'admin';
          markInviteCodeAsUsed(inviteCode, userInfo.email);
        }
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        ...userInfo,
        role: userRole,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=${userRole === 'admin' ? '805AD5' : 'ED8936'}&color=fff`,
        createdAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, `mock-token-${userRole}`);
      
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...existingUsers, newUser]));
      
      return { 
        success: true, 
        user: newUser,
        isAdmin: userRole === 'admin',
        message: userRole === 'admin' 
          ? '¡Registro exitoso como administrador!' 
          : '¡Registro exitoso!',
        token: `mock-token-${userRole}`
      };
    }
  };

  const logout = () => {
    
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return { success: true };
  };

  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token || token.startsWith('mock-token-')) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        
        const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const updatedUsers = existingUsers.map(u => 
          u.id === updatedUser.id ? updatedUser : u
        );
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        
        return { success: true, user: updatedUser };
      }
      
      const response = await api.put('/auth/profile', updatedData);
      const data = response.data;
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const validateToken = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (!token || token.startsWith('mock-token-')) {
      return { valid: !!user, isMock: true };
    }
    
    try {
      await api.get('/auth/validate');
      return { valid: true, isMock: false };
    } catch (error) {
      return { valid: false, isMock: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      validateToken,
      createInviteCode,
      validateInviteCode,
      getInviteCodes,
      deleteInviteCode,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
      isSuperadmin: user?.role === 'superadmin',
      loading,
      token: localStorage.getItem(TOKEN_STORAGE_KEY)
    }}>
      {children}
    </AuthContext.Provider>
  );
};