import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

export const isAIEnabled = !!apiKey;

export const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!apiKey) return "AI 功能未啟用 (請設定 API Key)";

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Using standard flash model for best performance/speed balance
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
    });

    return response.text || "抱歉，AI 暫時無法回應，請稍後再試。";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "抱歉，AI 暫時無法回應，請稍後再試。";
  }
};