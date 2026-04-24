import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users } from 'lucide-react';
import type { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

export default function AssetCard({ asset, onClick }: AssetCardProps) {
  const progress = (asset.raisedAmount / asset.targetAmount) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/50 cursor-pointer group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={asset.cover}
          alt={asset.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 bg-orange-500/90 text-black text-xs font-bold px-2 py-1 rounded-full">
          APY {asset.apy}%
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-1">{asset.name}</h3>
        <p className="text-zinc-400 text-xs mb-4 line-clamp-2">{asset.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">募资进度</span>
            <span className="text-orange-400 font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
            <div className="flex items-center gap-1 text-zinc-500 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>${(asset.raisedAmount / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{asset.durationDays}天</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
