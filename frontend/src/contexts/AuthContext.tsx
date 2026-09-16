import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser, Role } from '../types';

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, role: Role, userData?: Partial<AuthUser>) => void;
  logout: () => void;
  setUserFromToken: (token: string, role: Role) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUserFromToken = (token: string, role: Role) => {
    const payload = JSON.parse(atob(token.split('.')[1] || '{}'));
    setAccessToken(token);
    localStorage.setItem('accessToken', token);

    setUser({
      id: payload.id ?? payload.sub ?? '',
      role,
      emailAddress: payload.emailAddress,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });
  };

  const login = (token: string, role: Role, userData?: Partial<AuthUser>) => {
    setUserFromToken(token, role);
    if (userData) {
      setUser((prev) => ({
        ...(prev ?? { id: '', role }),
        ...userData,
        role,
      }));
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    document.cookie = 'refreshToken=; Max-Age=0; path=/';
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || '{}'));
      setUser({
        id: payload.id ?? '',
        role: payload.role ?? 2,
      });
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      isLoading,
      login,
      logout,
      setUserFromToken,
    }),
    [user, accessToken, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
