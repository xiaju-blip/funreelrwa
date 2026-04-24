import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, Star } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { mockUser } from '../data/mockData';

const benefits = [
  { icon: Star, text: '专属VIP标识' },
  { icon: Crown, text: '优先观看新剧' },
  { icon: Check, text: '专属客服支持' },
];

export default function VIP() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-black pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/profile" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('profile.vipCenter')}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Crown className="w-12 h-12 text-orange-400" />
            <div>
              <p className="text-gray-400 text-sm">{t('profile.currentLevel')}</p>
              <p className="text-2xl font-bold text-white">VIP{mockUser.vipLevel}</p>
            </div>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-orange-500 rounded-full w-1/3" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-4">{t('profile.benefits')}</h3>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <b.icon className="w-5 h-5 text-orange-400" />
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
