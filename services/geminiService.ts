import { GoogleGenAI } from "@google/genai";
import { CATEGORIES } from '../constants';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are NEXA, the AI assistant for Marouan Anouar's personal portfolio website (N E X A 1337).
Your goal is to answer questions about Marouan based on his portfolio data.

Here is the context about Marouan:
- Brand: N E X A 1337
- Interests: Architecture, IT, Cybersecurity, Gaming, Business, AI, Superbikes.
- Details:
${JSON.stringify(CATEGORIES.map(c => ({ title: c.title, role: c.role, bio: c.bio, skills: c.skills.map(s => s.name).join(', ') })))}

Tone: Professional, enthusiastic, futuristic, and helpful.
If asked about contact info, refer them to the Contact page or email contact@marouananouar.com.
Keep answers concise (under 100 words) unless asked for details.
`;

export const chatWithNexa = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a glitch in the matrix. Please try again later.";
  }
};