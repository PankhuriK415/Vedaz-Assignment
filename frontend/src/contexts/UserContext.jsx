import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vedazUser')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('vedazUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('vedazUser');
    }
  }, [user]);

  const login = async ({ email, password }) => {
    const response = await axios.post('https://vedaz-assignment-2.onrender.com/users/login', { email, password });
    setUser(response.data);
    return response.data;
  };

  const register = async ({ name, email, password }) => {
    const response = await axios.post('https://vedaz-assignment-2.onrender.com/users/register', { name, email, password });
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};
