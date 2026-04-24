import { motion } from 'framer-motion';
import { Check, Gift } from 'lucide-react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClaim: (taskId: string) => void;
}

export default function TaskCard({ task, onClaim }: TaskCardProps) {
  const progressPercent = Math.min((task.progress / task.target) * 100, 100);
  const isCompleted = task.status === 2;
  const canClaim = task.canClaim;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-4 border border-zinc-700/50 hover:border-orange-500/50 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm mb-1">{task.name}</h3>
          <p className="text-zinc-400 text-xs">{task.description}</p>
        </div>
        <div className="flex items-center gap-1 text-orange-400">
          <Gift className="w-4 h-4" />
          <span className="text-sm font-bold">+{task.rewardPoints}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-zinc-400">进度</span>
          <span className="text-white">{task.progress}/{task.target}</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={`h-full rounded-full ${
              isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-orange-400'
            }`}
          />
        </div>
      </div>

      <motion.button
        whileHover={canClaim ? { scale: 1.05 } : {}}
        whileTap={canClaim ? { scale: 0.95 } : {}}
        onClick={() => canClaim && onClaim(task.id)}
        disabled={!canClaim || isCompleted}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 cursor-default'
            : canClaim
            ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-black hover:shadow-lg hover:shadow-orange-500/25'
            : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <span className="flex items-center justify-center gap-1">
            <Check className="w-4 h-4" /> 已完成
          </span>
        ) : canClaim ? (
          '领取奖励'
        ) : (
          '进行中'
        )}
      </motion.button>
    </motion.div>
  );
}
