import React from 'react';
import { TitleSuggestion } from '../types';
import { CheckCircle2, TrendingUp, Zap } from 'lucide-react';

interface TitleListProps {
  titles: TitleSuggestion[];
  selectedTitle: TitleSuggestion | null;
  onSelect: (title: TitleSuggestion) => void;
}

export const TitleList: React.FC<TitleListProps> = ({ titles, selectedTitle, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Zap className="text-indigo-400" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">1. Chọn Tiêu Đề Chuẩn SEO</h2>
      </div>

      <div className="grid gap-3">
        {titles.map((t, idx) => {
          const isSelected = selectedTitle?.text === t.text;
          return (
            <div
              key={idx}
              onClick={() => onSelect(t)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'bg-indigo-900/30 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                }
              `}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {t.text}
                  </h3>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                      {t.hookType}
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                      <TrendingUp size={12} /> Score: {t.score}
                    </span>
                  </div>
                </div>
                
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-gray-500'}
                `}>
                  {isSelected && <CheckCircle2 size={16} className="text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};