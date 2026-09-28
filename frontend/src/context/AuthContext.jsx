import { createContext, useContext, useState } from 'react';
import api, { getErrorMessage } from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Keep the logged-in user in localStorage so a page refresh does not log you out.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('booksWorldUser');
    return stored ? JSON.parse(stored) : null;
  });

  const save = (data) => {
    localStorage.setItem('booksWorldUser', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    save(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    save(data);
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    save(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('booksWorldUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, getErrorMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
