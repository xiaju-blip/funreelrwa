import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Clock, RefreshCcw, Gift } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const mockTransactions = [
  { id: 1, type: 'buy', asset: '都市爱情短剧IP', amount: 1000, price: 1.25, time: '2024-01-15 10:30' },
  { id: 2, type: 'sell', asset: '古装悬疑短剧IP', amount: 500, price: 1.26, time: '2024-01-14 15:20' },
  { id: 3, type: 'stake', asset: '灵活质押池', amount: 2000, price: 1, time: '2024-01-13 09:00' },
];

export default function Transactions() {
  const { t } = useI18n();

  const getTypeLabel = (type: string) => {
    return t(`transactions.${type}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <ArrowDownRight className="w-5 h-5 text-green-400" />;
      case 'sell': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'stake': return <RefreshCcw className="w-5 h-5 text-blue-400" />;
      case 'unstake': return <RefreshCcw className="w-5 h-5 text-purple-400" />;
      case 'reward': return <Gift className="w-5 h-5 text-yellow-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/profile" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('transactions.title')}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'buy' ? 'bg-green-500/20' : tx.type === 'sell' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.asset}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tx.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'buy' ? 'text-green-400' : tx.type === 'sell' ? 'text-red-400' : 'text-blue-400'}`}>
                    {tx.type === 'buy' ? '+' : tx.type === 'sell' ? '-' : ''}{tx.amount} IPT
                  </p>
                  <p className="text-gray-500 text-xs">${tx.price}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
