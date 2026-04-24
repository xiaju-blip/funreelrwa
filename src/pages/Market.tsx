import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Filter } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import TradePanel from '../components/TradePanel';

const mockOrders = [
  { id: 1, type: 'buy', price: 1.25, amount: 1000, time: '2分钟前' },
  { id: 2, type: 'sell', price: 1.26, amount: 500, time: '5分钟前' },
  { id: 3, type: 'buy', price: 1.24, amount: 2000, time: '10分钟前' },
];

export default function Market() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: t('market.all') },
    { id: 'buy', label: t('market.buy') },
    { id: 'sell', label: t('market.sell') },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">{t('market.title')}</h1>
          <p className="text-gray-400">{t('market.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm">{t('market.currentPrice')}</p>
                  <p className="text-3xl font-bold text-white">$1.25</p>
                  <p className="text-green-400 text-sm">+5.2%</p>
                </div>
                <div className="flex gap-2">
                  {['1H', '1D', '1W', '1M'].map((period) => (
                    <button
                      key={period}
                      className="px-3 py-1 bg-gray-800 text-gray-400 rounded-lg text-sm hover:bg-gray-700"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 bg-gray-800/50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-gray-600" />
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        order.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {order.type === 'buy' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {order.type === 'buy' ? t('market.buy') : t('market.sell')}
                        </p>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {order.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${order.price}</p>
                      <p className="text-gray-500 text-xs">{order.amount} IPT</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <TradePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
