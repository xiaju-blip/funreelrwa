import { motion } from 'framer-motion';
import { ArrowLeft, Gift, TrendingUp, TrendingDown, History } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const mockPointsHistory = [
  { id: 1, type: 'earn', amount: 100, desc: '每日签到', time: '2024-01-15' },
  { id: 2, type: 'spend', amount: 50, desc: '兑换商品', time: '2024-01-14' },
  { id: 3, type: 'earn', amount: 200, desc: '观看短剧', time: '2024-01-13' },
];

export default function Points() {
  const { t } = useI18n();
  const totalPoints = 1250;

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
          <h1 className="text-2xl font-bold text-white">{t('profile.pointsDetail')}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('points.currentPoints')}</p>
              <p className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">{t('points.earned')}</span>
              </div>
              <p className="text-xl font-bold text-green-400">+1,500</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-gray-400 text-sm">{t('points.used')}</span>
              </div>
              <p className="text-xl font-bold text-red-400">-250</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-orange-400" /> {t('points.history')}
          </h3>
          <div className="space-y-3">
            {mockPointsHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">{item.desc}</p>
                  <p className="text-gray-500 text-xs">{item.time}</p>
                </div>
                <p className={`font-bold ${item.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.type === 'earn' ? '+' : '-'}{item.amount}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
