import React from 'react';
import { Search, X, Calendar } from 'lucide-react';

interface SearchFilterProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  startDate?: string;
  onStartDateChange?: (value: string) => void;
  endDate?: string;
  onEndDateChange?: (value: string) => void;
  onReset: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  statusOptions = [],
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
}) => {
  return (
    <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="搜索关键词..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>

        {onStatusChange && statusOptions.length > 0 && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
          >
            <option value="">全部状态</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {onStartDateChange && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <span className="text-gray-500">至</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange && onEndDateChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
        )}

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
        >
          <X className="w-4 h-4" />
          重置
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
