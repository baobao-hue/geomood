import { GoogleGenAI, Type } from "@google/genai";
import { GemWisdom } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export { type GemWisdom };

export const analyzeGemstone = async (
  entryContent: string,
  moodScore: number
): Promise<GemWisdom | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key missing.");
    return null;
  }

  try {
    const modelId = "gemini-3-flash-preview"; 
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `
        用户写了一篇日记，情绪分数是 ${moodScore} (0=悲伤, 1=快乐).
        内容: "${entryContent.substring(0, 800)}..."
        
        他们在心灵地层中挖掘到了一块矿物。请生成一份“矿物档案卡”。
        请用**中文**回答。
        
        1. mineralName: 奇幻矿物名（如：深渊之泪、凝固的午后、星尘碎片）。
        2. composition: 分析这种情绪的化学成分（如：“60% 的焦虑，30% 的期待，10% 的疲惫”）。
        3. quote: 从日记中摘录最能代表这种情绪的一句话（如果太长请适当缩减，如果太短请润色）。
        4. advice: 一句简短的治愈系考古笔记/建议。
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mineralName: { type: Type.STRING },
            composition: { type: Type.STRING },
            quote: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ["mineralName", "composition", "quote", "advice"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GemWisdom;
    }
    return null;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};
