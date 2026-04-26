import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Wallet as WalletIcon, Chrome, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type LoginType = 'email' | 'phone' | 'wallet' | 'google';

export default function Login() {
  const { t } = useI18n();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LoginType>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    code: ''
  });

  const tabs = [
    { id: 'email' as LoginType, icon: Mail, label: t('login.email') },
    { id: 'phone' as LoginType, icon: Phone, label: t('login.phone') },
    { id: 'wallet' as LoginType, icon: WalletIcon, label: t('login.wallet') },
    { id: 'google' as LoginType, icon: Chrome, label: t('login.google') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'email') {
      if (!formData.email) {
        setError('请输入邮箱地址');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('请输入有效的邮箱地址');
        return;
      }
      if (!formData.password) {
        setError('请输入密码');
        return;
      }
      if (formData.password.length < 6) {
        setError('密码长度不能少于6位');
        return;
      }
    } else if (activeTab === 'phone') {
      if (!formData.phone) {
        setError('请输入手机号码');
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        setError('请输入有效的手机号码');
        return;
      }
      if (!formData.code) {
        setError('请输入验证码');
        return;
      }
      if (formData.code.length !== 6) {
        setError('验证码应为6位数字');
        return;
      }
    }

    setLoading(true);
    try {
      if (activeTab === 'email') {
        await login(formData.email, formData.password);
        navigate('/profile');
      } else if (activeTab === 'phone') {
        await login(formData.phone, formData.code);
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          setError('请在钱包中解锁账户后重试');
          setLoading(false);
          return;
        }
        
        if (accounts && accounts[0]) {
          const userData = {
            id: accounts[0],
            email: `${accounts[0].slice(0, 8)}...${accounts[0].slice(-6)}@wallet.funreel.com`,
            nickname: `Wallet_${accounts[0].slice(-6)}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${accounts[0]}`,
            vipLevel: 0,
            points: 0,
            tokenBalance: 0,
          };
          localStorage.setItem('funreel_user', JSON.stringify(userData));
          navigate('/profile');
          window.location.reload();
        }
      } else {
        setError('请安装 MetaMask 钱包后再试');
      }
    } catch (err: any) {
      console.error('Wallet login error:', err);
      if (err.message && err.message.includes('wallet must has at least one account')) {
        setError('请在 MetaMask 中解锁账户后重试');
      } else {
        setError(err.message || t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login clicked');
    setError('');
    setLoading(true);
    try {
      console.log('Calling loginWithGoogle...');
      await loginWithGoogle();
      console.log('loginWithGoogle returned');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || t('login.error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>{t('common.back')}</span>
        </a>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-white text-center mb-2">{t('login.title')}</h1>
          <p className="text-gray-400 text-center mb-6">{t('login.subtitle')}</p>

          <div className="grid grid-cols-4 gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'email' && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('login.emailLabel')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('login.emailPlaceholder')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-sm">{t('login.passwordLabel')}</label>
                    <a href="/forgot-password" className="text-orange-400 text-sm hover:text-orange-300">
                      {t('login.forgotPassword')}
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={t('login.passwordPlaceholder')}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('login.submit')}
                </button>
              </motion.form>
            )}

            {activeTab === 'phone' && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('login.phoneLabel')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('login.phonePlaceholder')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('login.codeLabel')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder={t('login.codePlaceholder')}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      className="px-4 py-3 bg-gray-800 text-orange-400 rounded-lg hover:bg-gray-700 whitespace-nowrap"
                    >
                      {t('login.sendCode')}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('login.submit')}
                </button>
              </motion.form>
            )}

            {activeTab === 'wallet' && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WalletIcon className="w-10 h-10 text-orange-400" />
                </div>
                <p className="text-gray-400 mb-6">{t('login.walletDesc')}</p>
                <button
                  onClick={handleWalletLogin}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('login.connectWallet')}
                </button>
              </motion.div>
            )}

            {activeTab === 'google' && (
              <motion.div
                key="google"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Chrome className="w-10 h-10 text-blue-400" />
                </div>
                <p className="text-gray-400 mb-6">{t('login.googleDesc')}</p>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Chrome className="w-5 h-5" />
                  {loading ? t('common.loading') : t('login.googleBtn')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              {t('login.noAccount')}{' '}
              <a href="/register" className="text-orange-400 hover:text-orange-300">
                {t('login.register')}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
