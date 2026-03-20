const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '').replace(/\/api$/, '');

export { API_ORIGIN };
export const API_BASE_URL = `${API_ORIGIN}/api`;

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getCurrentShop() {
  if (typeof window === 'undefined') return null;

  const rawCurrentShop = localStorage.getItem('currentShop');
  if (rawCurrentShop) {
    try {
      return JSON.parse(rawCurrentShop);
    } catch {}
  }

  const rawSelectedShopId = localStorage.getItem('selectedShopId');
  const rawUser = localStorage.getItem('user');
  if (rawSelectedShopId && rawUser) {
    try {
      const user = JSON.parse(rawUser);
      const shop = user?.shops?.find?.((item) => item.id === rawSelectedShopId);
      if (shop) return shop;
    } catch {}
  }

  return null;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export function ensureShopSelected(router) {
  const shop = getCurrentShop();
  if (!shop && router) {
    router.push('/shops');
  }
  return shop;
}
