import { GoogleGenAI, Type } from "@google/genai";
import { User } from "../types";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real prod app, we handle missing keys gracefully. 
// Here we assume it exists as per instructions.

const ai = new GoogleGenAI({ apiKey });

export const getSmartMatchAdvice = async (currentUser: User, matchUser: User): Promise<string> => {
  if (!apiKey) return "AI advice unavailable (Missing API Key).";

  const prompt = `
    I have two users on a skill swap platform.
    User 1 (Me): ${currentUser.name}, offers: ${currentUser.skillsOffered.map(s => s.name).join(', ')}, wants: ${currentUser.skillsWanted.map(s => s.name).join(', ')}. Bio: ${currentUser.bio}.
    User 2 (Match): ${matchUser.name}, offers: ${matchUser.skillsOffered.map(s => s.name).join(', ')}, wants: ${matchUser.skillsWanted.map(s => s.name).join(', ')}. Bio: ${matchUser.bio}.

    Write a short, encouraging 2-sentence conversation starter for me to send to User 2 to initiate a skill swap.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Hey! I think we could help each other learn.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hey! I think we could help each other learn.";
  }
};

export const getLearningRoadmap = async (skill: string): Promise<any> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a simple 3-step learning roadmap for learning "${skill}". Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
