import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import type { Tables } from '../supabase/types';

interface StakePool extends Tables<'stake_pools'> {}

const Stake: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [pools, setPools] = useState<StakePool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stake_pools')
        .select('*')
        .eq('status', 1)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPools(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async (poolId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    alert(`${t('stake.stakeNow')} ID: ${poolId}`);
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('stake.title')}</h1>
          <p className="text-gray-400">{t('stake.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{pool.name}</h3>
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t('stake.apy')}
                    </span>
                    <span className="text-2xl font-bold text-orange-400">{pool.base_apy}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t('stake.lockPeriod')}
                    </span>
                    <span className="text-white">{pool.lock_days} {t('common.days')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{t('stake.totalStaked')}</span>
                    <span className="text-white">{pool.total_staked?.toLocaleString() || 0} IPT</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.hash = `#/stake/${pool.id}`}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  {t('stake.stakeNow')}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Stake;
