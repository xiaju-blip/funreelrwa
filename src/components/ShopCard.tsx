import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { ShopItem } from '../types';

interface ShopCardProps {
  item: ShopItem;
  onExchange: (item: ShopItem) => void;
  userPoints: number;
}

export default function ShopCard({ item, onExchange, userPoints }: ShopCardProps) {
  const canExchange = userPoints >= item.points && item.stock !== 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-xl overflow-hidden"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded">
          {item.stock > 0 ? `库存: ${item.stock}` : '无限'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2">{item.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-orange-400 font-bold text-lg">{item.points}</span>
          <span className="text-gray-400 text-xs">积分</span>
        </div>

        {item.tokenAmount && (
          <div className="text-gray-400 text-xs mb-3">
            可获得 {item.tokenAmount} REEL
          </div>
        )}

        {item.vipDays && (
          <div className="text-gray-400 text-xs mb-3">
            VIP体验 {item.vipDays} 天
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onExchange(item)}
          disabled={!canExchange}
          className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${
            canExchange
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black hover:from-orange-400 hover:to-orange-500'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {canExchange ? '立即兑换' : '积分不足'}
        </motion.button>
      </div>
    </motion.div>
  );
}
