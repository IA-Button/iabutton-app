import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../lib/api';

export type User = {
  id?: string;
  email: string;
  name?: string;
  plan?: string;
  model?: string;
  mac?: string;
  [key: string]: any;
};

type AuthContextValue = {
  user: User | null;
  setUser: (u: User | null) => void;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signOut: () => void;
  isProfileComplete: boolean;
  isUserProfileComplete: (u?: User | null) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeUser(payload: any, fallback: Partial<User> = {}): User {
  const candidate = payload?.user ?? payload?.data?.user ?? payload ?? {};
  const email = candidate.email ?? fallback.email ?? '';
  const name = candidate.name ?? fallback.name;
  const rawId = candidate.id ?? candidate._id;
  const id = typeof rawId === 'string' ? rawId : (rawId && rawId.toString ? rawId.toString() : undefined);
  return { id, email, name, ...candidate } as User;
}

function profileIsComplete(u?: User | null): boolean {
  if (!u) return false;
  const requiredKeys: Array<keyof User> = ['email', 'name', 'plan', 'model', 'mac'];
  return requiredKeys.every((k) => {
    const v = (u as any)[k];
    if (typeof v === 'string') return v.trim().length > 0;
    return !!v;
  });
}

function extractToken(payload: any): string | null {
  if (!payload) return null;
  const candidates = [
    payload?.token,
    payload?.accessToken,
    payload?.access_token,
    payload?.jwt,
    payload?.data?.token,
    payload?.data?.accessToken,
  ];
  for (const t of candidates) {
    if (typeof t === 'string' && t.trim()) return t;
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isProfileComplete = useMemo(() => profileIsComplete(user), [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api.signIn(email, password);
    const token = extractToken(res);
    if (token) api.setAuthToken(token);
    let nextUser = normalizeUser(res, { email });
    try {
      if (nextUser?.id) {
        const full = await api.getUser(nextUser.id);
        nextUser = normalizeUser(full, nextUser);
      }
    } catch (_) {
      // si falla, seguimos con datos del login
    }
    setUser(nextUser);
    return nextUser;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.signUp(name, email, password);
    const token = extractToken(res);
    if (token) api.setAuthToken(token);
    let nextUser = normalizeUser(res, { email, name });
    try {
      if (nextUser?.id) {
        const full = await api.getUser(nextUser.id);
        nextUser = normalizeUser(full, nextUser);
      }
    } catch (_) {}
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    api.setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, signIn, signUp, signOut, isProfileComplete, isUserProfileComplete: profileIsComplete }),
    [user, signIn, signUp, signOut, isProfileComplete]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
