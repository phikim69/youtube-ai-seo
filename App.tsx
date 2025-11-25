
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { TitleList } from './components/TitleList';
import { SeoResults } from './components/SeoResults';
import { ThumbnailGenerator } from './components/ThumbnailGenerator';
import { AppState, TitleSuggestion, ImageModelId, AspectRatio } from './types';
import { generateVideoTitles, generateVideoDetails, generateThumbnailImage } from './services/geminiService';
import { AlertCircle, Wand2, Youtube, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalInput: '',
    isLoadingTitles: false,
    isLoadingDetails: false,
    titles: [],
    selectedTitle: null,
    videoDetails: null,
    currentVisualPrompt: '',
    generatedImageBase64: null,
    error: null,
    selectedImageModel: 'gemini-2.5-flash-image', // Default to Nano Banana
    selectedAspectRatio: '16:9', // Default Aspect Ratio
  });

  const handleInputSubmit = async (input: string) => {
    setState(prev => ({ 
        ...prev, 
        isLoadingTitles: true, 
        error: null, 
        titles: [],
        selectedTitle: null, 
        videoDetails: null, 
        generatedImageBase64: null,
        currentVisualPrompt: '',
        originalInput: input
    }));

    try {
      const titles = await generateVideoTitles(input);
      setState(prev => ({
        ...prev,
        isLoadingTitles: false,
        titles: titles
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isLoadingTitles: false,
        error: "Không thể phân tích dữ liệu. Vui lòng kiểm tra API Key hoặc thử lại sau."
      }));
    }
  };

  const handleTitleSelect = (title: TitleSuggestion) => {
    // Reset details if changing title selection
    if (state.selectedTitle?.text !== title.text) {
        setState(prev => ({ 
            ...prev, 
            selectedTitle: title, 
            videoDetails: null, 
            generatedImageBase64: null,
            currentVisualPrompt: ''
        }));
    }
  };

  const handleModelChange = (model: ImageModelId) => {
      setState(prev => ({ ...prev, selectedImageModel: model }));
  };
  
  const handleAspectRatioChange = (ratio: AspectRatio) => {
      setState(prev => ({ ...prev, selectedAspectRatio: ratio }));
  };

  const handlePromptChange = (newPrompt: string) => {
      setState(prev => ({ ...prev, currentVisualPrompt: newPrompt }));
  };

  const ensureApiKeyForProModel = async (modelId: ImageModelId) => {
    if (modelId === 'gemini-3-pro-image-preview') {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          try {
            await window.aistudio.openSelectKey();
          } catch (e) {
            console.error("Key selection failed or cancelled", e);
          }
        }
      }
    }
  };

  const handleConfirmAndGenerate = async () => {
    if (!state.selectedTitle) return;

    setState(prev => ({ ...prev, isLoadingDetails: true, error: null }));

    try {
      // Step 1: Generate SEO Details
      const details = await generateVideoDetails(state.selectedTitle.text);
      
      setState(prev => ({
        ...prev,
        videoDetails: details,
        currentVisualPrompt: details.visualPrompt
      }));

      // Check Key if using Pro model
      await ensureApiKeyForProModel(state.selectedImageModel);

      // Step 2: Generate Thumbnail
      try {
        const imageBase64 = await generateThumbnailImage(
            state.selectedTitle.text, 
            details.visualPrompt, 
            state.selectedImageModel,
            state.selectedAspectRatio
        );
        setState(prev => ({
            ...prev,
            isLoadingDetails: false,
            generatedImageBase64: imageBase64
        }));
      } catch (imgErr) {
          console.error("Image generation failed", imgErr);
          setState(prev => ({
              ...prev,
              isLoadingDetails: false,
              error: "Đã tạo SEO nhưng lỗi khi tạo hình ảnh (Có thể do mô hình đang bận hoặc không hỗ trợ). Bạn có thể thử mô hình khác."
          }));
      }

    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isLoadingDetails: false,
        error: "Không thể tạo nội dung chi tiết. Vui lòng thử lại."
      }));
    }
  };

  const handleRegenerateThumbnail = async () => {
    if (!state.selectedTitle || !state.currentVisualPrompt) return;
    
    setState(prev => ({ ...prev, isLoadingDetails: true, error: null })); 
    try {
        await ensureApiKeyForProModel(state.selectedImageModel);

        const imageBase64 = await generateThumbnailImage(
            state.selectedTitle.text, 
            state.currentVisualPrompt, 
            state.selectedImageModel,
            state.selectedAspectRatio
        );
        setState(prev => ({
            ...prev,
            isLoadingDetails: false,
            generatedImageBase64: imageBase64
        }));
    } catch (err) {
        setState(prev => ({ ...prev, isLoadingDetails: false, error: "Lỗi tạo lại ảnh. Hãy thử mô hình khác." }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 selection:bg-indigo-500 selection:text-white pb-10 flex flex-col">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 flex-grow">
        
        {/* Header / Input Section */}
        <section className="mb-12">
           <InputForm onSubmit={handleInputSubmit} isLoading={state.isLoadingTitles} />
        </section>

        {/* Error Message */}
        {state.error && (
            <div className="max-w-2xl mx-auto mb-8 bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg flex items-center gap-3 animate-pulse">
                <AlertCircle size={20} />
                <p>{state.error}</p>
            </div>
        )}

        {/* Main Content Grid */}
        {state.titles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            {/* Left Column: Titles & SEO Text Results */}
            <div className="lg:col-span-7 space-y-8">
              <TitleList 
                titles={state.titles} 
                selectedTitle={state.selectedTitle} 
                onSelect={handleTitleSelect} 
              />
              
              {/* Moved SEO Results here to align with the column */}
              {state.videoDetails && (
                 <div className="animate-fade-in">
                    <SeoResults 
                        description={state.videoDetails.description}
                        hashtags={state.videoDetails.hashtags}
                        keywords={state.videoDetails.keywords}
                        tips={state.videoDetails.seoTips}
                    />
                 </div>
              )}
            </div>

            {/* Right Column: Controls & Visuals */}
            <div className="lg:col-span-5 space-y-6">
                {/* Confirmation Box */}
                <div className="sticky top-8 space-y-6">
                    <div className={`
                        p-6 rounded-xl border border-gray-700 transition-all duration-300
                        ${state.selectedTitle ? 'bg-gray-800/80 shadow-2xl' : 'bg-gray-800/30 opacity-50'}
                    `}>
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <Wand2 className="text-purple-400" />
                            Xác nhận & Tạo Nội dung
                        </h2>
                        
                        {!state.selectedTitle ? (
                            <p className="text-gray-400">Vui lòng chọn một tiêu đề bên trái để tiếp tục.</p>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-gray-300">
                                    Bạn đã chọn: <br/>
                                    <span className="font-semibold text-white italic">"{state.selectedTitle.text}"</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    AI sẽ tạo Hashtag, Từ khoá SEO, và Thumbnail dựa trên tiêu đề này.
                                </p>
                                
                                <button
                                    onClick={handleConfirmAndGenerate}
                                    disabled={state.isLoadingDetails}
                                    className={`
                                        w-full py-4 rounded-lg font-bold text-lg shadow-lg flex justify-center items-center gap-2
                                        transition-all duration-200
                                        ${state.isLoadingDetails 
                                            ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-purple-500/25'}
                                    `}
                                >
                                    {state.isLoadingDetails ? 'Đang xử lý...' : 'Bắt đầu Tạo (SEO & Thumbnail)'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Visual Results Display */}
                    <div className="animate-fade-in space-y-6">
                        <ThumbnailGenerator 
                            selectedTitle={state.selectedTitle}
                            onGenerate={handleRegenerateThumbnail}
                            isLoading={state.isLoadingDetails && !state.generatedImageBase64}
                            imageBase64={state.generatedImageBase64}
                            currentVisualPrompt={state.currentVisualPrompt}
                            onPromptChange={handlePromptChange}
                            selectedModel={state.selectedImageModel}
                            onModelChange={handleModelChange}
                            selectedAspectRatio={state.selectedAspectRatio}
                            onAspectRatioChange={handleAspectRatioChange}
                        />
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-gray-800/50 bg-[#0f172a]/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-8 text-center space-y-2">
            <h3 className="text-lg font-semibold text-white flex items-center justify-center gap-2">
                <Youtube className="text-red-500" />
                Phát Triển Bởi Phi Kim
            </h3>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                <a href="https://phongthuy69.com">PhongThuy69.Com</a> <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" />
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
