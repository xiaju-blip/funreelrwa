import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Clock, Shield, DollarSign, Calculator } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';

interface StakePool {
  id: string;
  name: string;
  base_apy: number;
  lock_days: number;
  max_stake: number | null;
  total_staked: number | null;
  vip_bonus: number | null;
}

export default function StakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [pool, setPool] = useState<StakePool | null>(null);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState('');
  const [staking, setStaking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPool();
    }
  }, [id]);

  const fetchPool = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stake_pools')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPool(data);
    } catch (err) {
      console.error('Failed to fetch pool:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      return;
    }

    setStaking(true);
    try {
      const { error } = await supabase.from('stake_records').insert({
        user_id: user.id,
        pool_id: id,
        amount: amount,
        pending_earned: 0,
        total_earned: 0,
        status: 0,
        auto_compound: false,
        vip_level_at_stake: user.vip_level || 0,
      });

      if (error) throw error;
      alert(t('stake.stakeSuccess') || '质押成功');
      setStakeAmount('');
    } catch (err) {
      console.error('Staking failed:', err);
      alert(t('common.error'));
    } finally {
      setStaking(false);
    }
  };

  const calcReward = () => {
    const amount = parseFloat(stakeAmount) || 0;
    if (!pool || amount <= 0) return '0';
    const days = pool.lock_days;
    const apy = pool.base_apy + (pool.vip_bonus || 0);
    const reward = (amount * apy / 100 / 365) * days;
    return reward.toFixed(4);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t('stake.notFound') || '质押池不存在'}</p>
          <a href="/stake" className="text-orange-400 hover:text-orange-300">
            {t('common.back')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/stake" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold text-white">{pool.name}</h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('stake.annualReturn')}</p>
              <p className="text-2xl font-bold text-white">{pool.base_apy}%</p>
              {pool.vip_bonus ? (
                <p className="text-orange-400 text-sm">+{pool.vip_bonus}% {t('stake.vip')}</p>
              ) : null}
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('stake.lockPeriod')}</p>
              <p className="text-2xl font-bold text-white">{pool.lock_days}{t('common.days')}</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('stake.totalStaked')}</p>
              <p className="text-xl font-bold text-white">{pool.total_staked?.toLocaleString() || 0}</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('stake.vipBonus')}</p>
              <p className="text-xl font-bold text-white">+{pool.vip_bonus || 0}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-white font-bold mb-4">{t('stake.stake')}</h3>
          <div className="flex gap-4 mb-4">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder={t('stake.amountPlaceholder')}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          {stakeAmount && parseFloat(stakeAmount) > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400">{t('stake.estimated')}</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                ≈ {calcReward()} IPT
              </p>
              <p className="text-gray-500 text-sm">
                {pool.lock_days}{t('common.days')} {t('stake.lockPeriod')}
              </p>
            </div>
          )}

          <button
            onClick={handleStake}
            disabled={staking || !stakeAmount}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
          >
            {staking ? t('common.loading') : t('stake.stakeNow')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}