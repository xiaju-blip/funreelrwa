import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, TrendingUp, Play } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

function AnimatedNumber({ value, prefix = '', suffix = '', delay = 0 }: { value: number; prefix?: string; suffix?: string; delay?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), value);
        setDisplayValue(current);

        if (step >= steps) {
          clearInterval(timer);
          setDisplayValue(value);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, value, delay]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <span ref={ref}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
}

function StatItem({ icon, label, value, prefix, suffix, delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors"
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-black">
        {icon}
      </div>
      <div>
        <p className="text-zinc-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} delay={delay} />
        </p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const { t } = useI18n();

  const stats = [
    { icon: <Users size={24} />, label: t('home.platformUsers'), value: 125890, suffix: '' },
    { icon: <Wallet size={24} />, label: t('home.assetProjects'), value: 28500000, prefix: '$' },
    { icon: <TrendingUp size={24} />, label: t('home.totalStaked'), value: 1250000, prefix: '$' }
  ];

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-600/5 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              FunReelRWA
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            {t('home.heroDesc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="/assets"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black font-semibold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-shadow"
            >
              <Play size={20} />
              {t('home.exploreAssets')}
            </motion.a>
            <motion.a
              href="/drama"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-zinc-700 text-white font-semibold rounded-xl hover:border-orange-500/50 hover:bg-orange-500/5 transition-all"
            >
              {t('home.watchDrama')}
            </motion.a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
