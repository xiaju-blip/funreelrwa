import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Coins, DollarSign, Check } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';

export default function Deposit() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [selectedToken, setSelectedToken] = useState<'reel' | 'usdt'>('reel');
  const [amount, setAmount] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async () => {
    if (!user) {
      alert(t('common.pleaseLogin'));
      return;
    }
    setConnecting(true);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        alert(`${selectedToken === 'reel' ? 'REEL' : 'USDT'} ${t('deposit.underDev') || 'Deposit feature under development, contact support'}`);
      } else {
        alert(t('wallet.installMetaMask') || 'Please install MetaMask wallet');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert(t('common.invalidAmount') || 'Please enter a valid amount');
      return;
    }
    handleConnectWallet();
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/wallet" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('deposit.title')}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-white font-bold mb-4">{t('deposit.selectMethod')}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSelectedToken('reel')}
              className={`p-4 rounded-xl border-2 transition-colors ${
                selectedToken === 'reel' 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <Coins className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-white font-medium">{t('deposit.reelToken')}</p>
              <p className="text-gray-400 text-sm">{t('deposit.reelDesc')}</p>
            </button>
            <button
              onClick={() => setSelectedToken('usdt')}
              className={`p-4 rounded-xl border-2 transition-colors ${
                selectedToken === 'usdt' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">{t('deposit.usdt')}</p>
              <p className="text-gray-400 text-sm">{t('deposit.usdtDesc')}</p>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">{t('deposit.amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('deposit.placeholder')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg"
            />
          </div>

          <button
            onClick={handleDeposit}
            disabled={connecting || !amount}
            className="w-full py-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {connecting ? t('deposit.connecting') : t('deposit.confirm')}
          </button>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
            <h4 className="text-white font-medium mb-2">{t('deposit.instruction')}</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>1. {t('deposit.instruction1')}</li>
              <li>2. {t('deposit.instruction2')}</li>
              <li>3. {t('deposit.instruction3')}</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
