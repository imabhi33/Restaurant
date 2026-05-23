import { createContext, useState, useCallback } from 'react';
import { adminAuthService } from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await adminAuthService.login(email, password);
      if (response.data.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      setAdmin(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('admin_token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('admin_token');
  }, []);

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!admin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
