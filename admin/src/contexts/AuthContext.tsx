import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  vipLevel: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const login = useCallback(async (email: string, password: string) => {
    console.log('[Login] 开始登录流程，邮箱:', email);
    console.log('[Login] supabase 类型:', typeof supabase);
    console.log('[Login] supabase.from 类型:', typeof supabase.from);
    
    const { data, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    console.log('[Login] 查询结果 - data:', data, 'error:', queryError);

    if (queryError) {
      console.error('[Login] 查询失败:', queryError);
      throw new Error('查询失败: ' + queryError.message);
    }

    if (!data) {
      console.error('[Login] 用户不存在, email:', email);
      throw new Error('用户不存在');
    }

    console.log('[Login] password_hash:', data.password_hash);
    
    // 使用 bcrypt 验证密码
    let isValidPassword = false;
    if (data.password_hash && data.password_hash.startsWith('$2a$')) {
      // 调用 RPC verify_password 进行验证
      const { data: verifyResult } = await supabase.rpc('verify_password', {
        password_hash: data.password_hash,
        password: password
      });
      isValidPassword = verifyResult === true;
    }
    
    if (!isValidPassword) {
      console.error('[Login] 密码错误, password:', password, 'hash:', data.password_hash?.substring(0, 20));
      throw new Error('密码错误');
    }

    if (data.vip_level < 9) {
      console.error('[Login] VIP 等级不足:', data.vip_level);
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

    console.log('[Login] 登录成功，保存用户数据:', userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
