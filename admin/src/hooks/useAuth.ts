import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  vipLevel: number;
  isAdmin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!data || data.vip_level < 9) {
      throw new Error('无权访问后台');
    }

    const userData = {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      avatar: data.avatar,
      vipLevel: data.vip_level,
      isAdmin: data.vip_level >= 9,
    };

    localStorage.setItem('admin_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_user');
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
