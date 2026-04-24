import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Mail, Wallet, ChevronRight, ArrowLeft, Copy } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [bindingWallet, setBindingWallet] = useState(false);

  const securityItems = [
    { icon: Shield, label: t('settings.password'), desc: t('settings.passwordDesc') || '修改登录密码', status: user ? t('settings.set') || '已设置' : '-', key: 'password' },
    { icon: Smartphone, label: t('settings.phone'), desc: '-', status: t('settings.bound') || '已绑定', key: 'phone' },
    { icon: Mail, label: t('settings.email'), desc: user?.email || '-', status: user?.email ? t('settings.bound') || '已绑定' : '-', key: 'email' },
    { icon: Wallet, label: t('settings.wallet'), desc: user?.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : (t('settings.notBound') || '未绑定'), status: user?.wallet_address ? t('settings.bound') || '已绑定' : t('settings.bind') || '去绑定', key: 'wallet' }
  ];

  const handleBindWallet = async () => {
    if (!user) return;
    setBindingWallet(true);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const address = accounts[0];
        if (address) {
          alert('绑定钱包功能开发中，请联系客服绑定\n钱包地址: ' + address);
        }
      } else {
        alert('请安装 MetaMask 钱包');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBindingWallet(false);
    }
  };

  const copyAddress = () => {
    if (user?.wallet_address) {
      navigator.clipboard.writeText(user.wallet_address);
      alert('地址已复制');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <a href="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>{t('profile.back')}</span>
          </a>
          <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title')}</h1>
          <p className="text-gray-400">{t('settings.desc')}</p>
        </motion.div>

        <div className="space-y-4">
          {securityItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                if (item.key === 'wallet') {
                  handleBindWallet();
                } else {
                  setActiveSection(item.label);
                }
              }}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 cursor-pointer hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.label}</h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${item.key === 'wallet' && !user?.wallet_address ? 'text-orange-400' : 'text-green-400'}`}>{item.status}</span>
                  {item.key === 'wallet' && user?.wallet_address && (
                    <button onClick={copyAddress} className="p-1">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  {item.key !== 'wallet' && <ChevronRight className="w-5 h-5 text-zinc-500" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-zinc-900 rounded-xl border border-zinc-800 p-6"
          >
            <h3 className="text-white font-semibold mb-4">{activeSection}</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t('common.input')}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveSection(null)}
                  className="flex-1 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black font-semibold rounded-lg">
                  {t('common.confirm')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
