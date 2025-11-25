
import React from 'react';
import { TitleSuggestion, ImageModelId, AspectRatio } from '../types';
import { Image as ImageIcon, Download, RefreshCw, Settings2, Edit3, Monitor, Smartphone, Square } from 'lucide-react';
import { Loader } from './Loader';

interface ThumbnailGeneratorProps {
  selectedTitle: TitleSuggestion | null;
  onGenerate: () => void;
  isLoading: boolean;
  imageBase64: string | null;
  currentVisualPrompt: string;
  onPromptChange: (prompt: string) => void;
  selectedModel: ImageModelId;
  onModelChange: (model: ImageModelId) => void;
  selectedAspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({
  selectedTitle,
  onGenerate,
  isLoading,
  imageBase64,
  currentVisualPrompt,
  onPromptChange,
  selectedModel,
  onModelChange,
  selectedAspectRatio,
  onAspectRatioChange
}) => {
  if (!selectedTitle) return null;

  // Helper to determine aspect ratio class for preview container
  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16] max-w-[300px] mx-auto';
      case '1:1': return 'aspect-square max-w-[400px] mx-auto';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4] max-w-[350px] mx-auto';
      default: return 'aspect-video';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
            <ImageIcon className="text-purple-400" size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Thumbnail AI</h2>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
        
        {/* Settings Row */}
        <div className="grid grid-cols-2 gap-3">
            {/* Model Selection */}
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Settings2 size={12} /> Mô hình
                </label>
                <select 
                    value={selectedModel}
                    onChange={(e) => onModelChange(e.target.value as ImageModelId)}
                    className="w-full bg-gray-800 text-white text-sm rounded border border-gray-600 px-2 py-1.5 outline-none focus:border-indigo-500"
                    disabled={isLoading}
                >
                    <option value="gemini-2.5-flash-image">Nano Banana (Flash)</option>
                    <option value="gemini-3-pro-image-preview">Nano Banana Pro</option>
                    <option value="imagen-3.0-generate-001">Imagen 3</option>
                    <option value="imagen-4.0-generate-001">Imagen 4</option>
                </select>
            </div>

            {/* Aspect Ratio Selection */}
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    {selectedAspectRatio === '16:9' ? <Monitor size={12} /> : 
                     selectedAspectRatio === '9:16' ? <Smartphone size={12} /> : <Square size={12} />}
                     Kích thước
                </label>
                <select 
                    value={selectedAspectRatio}
                    onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
                    className="w-full bg-gray-800 text-white text-sm rounded border border-gray-600 px-2 py-1.5 outline-none focus:border-indigo-500"
                    disabled={isLoading}
                >
                    <option value="16:9">16:9 (YouTube Video)</option>
                    <option value="9:16">9:16 (Shorts/TikTok)</option>
                    <option value="1:1">1:1 (Instagram/Square)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                </select>
            </div>
        </div>

        {/* Loading State */}
        {isLoading && (
            <div className={`border border-gray-700 bg-gray-900/50 rounded-lg flex flex-col items-center justify-center p-4 transition-all ${getAspectRatioClass(selectedAspectRatio)}`}>
                <Loader message="Đang vẽ thumbnail & chèn chữ..." />
            </div>
        )}

        {/* Result */}
        {imageBase64 && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            <div className={`relative group rounded-lg overflow-hidden border border-gray-600 shadow-2xl transition-all ${getAspectRatioClass(selectedAspectRatio)}`}>
              <img 
                src={`data:image/jpeg;base64,${imageBase64}`} 
                alt="AI Generated Thumbnail" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for quick download */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a 
                    href={`data:image/jpeg;base64,${imageBase64}`} 
                    download={`thumbnail-${selectedAspectRatio}-${Date.now()}.jpg`}
                    className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <Download size={18} /> Tải xuống
                </a>
              </div>
            </div>

            {/* Editable Prompt */}
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
                    <Edit3 size={12} />
                    <span>Prompt mô tả (Có thể sửa):</span>
                </div>
                <textarea
                    value={currentVisualPrompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    className="w-full bg-gray-800 text-gray-300 text-xs p-2 rounded border border-gray-600 focus:border-indigo-500 outline-none h-20 resize-none"
                    placeholder="Mô tả hình ảnh thumbnail..."
                />
            </div>
            
            <button
                onClick={onGenerate}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
                <RefreshCw size={14} />
                Vẽ lại (Sử dụng prompt trên)
            </button>
          </div>
        )}
        
        {!isLoading && !imageBase64 && (
            <div className="text-center text-gray-400 py-8 text-sm px-4">
                <p>Chọn mô hình và kích thước, sau đó nhấn "Bắt đầu Tạo" ở trên.</p>
                {selectedModel === 'gemini-3-pro-image-preview' && (
                    <p className="mt-2 text-yellow-500 text-xs">
                        Lưu ý: Mô hình Nano Banana Pro yêu cầu chọn dự án có Billing.
                    </p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
