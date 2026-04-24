import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Eye, Star, Filter, Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { supabase } from '../supabase/client';
import DramaCard from '../components/DramaCard';
import { useI18n } from '../hooks/useI18n';
import type { Tables } from '../supabase/types';

type Drama = Tables<'dramas'>;

export default function Drama() {
  const { t, lang } = useI18n();
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed'>('all');

  const categories = [
    { id: 'all', name: t('drama.all'), icon: null },
    { id: 'romance', name: t('drama.romance'), icon: '💕' },
    { id: 'action', name: t('drama.action'), icon: '⚡' },
    { id: 'comedy', name: t('drama.comedy'), icon: '😄' },
    { id: 'suspense', name: t('drama.suspense'), icon: '🔍' },
    { id: 'fantasy', name: t('drama.fantasy'), icon: '✨' }
  ];

  const sortOptions = [
    { id: 'newest', name: lang === 'zh' ? '最新上线' : 'Newest' },
    { id: 'popular', name: lang === 'zh' ? '最热播放' : 'Most Popular' },
    { id: 'rating', name: lang === 'zh' ? '最高评分' : 'Highest Rated' }
  ];

  useEffect(() => {
    fetchDramas();
  }, []);

  const fetchDramas = async () => {
    try {
      const { data, error } = await supabase
        .from('dramas')
        .select('*')
        .eq('status', 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDramas(data || []);
    } catch (err) {
      console.error('Failed to fetch dramas:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDramas = useMemo(() => {
    let result = dramas;

    if (activeCategory !== 'all') {
      result = result.filter(d => d.category_id === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => {
        const title = getLocalizedTitle(d).toLowerCase();
        return title.includes(query);
      });
    }

    if (statusFilter !== 'all') {
      result = result.filter(d => {
        if (statusFilter === 'completed') return d.is_complete;
        return !d.is_complete;
      });
    }

    switch (sortBy) {
      case 'popular':
        result = [...result].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'rating':
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return result;
  }, [dramas, activeCategory, searchQuery, sortBy, statusFilter]);

  const getLocalizedTitle = (drama: Drama) => {
    if (typeof drama.title === 'object' && drama.title !== null) {
      return (drama.title as any)[lang] || (drama.title as any).zh || '';
    }
    return String(drama.title);
  };

  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('newest');
    setStatusFilter('all');
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery || sortBy !== 'newest' || statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('drama.title')}</h1>
          <p className="text-gray-400">{t('drama.subtitle')}</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'zh' ? '搜索短剧名称...' : 'Search drama title...'}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  showFilters ? 'bg-orange-500 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">{lang === 'zh' ? '筛选' : 'Filter'}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                )}
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-gray-900 border border-gray-800 text-white px-4 py-3 pr-10 rounded-xl focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
                    <Filter className="w-4 h-4" />
                    <span>{lang === 'zh' ? '分类' : 'Category'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          activeCategory === cat.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {cat.icon && <span>{cat.icon}</span>}
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{lang === 'zh' ? '状态' : 'Status'}</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', name: lang === 'zh' ? '全部' : 'All' },
                      { id: 'ongoing', name: lang === 'zh' ? '连载中' : 'Ongoing' },
                      { id: 'completed', name: lang === 'zh' ? '已完结' : 'Completed' }
                    ].map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setStatusFilter(status.id as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          statusFilter === status.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {status.name}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="pt-2 border-t border-gray-800">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm"
                    >
                      <X className="w-4 h-4" />
                      {lang === 'zh' ? '清除筛选' : 'Clear Filters'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!showFilters && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            {lang === 'zh' ? `共 ${filteredDramas.length} 部短剧` : `${filteredDramas.length} dramas`}
          </span>
          {hasActiveFilters && (
            <span className="text-orange-400">
              {lang === 'zh' ? '已应用筛选' : 'Filters applied'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredDramas.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-2">
              {lang === 'zh' ? '没有找到相关短剧' : 'No dramas found'}
            </p>
            <button
              onClick={clearFilters}
              className="text-orange-400 hover:text-orange-300 text-sm"
            >
              {lang === 'zh' ? '清除筛选条件' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredDramas.map((drama, index) => (
                <motion.div
                  key={drama.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <DramaCard
                    id={drama.id}
                    title={getLocalizedTitle(drama)}
                    coverImage={drama.cover_image}
                    totalEpisodes={drama.total_episodes || 0}
                    category={drama.category_id || ''}
                    vipLevel={drama.vip_level || 0}
                    onClick={() => window.location.hash = `#/play/${drama.id}`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
