import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Mail, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { t } = useI18n();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    email: '',
    password: '',
    code: '',
  });
  const [countdown, setCountdown] = useState(0);

  const sendCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) clearInterval(timer);
        return c - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'phone') {
      if (!form.phone) {
        setError('请输入手机号码');
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(form.phone)) {
        setError('请输入有效的手机号码');
        return;
      }
    } else {
      if (!form.email) {
        setError('请输入邮箱地址');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError('请输入有效的邮箱地址');
        return;
      }
    }

    if (!form.code) {
      setError('请输入验证码');
      return;
    }
    if (form.code.length !== 6) {
      setError('验证码应为6位数字');
      return;
    }

    if (!form.password) {
      setError('请设置密码');
      return;
    }
    if (form.password.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }
    if (form.password.length > 20) {
      setError('密码长度不能超过20位');
      return;
    }

    if (!agreed) {
      setError('请同意用户协议和隐私政策');
      return;
    }

    setLoading(true);
    try {
      const email = tab === 'email' ? form.email : `${form.phone}@phone.funreel.com`;
      const nickname = tab === 'phone' ? `用户${form.phone.slice(-4)}` : form.email.split('@')[0];
      await register(email, form.password, nickname);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <a href="/" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('register.title')}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTab('phone')}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                tab === 'phone'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {t('register.phone')}
            </button>
            <button
              onClick={() => setTab('email')}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                tab === 'email'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Mail className="w-4 h-4" />
              {t('register.email')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'phone' ? (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">{t('register.phone')}</label>
                <div className="flex gap-2">
                  <span className="bg-gray-800 text-white px-3 py-3 rounded-lg">+86</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    placeholder={t('register.phonePlaceholder')}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">{t('register.email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                  placeholder={t('register.emailPlaceholder')}
                />
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('register.code')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                  placeholder={t('register.codePlaceholder')}
                />
                <button
                  onClick={sendCode}
                  disabled={countdown > 0}
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s` : t('register.sendCode')}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('register.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                  placeholder={t('register.passwordPlaceholder')}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500"
              />
              <span className="text-gray-400">
                {t('register.agree')} <a href="#" className="text-orange-400">{t('register.terms')}</a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('register.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">{t('register.hasAccount')} </span>
            <a href="/login" className="text-orange-400 hover:text-orange-300">
              {t('register.login')}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
