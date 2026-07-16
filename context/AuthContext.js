// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

async function api(method, url, body) {
  try {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`http://localhost:3000${url}`, opts);
    return res.json();
  } catch (e) {
    return { success: false, message: 'Cannot connect to server. Is the API running?' };
  }
}

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    refreshUser();
  }, []);

  async function refreshUser() {
    const data = await api('GET', '/api/auth/me');
    setUser(data?.user || null);
    setAuthLoading(false);
  }

  async function login(email, password) {
    const data = await api('POST', '/api/auth/login', { email, password });
    if (data?.success) setUser(data.user);
    return data;
  }

  async function register(name, email, password, phone) {
    const data = await api('POST', '/api/auth/register', { name, email, password, phone });
    if (data?.success) setUser(data.user);
    return data;
  }

  async function logout() {
    await api('POST', '/api/auth/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user, authLoading, isLoggedIn: !!user,
      login, register, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
