import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('处理登录中...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', ''));

        const idToken = params.get('id_token');
        const accessToken = params.get('access_token');
        const state = params.get('state');
        const savedState = localStorage.getItem('google_oauth_state');

        if (state !== savedState) {
          setStatus('error');
          setMessage('安全验证失败');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        localStorage.removeItem('google_oauth_state');

        if (!idToken) {
          setStatus('error');
          setMessage('未获取到登录凭证');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const userInfo = parseJwt(idToken);

        if (!userInfo?.email) {
          setStatus('error');
          setMessage('无法获取用户信息');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', userInfo.email)
          .maybeSingle();

        let userId: string;

        if (existingUser) {
          userId = existingUser.id;
          await supabase.from('users').update({
            avatar: userInfo.picture || existingUser.avatar,
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
        } else {
          userId = userInfo.sub || crypto.randomUUID();
          const { error: insertError } = await supabase.from('users').insert({
            id: userId,
            email: userInfo.email,
            nickname: userInfo.name || userInfo.email.split('@')[0],
            avatar: userInfo.picture,
            invite_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
            vip_level: 0,
            points: 0,
            token_balance: 0,
            status: 1,
          });

          if (insertError) throw insertError;
        }

        localStorage.setItem('funreel_user', JSON.stringify({
          id: userId,
          email: userInfo.email,
          nickname: userInfo.name || userInfo.email.split('@')[0],
          avatar: userInfo.picture,
          vipLevel: existingUser?.vip_level || 0,
          points: existingUser?.points || 0,
          tokenBalance: existingUser?.token_balance || 0,
        }));

        setStatus('success');
        setMessage('登录成功!');
        setTimeout(() => {
          window.location.href = '/#/profile';
          window.location.reload();
        }, 500);
      } catch (err: any) {
        setStatus('error');
        setMessage('登录失败: ' + (err.message || '未知错误'));
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-white">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-white">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-white">{message}</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
