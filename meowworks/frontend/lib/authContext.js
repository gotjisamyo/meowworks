import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState([]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data.user);
      
      // Load shops if user has shops
      if (response.data.shops) {
        setShops(response.data.shops);
        const savedShopId = localStorage.getItem('selectedShopId');
        if (savedShopId) {
          const shop = response.data.shops.find(s => s.id === savedShopId);
          if (shop) setSelectedShop(shop);
        } else if (response.data.shops.length > 0) {
          setSelectedShop(response.data.shops[0]);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user, shops } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setShops(shops || []);
      
      if (shops && shops.length > 0) {
        setSelectedShop(shops[0]);
        localStorage.setItem('selectedShopId', shops[0].id);
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, shopName) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        shopName,
      });

      const { token, user, shop } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setShops(shop ? [shop] : []);
      if (shop) {
        setSelectedShop(shop);
        localStorage.setItem('selectedShopId', shop.id);
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedShopId');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setShops([]);
    setSelectedShop(null);
    router.push('/login');
  };

  const selectShop = (shop) => {
    setSelectedShop(shop);
    localStorage.setItem('selectedShopId', shop.id);
  };

  const createShop = async (shopData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/shops`, shopData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newShop = response.data.shop;
      setShops(prev => [...prev, newShop]);
      setSelectedShop(newShop);
      localStorage.setItem('selectedShopId', newShop.id);
      
      return { success: true, shop: newShop };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create shop';
      return { success: false, error: message };
    }
  };

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/shops`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(response.data.shops);
      return { success: true, shops: response.data.shops };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        shops,
        selectedShop,
        selectShop,
        createShop,
        fetchShops,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
