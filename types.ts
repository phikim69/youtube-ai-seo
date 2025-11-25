
export interface TitleSuggestion {
  text: string;
  hookType: string; // e.g., "Curiosity", "Urgency", "How-to"
  score: number; // 1-100 predicted CTR potential
}

export interface VideoDetails {
  hashtags: string[];
  keywords: string[];
  seoTips: string[];
  visualPrompt: string; // A prompt optimized for the image generator
  description: string; // New field for generated video description
}

export type ImageModelId = 
  | 'gemini-2.5-flash-image'
  | 'gemini-3-pro-image-preview'
  | 'imagen-3.0-generate-001'
  | 'imagen-4.0-generate-001';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export interface AppState {
  originalInput: string;
  isLoadingTitles: boolean;
  isLoadingDetails: boolean;
  titles: TitleSuggestion[];
  selectedTitle: TitleSuggestion | null;
  videoDetails: VideoDetails | null;
  currentVisualPrompt: string; // Add editable prompt state
  generatedImageBase64: string | null;
  error: string | null;
  selectedImageModel: ImageModelId;
  selectedAspectRatio: AspectRatio;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
