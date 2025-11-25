
import { GoogleGenAI, Type } from "@google/genai";
import { TitleSuggestion, VideoDetails, ImageModelId, AspectRatio } from "../types";

export const generateVideoTitles = async (videoInput: string): Promise<TitleSuggestion[]> => {
  const apiKey = process.env.API_KEY || 'AIzaSyB1fRdetoE_EvGcit-oXVNh6m2RwyEs4ps';
  if (!apiKey) throw new Error("API Key is missing.");
  
  // Initialize client inside function to pick up any key changes
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are a world-class YouTube SEO Expert and Copywriter.
    I have a video topic/idea: "${videoInput}".
    
    Task:
    Generate 5 catchy, high-CTR (Click Through Rate) titles in Vietnamese. 
    Each title should have a "hook" (curiosity, urgency, benefit, shock, etc.) and be optimized for search intent.
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                hookType: { type: Type.STRING },
                score: { type: Type.NUMBER, description: "Predicted score out of 100" }
              }
            }
          }
        },
        required: ["titles"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No data received from Gemini.");
  }

  const data = JSON.parse(response.text) as { titles: TitleSuggestion[] };
  return data.titles;
};

export const generateVideoDetails = async (selectedTitle: string): Promise<VideoDetails> => {
  const apiKey = process.env.API_KEY || 'AIzaSyB1fRdetoE_EvGcit-oXVNh6m2RwyEs4ps';
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are a YouTube Growth Hacker.
    The user has selected the following title for their video: "${selectedTitle}".
    
    Task:
    1. Generate a list of 10 relevant, trending hashtags (#).
    2. Generate a list of 15 strong SEO keywords/tags strictly related to this title.
    3. Provide 3 specific, actionable tips to rank this video #1 for this specific title. The tips MUST be in Vietnamese.
    4. Write a detailed visual prompt in English for a YouTube thumbnail. 
       - It must describe the background, main subject, and mood.
       - It must explicitly mention where to place text to make it "pop".
    5. Write a professional, SEO-optimized YouTube Video Description (Standard 2025) in Vietnamese.
       - It MUST include relevant Emojis/Icons (🚀, 🎬, ✅, 👇, etc.) to be engaging.
       - Structure:
         *   **Introduction**: Hook the viewer and repeat the keyword in the first 2 sentences.
         *   **Content Overview**: Bullet points of what is covered.
         *   **Call to Action (CTA)**: Subscribe, Like, Comment.
         *   **Timestamps**: Add a placeholder for timestamps.
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          seoTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualPrompt: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["hashtags", "keywords", "seoTips", "visualPrompt", "description"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No data received from Gemini.");
  }

  return JSON.parse(response.text) as VideoDetails;
};

export const generateThumbnailImage = async (
  title: string, 
  visualPrompt: string, 
  modelId: ImageModelId = "gemini-2.5-flash-image",
  aspectRatio: AspectRatio = "16:9"
): Promise<string> => {
  const apiKey = process.env.API_KEY || 'AIzaSyA8r5UDBjEYPmZMnRvqzPZi1a5FW_KTthM';
  if (!apiKey) throw new Error("API Key is missing.");

  // Re-initialize client to ensure it uses the latest selected key (for Pro models)
  const ai = new GoogleGenAI({ apiKey });

  const finalPrompt = `
    Create a high-converting YouTube thumbnail.
    Aspect Ratio: ${aspectRatio}.
    Style: Vibrant, High Contrast, 4K resolution, Digital Art or Photorealistic.
    
    Visual Description: ${visualPrompt}
    
    CRITICAL INSTRUCTION - TEXT RENDERING:
    You MUST include the text "${title}" prominently in the image.
    - The text should be in a bold, sans-serif font.
    - Use high contrast colors (e.g., Yellow text on Dark background, or White with Black outline).
    - Make the text the focal point of the composition alongside the main subject.
    - Emphasize keywords in the title by making them larger or a different color if possible.
  `;

  // Imagen Models (Imagen 3, Imagen 4, etc.)
  if (modelId.startsWith('imagen')) {
    const response = await ai.models.generateImages({
      model: modelId,
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });
    
    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      return imageBytes;
    }
    throw new Error("No image data received from Imagen.");
  } 
  
  // Gemini Models (Nano Banana / Flash Image, Nano Banana Pro / Pro Image)
  else {
    const config: any = {
      imageConfig: {
        aspectRatio: aspectRatio
      }
    };
    
    // Config specific to gemini-3-pro-image-preview
    if (modelId === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = '1K';
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: config
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data; 
        }
      }
    }
    throw new Error("No image data received from Gemini.");
  }
};
