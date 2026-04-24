import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const LanguageSwitcher: React.FC = () => {
  const { lang, toggleLang } = useI18n();

  return (
    <motion.button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white hover:border-orange-500/50 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      <Globe className="w-4 h-4 text-orange-400" />
      <span className="font-medium min-w-[20px]">{lang === 'zh' ? '中' : 'EN'}</span>
    </motion.button>
  );
};

export default LanguageSwitcher;
