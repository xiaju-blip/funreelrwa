import { motion } from 'framer-motion';
import { ArrowLeft, Wallet as WalletIcon, Coins, ArrowUpRight, ArrowDownRight, DollarSign, History, Copy } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const recentTransactions = [
  { id: 1, type: 'in', amount: 1000, token: 'REEL', time: '2024-01-15 10:30', desc: '充值' },
  { id: 2, type: 'out', amount: 500, token: 'REEL', time: '2024-01-14 15:20', desc: '投资' },
  { id: 3, type: 'in', amount: 200, token: 'Points', time: '2024-01-13 09:00', desc: '任务奖励' },
];

export default function Wallet() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tokenBalance = user?.tokenBalance || 0;
  const points = user?.points || 0;

  const handleDeposit = () => {
    navigate('/deposit');
  };

  const handleWithdraw = () => {
    navigate('/withdraw');
  };

  const copyAddress = () => {
    if (user?.wallet_address) {
      navigator.clipboard.writeText(user.wallet_address);
      alert(t('common.copied'));
    }
  };

  const handleBindWallet = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/profile" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('wallet.title')}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t('wallet.total')}</p>
                <p className="text-3xl font-bold text-white">${(tokenBalance * 0.5 + points * 0.01).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {user?.wallet_address ? (
            <div className="mb-4 p-3 bg-black/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">绑定钱包地址</p>
                  <p className="text-white text-sm font-mono">{user.wallet_address}</p>
                </div>
                <button
                  onClick={copyAddress}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-black/30 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">{t('wallet.noWallet') || '未绑定钱包地址'}</p>
              <button
                onClick={() => navigate('/settings')}
                className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                {t('wallet.bindWallet') || '绑定钱包地址'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400 text-sm">REEL</span>
              </div>
              <p className="text-2xl font-bold text-white">{tokenBalance.toLocaleString()}</p>
              <p className="text-orange-400 text-sm">≈ ${(tokenBalance * 0.5).toLocaleString()}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">USDT</span>
              </div>
              <p className="text-2xl font-bold text-white">0.00</p>
              <p className="text-green-400 text-sm">$0.00</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">{t('wallet.points')}</span>
              </div>
              <p className="text-2xl font-bold text-white">{points.toLocaleString()}</p>
              <p className="text-yellow-400 text-sm">{t('shop.exchange')}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleDeposit}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowDownRight className="w-4 h-4" /> {t('wallet.deposit')}
            </button>
            <button 
              onClick={handleWithdraw}
              className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" /> {t('wallet.withdraw')}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-orange-400" /> {t('wallet.recent')}
          </h3>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'in' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {tx.type === 'in' ? <ArrowDownRight className="w-5 h-5 text-green-400" /> : <ArrowUpRight className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.desc}</p>
                    <p className="text-gray-500 text-xs">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'in' ? '+' : '-'}{tx.amount} {tx.token}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
