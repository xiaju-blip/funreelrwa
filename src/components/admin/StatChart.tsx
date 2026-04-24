import React from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  label: string;
  value: number;
}

interface StatChartProps {
  title: string;
  data: DataPoint[];
  color?: string;
  type?: 'bar' | 'line';
}

const StatChart: React.FC<StatChartProps> = ({ title, data, color = 'orange', type = 'bar' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colorClass = color === 'orange' ? 'bg-orange-500' : color === 'blue' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-6">
      <h3 className="text-white font-bold mb-4">{title}</h3>
      <div className="h-48 flex items-end gap-2">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div className={`w-full ${colorClass} rounded-t opacity-80 hover:opacity-100 transition-opacity`} style={{ height: '100%' }} />
            <span className="text-xs text-gray-400">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatChart;
