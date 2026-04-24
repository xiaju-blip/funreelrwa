import { motion } from 'framer-motion';
import { Lock, TrendingUp, Users } from 'lucide-react';

interface StakePool {
  id: string;
  name: string;
  lockDays: number;
  baseApy: number;
  vipBonus: number;
  maxStake: number;
  totalStaked: number;
}

interface StakeCardProps {
  pool: StakePool;
  onStake: (poolId: string) => void;
}

export default function StakeCard({ pool, onStake }: StakeCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-xl p-6 hover:border-orange-500/60 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{pool.name}</h3>
        <div className="flex items-center gap-1 text-orange-400">
          <Lock className="w-4 h-4" />
          <span className="text-sm">{pool.lockDays === 0 ? '活期' : pool.lockDays + '天'}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-orange-500">{pool.baseApy}%</span>
          <span className="text-gray-400 text-sm">基础年化</span>
        </div>
        <p className="text-orange-400/80 text-sm mt-1">VIP额外+{pool.vipBonus}%</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-4 h-4" />
          <span className="text-sm">已质押: {formatNumber(pool.totalStaked)} REEL</span>
        </div>
        {pool.maxStake > 0 && (
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">额度上限: {formatNumber(pool.maxStake)} REEL</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onStake(pool.id)}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-bold rounded-lg transition-all"
      >
        立即质押
      </button>
    </motion.div>
  );
}
