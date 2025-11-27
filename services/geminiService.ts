import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the Gemini client
// Note: In a real production app, you might proxy this through a backend to protect the key,
// but for this frontend-only demo, we use the env variable directly as instructed.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    return "I'm sorry, my connection to the stadium is down (API Key missing). Please check the configuration.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'Coach AI', the official AI assistant for WhaTheFOOTBALL. 
        Your tone is energetic, sporty, and helpful. 
        You help users find events, understand football rules, or get hyped for matches.
        Keep answers concise (under 100 words) and use football metaphors where appropriate.
        If asked about the app features, mention: Event Booking, Fan Clubs, Score Prediction, and Fantasy Team Creation.`,
        temperature: 0.7,
      },
    });

    return response.text || "The referee is reviewing that play... (No response generated)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Foul play on the network! Please try again later.";
  }
};