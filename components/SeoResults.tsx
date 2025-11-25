
import React from 'react';
import { Hash, Key, Lightbulb, FileText, Copy, Check } from 'lucide-react';

interface SeoResultsProps {
  hashtags: string[];
  keywords: string[];
  tips: string[];
  description?: string;
}

export const SeoResults: React.FC<SeoResultsProps> = ({ hashtags, keywords, tips, description }) => {
  const [copiedDesc, setCopiedDesc] = React.useState(false);

  const handleCopyDescription = () => {
    if (description) {
      navigator.clipboard.writeText(description);
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Description - New Section */}
      {description && (
        <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5 relative group">
           <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="text-green-400" size={20} />
              <h3 className="font-semibold text-white">Mô tả Video (Chuẩn SEO 2025)</h3>
            </div>
            <button 
              onClick={handleCopyDescription}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
            >
              {copiedDesc ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
              {description}
            </p>
          </div>
        </div>
      )}

      {/* Hashtags */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="text-pink-400" size={20} />
          <h3 className="font-semibold text-white">Đề xuất Hashtag</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, i) => (
            <span key={i} className="text-sm bg-pink-500/10 text-pink-300 px-3 py-1 rounded-full border border-pink-500/20 hover:bg-pink-500/20 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Key className="text-amber-400" size={20} />
          <h3 className="font-semibold text-white">Từ khoá SEO (Tags)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <span key={i} className="text-sm bg-amber-500/10 text-amber-300 px-3 py-1 rounded-md border border-amber-500/20">
              {kw}
            </span>
          ))}
        </div>
        <div className="mt-3">
             <button 
                onClick={() => navigator.clipboard.writeText(keywords.join(','))}
                className="text-xs text-gray-400 hover:text-white underline decoration-dashed"
             >
                Copy tất cả (cách nhau bởi dấu phẩy)
             </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-900/20 rounded-xl border border-blue-800/50 p-5">
         <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="text-yellow-400" size={20} />
          <h3 className="font-semibold text-white">Mẹo tối ưu Video này</h3>
        </div>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="text-sm text-gray-300 flex gap-2">
              <span className="text-blue-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
