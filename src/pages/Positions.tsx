import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../hooks/useI18n';

interface Position {
  id: string;
  asset_id: string;
  amount: number;
  cost_price: number;
  created_at: string;
  assets?: { name: string };
}

export default function Positions() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPositions();
    }
  }, [user]);

  const fetchPositions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('positions')
      .select('*, assets(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPositions(data || []);
    setLoading(false);
  };

  const totalAmount = positions.reduce((sum, p) => sum + p.amount, 0);

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
          <h1 className="text-2xl font-bold text-white">{t('profile.myInvestments')}</h1>
        </motion.div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm">{t('profile.totalAssets')}</p>
          <p className="text-3xl font-bold text-white">{totalAmount} IPT</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : positions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t('common.noData')}</div>
        ) : (
          <div className="space-y-4">
            {positions.map((pos) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{pos.assets?.name || pos.asset_id}</h3>
                    <p className="text-gray-400 text-sm">{pos.amount} IPT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${pos.amount * pos.cost_price}</p>
                    <p className="text-green-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +0%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}