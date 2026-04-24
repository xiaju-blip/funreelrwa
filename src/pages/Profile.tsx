import { motion } from 'framer-motion';
import { User, Wallet, TrendingUp, Gift, Star, Users, Settings, LogOut, Award } from 'lucide-react';
import { mockPositions } from '../data/mockData';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log('[Profile] user:', user);
  const totalValue = mockPositions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalCost = mockPositions.reduce((sum, p) => sum + p.amount * (p.currentValue / (1 + p.returnRate / 100)), 0);
  const totalReturn = ((totalValue - totalCost) / totalCost) * 100;

  const menuItems = [
    { icon: TrendingUp, label: t('profile.myInvestments'), href: '#/positions' },
    { icon: Award, label: t('stake.title'), href: '#/my-stakes' },
    { icon: Wallet, label: t('profile.myWallet'), href: '#/wallet' },
    { icon: Gift, label: t('profile.pointsDetail'), href: '#/points' },
    { icon: Star, label: t('profile.vipCenter'), href: '#/vip/purchase' },
    { icon: Users, label: t('profile.inviteFriends'), href: '#/invite' },
    { icon: Settings, label: t('profile.securitySettings'), href: '#/settings' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayUser = user || {
    nickname: 'Guest',
    vipLevel: 0,
    vip_expire_at: '',
    kycLevel: 0,
    inviteCode: '',
    tokenBalance: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
  };

  console.log('[Profile] displayUser:', displayUser);
  let vipExpireText = '';
  if (displayUser && displayUser.vipLevel > 0) {
    if (displayUser.vip_expire_at) {
      vipExpireText = '到期: ' + new Date(displayUser.vip_expire_at).toLocaleDateString();
    } else {
      vipExpireText = '永久有效';
    }
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 border border-orange-500/20 mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <img
              src={displayUser.avatar}
              alt={displayUser.nickname}
              className="w-20 h-20 rounded-full border-4 border-orange-500/30"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{displayUser.nickname}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded">VIP{displayUser.vipLevel}</span>
                {vipExpireText && (
                  <span className="text-orange-400 text-xs">到期: {vipExpireText}</span>
                )}
              </div>
              {displayUser.inviteCode && (
                <p className="text-zinc-400 text-sm mt-1">{t('profile.inviteCode')}: {displayUser.inviteCode}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <p className="text-zinc-400 text-xs mb-1">{t('profile.totalAssets')}</p>
              <p className="text-xl font-bold text-white">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <p className="text-zinc-400 text-xs mb-1">{t('profile.totalReturn')}</p>
              <p className={`text-xl font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <p className="text-zinc-400 text-xs mb-1">{t('profile.reelBalance')}</p>
              <p className="text-xl font-bold text-orange-400">{(displayUser.tokenBalance || 0).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-zinc-800' : ''
              }`}
            >
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-white font-medium flex-1">{item.label}</span>
              <span className="text-zinc-500">›</span>
            </a>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleLogout}
          className="w-full mt-6 py-4 bg-zinc-900 border border-red-500/30 rounded-xl text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {t('profile.logout')}
        </motion.button>
      </div>
    </div>
  );
}
