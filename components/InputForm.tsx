import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface InputFormProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 pb-2">
        YouTube SEO & Thumbnail AI
      </h1>
      <p className="text-gray-400 text-lg">
        Nhập tiêu đề hoặc ý tưởng video của bạn, AI sẽ tối ưu hóa toàn bộ.
      </p>
      
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-gray-900 rounded-xl border border-gray-700 focus-within:border-indigo-500 transition-colors p-2">
          <input
            type="text"
            className="flex-grow bg-transparent text-white px-4 py-3 outline-none placeholder-gray-500 text-lg"
            placeholder="Ví dụ: Cách làm vlog du lịch..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <span>Đang nghĩ...</span>
            ) : (
              <>
                <Search size={20} />
                <span>Phân tích</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};