import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const callGemini = async (prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key not found");
    return "API Key not configured.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "שגיאה בתקשורת עם השרת.";
  }
};

export const analyzeFinancialText = async (text: string): Promise<string | null> => {
    // This function will guide the AI to return a JSON structure based on the user's natural language input
    // We expect the result to be a JSON string that can be parsed by the frontend
    const systemPrompt = `
    You are a financial data parser. 
    The user will provide a sentence describing a debt, loan, or payment in Hebrew.
    You must extract the data and return ONLY a valid JSON object.
    
    Target format (Liability/Loan):
    {
      "type": "liability",
      "creditor": "Name",
      "amount": 1000,
      "currency": "ILS",
      "date": "YYYY-MM-DD",
      "note": "Description"
    }

    Target format (Receivable):
    {
      "type": "receivable",
      "name": "Name",
      "amount": 1000,
      "currency": "ILS",
      "date": "YYYY-MM-DD",
      "note": "Description"
    }
    
    If you cannot parse it, return {"error": "cannot parse"}.
    Return ONLY JSON.
    `;
    
    const combinedPrompt = `${systemPrompt}\n\nUser Input: "${text}"`;
    return callGemini(combinedPrompt);
}