// Simple API client for Expo React Native
import appConfig from '../../app.json';

const BASE_URL = appConfig?.expo?.extra?.API_BASE_URL || '';

type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

async function request(path: string, { method = 'GET', body, headers = {} }: RequestOptions = {}) {
  if (!BASE_URL) {
    throw new Error('Configura expo.extra.API_BASE_URL en app.json');
  }
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || 'Error de red';
    const err = new Error(message) as Error & { status?: number; data?: any };
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as any;
}

export const api = {
  get: (path: string, headers?: Record<string, string>) => request(path, { method: 'GET', headers }),
  post: (path: string, body?: any, headers?: Record<string, string>) => request(path, { method: 'POST', body, headers }),
  put: (path: string, body?: any, headers?: Record<string, string>) => request(path, { method: 'PUT', body, headers }),
  del: (path: string, headers?: Record<string, string>) => request(path, { method: 'DELETE', headers }),

  // Ajusta estas rutas a tu API real
  signIn: (email: string, password: string) => request('/auth/login', { method: 'POST', body: { email, password } }),
  signUp: (name: string, email: string, password: string) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
};
