import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users } from 'lucide-react';
import { supabase } from '../supabase/client';
import AssetCard from '../components/AssetCard';
import { useI18n } from '../hooks/useI18n';

interface Asset {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  target_amount: number;
  raised_amount: number | null;
  apy: number | null;
  duration_days: number | null;
  status: number | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string | null;
}

const Assets: React.FC = () => {
  const { t } = useI18n();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('status', 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: TrendingUp, label: t('assets.totalAssets'), value: assets.length.toString() },
    { icon: Clock, label: t('assets.avgReturn'), value: '12.5%' },
    { icon: Users, label: t('assets.participants'), value: '2,847' },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">{t('assets.title')}</h1>
          <p className="text-gray-400">{t('assets.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchAssets}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {!loading && !error && assets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">{t('assets.noData')}</p>
          </div>
        )}

        {!loading && !error && assets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AssetCard
                  asset={{
                    id: asset.id,
                    name: asset.name,
                    cover: asset.cover || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
                    targetAmount: asset.target_amount,
                    raisedAmount: asset.raised_amount || 0,
                    apy: asset.apy || 0,
                    duration: asset.duration_days || 30,
                    status: asset.status === 1 ? 'active' : 'ended',
                    endTime: asset.end_time || '',
                  }}
                  onClick={() => window.location.hash = `#/asset/${asset.id}`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;
