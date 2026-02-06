import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getToken, removeToken, User } from '@/lib/api';

type AppRole = 'admin' | 'user';

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = getToken();
      
      if (token) {
        try {
          const { data, error } = await authApi.getMe();
          
          if (data?.user && !error) {
            setUser(data.user);
            setRole(data.user.role);
          } else {
            // Token invalid, clear it
            removeToken();
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error('Session check failed:', err);
          removeToken();
          setUser(null);
          setRole(null);
        }
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await authApi.login(email, password);
      
      if (error) {
        return { error };
      }
      
      if (data?.user) {
        setUser(data.user);
        setRole(data.user.role);
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await authApi.signup(email, password, fullName);
      
      if (error) {
        return { error };
      }
      
      if (data?.user) {
        setUser(data.user);
        setRole(data.user.role);
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await authApi.logout();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: null, // Kept for compatibility, not used
        role,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAdmin: role === 'admin',
      } as AuthContextType & { session: null }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
