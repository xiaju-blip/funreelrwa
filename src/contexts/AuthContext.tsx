import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  vipLevel: number;
  vip_expire_at?: string;
  points: number;
  tokenBalance: number;
  inviteCode?: string;
  wallet_address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithWallet: (address: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const googleUser = localStorage.getItem('funreel_user');
      if (googleUser) {
        const parsed = JSON.parse(googleUser);
        if (parsed.id) {
          const { data } = await supabase.from('users').select('*').eq('id', parsed.id).single();
          if (data) {
            setUser({
              ...parsed,
              vipLevel: data.vip_level || 0,
              vip_expire_at: data.vip_expire_at || undefined,
              inviteCode: data.invite_code || '',
              wallet_address: data.wallet_address || '',
            });
            localStorage.setItem('funreel_user', JSON.stringify({
              ...parsed,
              vipLevel: data.vip_level || 0,
              vip_expire_at: data.vip_expire_at || undefined,
              inviteCode: data.invite_code || '',
              wallet_address: data.wallet_address || '',
            }));
          } else {
            setUser(parsed);
          }
        } else {
          setUser(parsed);
        }
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUser(session.user.id);
      }
      setLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUser(session.user.id);
      } else {
        const googleUser = localStorage.getItem('funreel_user');
        if (!googleUser) {
          setUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async (userId: string) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) {
      setUser({
        id: data.id,
        email: data.email || '',
        nickname: data.nickname,
        avatar: data.avatar,
        vipLevel: data.vip_level || 0,
        vip_expire_at: data.vip_expire_at || undefined,
        points: data.points || 0,
        tokenBalance: data.token_balance || 0,
        inviteCode: data.invite_code || '',
              wallet_address: data.wallet_address || '',
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      throw new Error('用户不存在');
    }

    const { data: verifyData } = await supabase.rpc('verify_password', {
      password_hash: data.password_hash,
      password: password
    });

    if (!verifyData) {
      throw new Error('密码错误');
    }

    const userData = {
      id: data.id,
      email: data.email || '',
      nickname: data.nickname,
      avatar: data.avatar,
      vipLevel: data.vip_level || 0,
      vip_expire_at: data.vip_expire_at || undefined,
      points: data.points || 0,
      tokenBalance: data.token_balance || 0,
      inviteCode: data.invite_code || '',
              wallet_address: data.wallet_address || '',
    };

    localStorage.setItem('funreel_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(async (email: string, password: string, nickname: string) => {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new Error('该邮箱已被注册');
    }

    const { data: hashData } = await supabase.rpc('hash_password', {
      password: password
    });

    const { error } = await supabase.from('users').insert({
      email,
      nickname,
      password_hash: hashData,
      invite_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      vip_level: 0,
      points: 0,
      token_balance: 0,
      status: 1,
    });

    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('funreel_user');
    setUser(null);
  }, []);

  const loginWithWallet = useCallback(async (address: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'wallet',
      options: { queryParams: { address } }
    });
    if (error) throw error;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const clientId = '44396937707-nb6rjbi61i8klkpi3dh7u29t2qbf92p8.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/auth/callback';
    const scope = 'openid email profile';

    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('google_oauth_state', state);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=token id_token&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `nonce=${Math.random().toString(36).substring(2, 15)}`;

    window.location.href = authUrl;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithWallet, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
