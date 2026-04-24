import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Loader2 } from 'lucide-react';

interface PhoneLoginProps {
  onSubmit: (phone: string, code: string) => void;
  onSwitch: (type: 'email' | 'wallet' | 'google') => void;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ onSubmit, onSwitch }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendCode = () => {
    if (!phone || countdown > 0) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && code) onSubmit(phone, code);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">手机登录</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">手机号</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:border-orange-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">验证码</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="请输入验证码"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-orange-500 outline-none"
            />
            <button
              onClick={sendCode}
              disabled={countdown > 0 || !phone}
              className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : '发送验证码'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !phone || !code}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>登录</span><ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
      <div className="mt-6 flex justify-center gap-4 text-sm">
        <button onClick={() => onSwitch('email')} className="text-gray-400 hover:text-orange-400">邮箱登录</button>
        <button onClick={() => onSwitch('wallet')} className="text-gray-400 hover:text-orange-400">钱包登录</button>
        <button onClick={() => onSwitch('google')} className="text-gray-400 hover:text-orange-400">Google登录</button>
      </div>
    </motion.div>
  );
};

export default PhoneLogin;
