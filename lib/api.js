import axios from 'axios';

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '').replace(/\/api$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Dashboard Stats API
export const getDashboardStats = async () => {
  // Mock data for demo
  return {
    totalChats: 1247,
    totalOrders: 356,
    totalCustomers: 892,
    activeAgents: 5,
    todayChats: 89,
    todayOrders: 23,
    weeklyGrowth: 12.5,
  };
};

// Agents API
export const getAgents = async () => {
  // Mock data for demo
  return [
    {
      id: '1',
      name: 'Sales Agent',
      description: 'Handles sales inquiries and product recommendations',
      status: 'active',
      type: 'sales',
      chatsToday: 45,
      avgResponseTime: '2.3s',
      successRate: 92,
    },
    {
      id: '2',
      name: 'Support Agent',
      description: 'Customer support and troubleshooting',
      status: 'active',
      type: 'support',
      chatsToday: 32,
      avgResponseTime: '3.1s',
      successRate: 88,
    },
    {
      id: '3',
      name: 'Order Agent',
      description: 'Order processing and tracking',
      status: 'active',
      type: 'orders',
      chatsToday: 28,
      avgResponseTime: '1.8s',
      successRate: 95,
    },
    {
      id: '4',
      name: 'FAQ Bot',
      description: 'Answers frequently asked questions',
      status: 'paused',
      type: 'faq',
      chatsToday: 0,
      avgResponseTime: '0.5s',
      successRate: 98,
    },
  ];
};

export const updateAgentStatus = async (agentId, status) => {
  // Mock update
  return { id: agentId, status };
};

export const createAgent = async (agentData) => {
  // Mock create
  return { id: Date.now().toString(), ...agentData, status: 'active' };
};

export const deleteAgent = async (agentId) => {
  // Mock delete
  return { success: true, id: agentId };
};

// Orders API
export const getOrders = async () => {
  // Mock data for demo
  return [
    {
      id: 'ORD-001',
      customer: 'สมชาย ใจดี',
      phone: '089-123-4567',
      product: 'Package A',
      amount: 2990,
      status: 'completed',
      date: '2024-03-14T10:30:00Z',
      agent: 'Order Agent',
    },
    {
      id: 'ORD-002',
      customer: 'วรรณา สาวสวย',
      phone: '086-987-6543',
      product: 'Package B',
      amount: 4990,
      status: 'pending',
      date: '2024-03-14T11:15:00Z',
      agent: 'Sales Agent',
    },
    {
      id: 'ORD-003',
      customer: 'ประเสริฐ มาดี',
      phone: '081-555-1234',
      product: 'Package A',
      amount: 2990,
      status: 'completed',
      date: '2024-03-13T16:45:00Z',
      agent: 'Order Agent',
    },
    {
      id: 'ORD-004',
      customer: 'นภา ใจงาม',
      phone: '090-222-3333',
      product: 'Package C',
      amount: 7990,
      status: 'processing',
      date: '2024-03-14T09:00:00Z',
      agent: 'Sales Agent',
    },
    {
      id: 'ORD-005',
      customer: 'ธนกฤต ช่างเหลี่ยม',
      phone: '087-444-5555',
      product: 'Package B',
      amount: 4990,
      status: 'cancelled',
      date: '2024-03-12T14:20:00Z',
      agent: 'Support Agent',
    },
  ];
};

export const updateOrderStatus = async (orderId, status) => {
  return { id: orderId, status };
};

// Settings API
export const getLineSettings = async () => {
  return {
    channelId: '1234567890',
    channelSecret: '••••••••••••••••',
    channelAccessToken: '••••••••••••••••••••••••',
    webhookUrl: 'https://api.example.com/webhook/line',
    autoReply: true,
    richMenuId: 'rich-menu-001',
  };
};

export const updateLineSettings = async (settings) => {
  return { success: true, ...settings };
};

export default api;
