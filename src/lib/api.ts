// Simple API client for Expo React Native
import appConfig from '../../app.json';
import { Platform } from 'react-native';

const extra = appConfig?.expo?.extra || {} as any;
const platformBase = Platform.OS === 'android' ? extra.API_BASE_URL_ANDROID
  : Platform.OS === 'ios' ? extra.API_BASE_URL_IOS
  : Platform.OS === 'web' ? extra.API_BASE_URL_WEB
  : undefined;
// Prefer the global API_BASE_URL. If absent, fall back to platform-specific.
const BASE_URL = (extra.API_BASE_URL || platformBase || '') as string;
let CURRENT_BASE_URL: string = BASE_URL;
const PROFILE_UPDATE_PATH = extra.PROFILE_UPDATE_PATH || '/users/me';
const PROFILE_UPDATE_METHOD = (extra.PROFILE_UPDATE_METHOD || 'PUT') as string;
const PROFILE_USER_PATH = extra.PROFILE_USER_PATH || PROFILE_UPDATE_PATH;
const REQUEST_TIMEOUT_MS: number = Number(extra.REQUEST_TIMEOUT_MS || 10000);
const DISCOVERY_PORT: number = Number(extra.API_DISCOVERY_PORT || 5000);
let AUTH_TOKEN: string | null = null;

if (__DEV__) {
  // Log base configuration once
  // eslint-disable-next-line no-console
  console.log('API config:', { BASE_URL, PROFILE_UPDATE_PATH, PROFILE_UPDATE_METHOD, REQUEST_TIMEOUT_MS });
}

type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

function resolvePath(pathTemplate: string, params?: Record<string, string>) {
  if (!params) return pathTemplate;
  return pathTemplate.replace(/:([a-zA-Z_]\w*)/g, (_, key) => encodeURIComponent(params[key] ?? `:${key}`));
}

async function request(path: string, { method = 'GET', body, headers = {} }: RequestOptions = {}) {
  if (!BASE_URL) {
    throw new Error('Configura expo.extra.API_BASE_URL en app.json');
  }
  const base = CURRENT_BASE_URL || BASE_URL;
  const url = path.startsWith('http') ? path : `${base}${path}`;
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('API request:', method, url);
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (AUTH_TOKEN) {
    reqHeaders['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  // Add timeout using AbortController
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal as any,
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error(`Timeout de solicitud (${REQUEST_TIMEOUT_MS} ms) hacia ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }

  if (!res.ok) {
    const status = res.status;
    const bodyMsg = (data && (data.message || data.error)) || (typeof data === 'string' ? data : '') || res.statusText || '';
    const message = `[${status}] ${bodyMsg || 'Error de red'}`;
    const err = new Error(message) as Error & { status?: number; data?: any };
    err.status = status;
    err.data = data;
    throw err;
  }

  return data as any;
}

export const getBaseUrl = () => (CURRENT_BASE_URL || BASE_URL) as string;

async function healthCheck(base: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Math.min(REQUEST_TIMEOUT_MS, 3000));
    const res = await fetch(`${base}/test`, { method: 'GET', signal: controller.signal as any });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

function candidateScanFrom(base: string): string[] {
  const m = /^https?:\/\/(\d+)\.(\d+)\.(\d+)\.(\d+)(?::(\d+))?$/i.exec(base);
  if (!m) return [];
  const a = Number(m[1]); const b = Number(m[2]); const c = Number(m[3]); const d = Number(m[4]);
  const port = Number(m[5] || DISCOVERY_PORT);
  const prefix = `http://${a}.${b}.${c}.`;
  const list: string[] = [];
  for (let i = 2; i <= 30; i++) {
    if (i === d) continue;
    list.push(`${prefix}${i}:${port}`);
  }
  // Emulator handy candidate
  if (Platform.OS === 'android') list.unshift(`http://10.0.2.2:${port}`);
  return list;
}

export async function ensureBaseUrlHealthy(): Promise<string | null> {
  const base = CURRENT_BASE_URL || BASE_URL;
  if (await healthCheck(base)) return base;
  const extrasList: string[] = [];
  if (platformBase) extrasList.push(platformBase);
  if (extra.API_BASE_URL) extrasList.push(extra.API_BASE_URL);
  if (extra.API_BASE_URL_ANDROID && Platform.OS === 'android') extrasList.push(extra.API_BASE_URL_ANDROID);
  if (extra.API_BASE_URL_IOS && Platform.OS === 'ios') extrasList.push(extra.API_BASE_URL_IOS);
  if (extra.API_BASE_URL_WEB && Platform.OS === 'web') extrasList.push(extra.API_BASE_URL_WEB);
  const scan = candidateScanFrom(base);
  const candidates = [...new Set([...extrasList, ...scan])].filter(Boolean);
  for (const cand of candidates) {
    if (await healthCheck(cand)) {
      CURRENT_BASE_URL = cand;
      if (__DEV__) console.log('API base switched to', cand);
      return cand;
    }
  }
  return null;
}

export const api = {
  get: (path: string, headers?: Record<string, string>) => request(path, { method: 'GET', headers }),
  post: (path: string, body?: any, headers?: Record<string, string>) => request(path, { method: 'POST', body, headers }),
  put: (path: string, body?: any, headers?: Record<string, string>) => request(path, { method: 'PUT', body, headers }),
  del: (path: string, headers?: Record<string, string>) => request(path, { method: 'DELETE', headers }),

  // Auth token helpers
  setAuthToken: (token: string | null) => { AUTH_TOKEN = token || null; },

  // Ajusta estas rutas a tu API real
  signIn: (email: string, password: string) => request('/auth/login', { method: 'POST', body: { email, password } }),
  signUp: (name: string, email: string, password: string) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  updateProfile: (profile: any, userId?: string) =>
    request(resolvePath(PROFILE_UPDATE_PATH, { id: userId ?? '' }), { method: PROFILE_UPDATE_METHOD, body: profile }),
  getUser: (userId: string) => request(resolvePath(PROFILE_USER_PATH, { id: userId }), { method: 'GET' }),
};
