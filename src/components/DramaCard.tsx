import React from 'react';
import { motion } from 'framer-motion';

interface DramaCardProps {
  id: string;
  title: string;
  coverImage: string;
  totalEpisodes: number;
  category: string;
  vipLevel: number;
  onClick?: () => void;
}

const DramaCard: React.FC<DramaCardProps> = ({
  title,
  coverImage,
  totalEpisodes,
  category,
  vipLevel,
  onClick
}) => {
  return (
    <motion.div
      className="relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {vipLevel > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded">
            VIP{vipLevel}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-zinc-400 text-xs">{category}</span>
            <span className="text-orange-400 text-xs">{totalEpisodes}集</span>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-xl transition-colors duration-200" />
    </motion.div>
  );
};

export default DramaCard;
