import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';

interface TradePanelProps {
  currentPrice?: number;
}

export default function TradePanel({ currentPrice = 1.28 }: TradePanelProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState(currentPrice.toFixed(4));
  const [amount, setAmount] = useState('');

  const orderBook = {
    asks: [
      { price: 1.285, amount: 1250 },
      { price: 1.290, amount: 890 },
      { price: 1.295, amount: 2100 },
      { price: 1.300, amount: 1560 },
      { price: 1.305, amount: 980 }
    ],
    bids: [
      { price: 1.275, amount: 1680 },
      { price: 1.270, amount: 2340 },
      { price: 1.265, amount: 1120 },
      { price: 1.260, amount: 1890 },
      { price: 1.255, amount: 750 }
    ]
  };

  const maxAsk = Math.max(...orderBook.asks.map(a => a.amount));
  const maxBid = Math.max(...orderBook.bids.map(b => b.amount));

  const handleTrade = () => {
    console.log(`${activeTab} order:`, { price, amount });
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'buy'
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          {t('market.buy')}
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'sell'
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          {t('market.sell')}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-zinc-400 text-sm mb-1 block">{t('market.price')} (USDT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-zinc-400 text-sm mb-1 block">{t('market.amount')} (IPT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">{t('market.available')}</span>
          <span className="text-white">2,580.50 USDT</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleTrade}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          activeTab === 'buy'
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500'
            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500'
        } text-white`}
      >
        {activeTab === 'buy' ? t('market.buyIpt') : t('market.sellIpt')}
      </motion.button>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>{t('market.price')}</span>
          <span>数量</span>
        </div>
        <div className="space-y-1">
          {orderBook.asks.map((ask, i) => (
            <div key={i} className="flex justify-between items-center text-sm py-1">
              <span className="text-red-400">{ask.price.toFixed(4)}</span>
              <div className="flex-1 mx-2 h-4 bg-zinc-800 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(ask.amount / maxAsk) * 100}%` }}
                  className="h-full bg-red-500/30"
                />
              </div>
              <span className="text-zinc-400">{ask.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="text-center py-2 text-orange-400 font-semibold text-lg">
          {currentPrice.toFixed(4)}
        </div>
        <div className="space-y-1">
          {orderBook.bids.map((bid, i) => (
            <div key={i} className="flex justify-between items-center text-sm py-1">
              <span className="text-green-400">{bid.price.toFixed(4)}</span>
              <div className="flex-1 mx-2 h-4 bg-zinc-800 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(bid.amount / maxBid) * 100}%` }}
                  className="h-full bg-green-500/30"
                />
              </div>
              <span className="text-zinc-400">{bid.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
