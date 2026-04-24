import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Film, Users, Zap } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import Hero from '../components/Hero';
import AssetCard from '../components/AssetCard';
import DramaCard from '../components/DramaCard';
import type { Tables } from '../supabase/types';

interface Stats {
  totalAssets: number;
  totalDramas: number;
  totalUsers: number;
  totalStaked: number;
}

export default function Home() {
  const { t } = useI18n();
  const [assets, setAssets] = useState<Tables<'assets'>[]>([]);
  const [dramas, setDramas] = useState<Tables<'dramas'>[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAssets: 0,
    totalDramas: 0,
    totalUsers: 0,
    totalStaked: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [{ data: assetsData }, { data: dramasData }, { count: usersCount }, { data: stakeData }] = await Promise.all([
        supabase.from('assets').select('*').eq('status', 1).order('created_at', { ascending: false }).limit(4),
        supabase.from('dramas').select('*').eq('status', 1).order('created_at', { ascending: false }).limit(4),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('stake_pools').select('total_staked')
      ]);

      setAssets(assetsData || []);
      setDramas(dramasData || []);
      
      const totalStaked = stakeData?.reduce((sum, pool) => sum + (pool.total_staked || 0), 0) || 0;
      
      setStats({
        totalAssets: assetsData?.length || 0,
        totalDramas: dramasData?.length || 0,
        totalUsers: usersCount || 0,
        totalStaked
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Hero />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: TrendingUp, label: t('home.stats.assets'), value: stats.totalAssets },
              { icon: Film, label: t('home.stats.dramas'), value: stats.totalDramas },
              { icon: Users, label: t('home.stats.users'), value: stats.totalUsers },
              { icon: Zap, label: t('home.stats.staked'), value: `${stats.totalStaked.toLocaleString()} IPT` }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {loading ? '-' : stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{t('home.hotAssets')}</h2>
              <p className="text-gray-400">{t('home.hotAssetsDesc')}</p>
            </div>
            <a href="/assets" className="text-orange-500 hover:text-orange-400 font-medium">
              {t('home.viewAll')} →
            </a>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : assets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={{
                    id: asset.id,
                    name: asset.name,
                    cover: asset.cover || '',
                    description: asset.description || '',
                    targetAmount: asset.target_amount || 0,
                    raisedAmount: asset.raised_amount || 0,
                    apy: asset.apy || 0,
                    durationDays: asset.duration_days || 0,
                  }}
                  onClick={() => window.location.hash = `#/asset/${asset.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              {t('common.noData')}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{t('home.hotDramas')}</h2>
              <p className="text-gray-400">{t('home.hotDramasDesc')}</p>
            </div>
            <a href="/drama" className="text-orange-500 hover:text-orange-400 font-medium">
              {t('home.viewAll')} →
            </a>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : dramas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dramas.map((drama) => (
                <DramaCard
                  key={drama.id}
                  id={drama.id}
                  title={typeof drama.title === 'object' ? drama.title.zh || drama.title.en || '' : drama.title}
                  coverImage={drama.cover_image}
                  totalEpisodes={drama.total_episodes || 0}
                  category={drama.category_id || ''}
                  vipLevel={drama.vip_level || 0}
                  onClick={() => window.location.hash = `#/play/${drama.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              {t('common.noData')}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
