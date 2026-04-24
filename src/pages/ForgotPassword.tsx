import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useNavigate } from 'react-router-dom';

type ResetType = 'email' | 'phone';

export default function ForgotPassword() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ResetType>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'email' as ResetType, icon: Mail, label: t('forgotPassword.email') },
    { id: 'phone' as ResetType, icon: Smartphone, label: t('forgotPassword.phone') }
  ];

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

    if (formData.newPassword.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('forgotPassword.passwordMismatch'));
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-12 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('forgotPassword.success')}</h2>
            <p className="text-gray-400 mb-6">您的密码已成功重置，请使用新密码登录</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              {t('forgotPassword.backToLogin')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <a href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>{t('common.back')}</span>
        </a>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-white text-center mb-2">{t('forgotPassword.title')}</h1>
          <p className="text-gray-400 text-center mb-6">{t('forgotPassword.subtitle')}</p>

          <div className="grid grid-cols-2 gap-2 mb-6">
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
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.emailLabel')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.codeLabel')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder={t('forgotPassword.codePlaceholder')}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={sendCode}
                      disabled={countdown > 0}
                      className="px-4 py-3 bg-gray-800 text-orange-400 rounded-lg hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}s` : t('forgotPassword.sendCode')}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.newPassword')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder={t('forgotPassword.newPasswordPlaceholder')}
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
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder={t('forgotPassword.confirmPasswordPlaceholder')}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('forgotPassword.submit')}
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
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.phoneLabel')}</label>
                  <div className="flex gap-2">
                    <span className="bg-gray-800 text-white px-3 py-3 rounded-lg">+86</span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('forgotPassword.phonePlaceholder')}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.codeLabel')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder={t('forgotPassword.codePlaceholder')}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={sendCode}
                      disabled={countdown > 0}
                      className="px-4 py-3 bg-gray-800 text-orange-400 rounded-lg hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}s` : t('forgotPassword.sendCode')}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.newPassword')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder={t('forgotPassword.newPasswordPlaceholder')}
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
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('forgotPassword.confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder={t('forgotPassword.confirmPasswordPlaceholder')}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('forgotPassword.submit')}
                </button>
              </motion.form>
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
