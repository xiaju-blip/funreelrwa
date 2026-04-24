import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../hooks/useI18n';

interface StakeRecord {
  id: string;
  pool_id: string;
  amount: number;
  pending_earned: number;
  total_earned: number;
  status: number;
  created_at: string;
  stake_pools?: { name: string };
}

export default function MyStakes() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [records, setRecords] = useState<StakeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStakes();
    }
  }, [user]);

  const fetchStakes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('stake_records')
      .select('*, stake_pools(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setRecords(data || []);
    setLoading(false);
  };

  const totalStaked = records.reduce((sum, r) => sum + r.amount, 0);
  const totalEarned = records.reduce((sum, r) => sum + r.total_earned, 0);

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/profile" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('stake.title')}</h1>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">{t('stake.totalStaked')}</p>
            <p className="text-2xl font-bold text-white">{totalStaked} IPT</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">{t('stake.estimated')}</p>
            <p className="text-2xl font-bold text-green-400">{totalEarned} IPT</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t('common.noData')}</div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{record.stake_pools?.name || record.pool_id}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${record.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {record.status === 1 ? '进行中' : '已完成'}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">{record.amount} IPT</div>
                <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                  <TrendingUp className="w-3 h-3" /> +{record.total_earned} IPT
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}