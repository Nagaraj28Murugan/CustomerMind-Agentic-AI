
import { GoogleGenAI, Type } from "@google/genai";
import { Customer, AgentAction, CustomerStatus, ModelType } from "../types";
import { SYSTEM_INSTRUCTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeCustomerBehavior = async (customer: Customer): Promise<{
  prediction: CustomerStatus;
  healthScore: number;
  reasoning: string;
}> => {
  const response = await ai.models.generateContent({
    model: ModelType.FLASH,
    contents: `Analyze this customer data and predict their current status and a health score (0-100).
    Customer: ${JSON.stringify(customer)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prediction: { type: Type.STRING, description: 'One of: ONBOARDING, ACTIVE, CHURN_RISK, UPSELL_READY, CHURNED' },
          healthScore: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ['prediction', 'healthScore', 'reasoning']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse analysis:", e);
    return { prediction: customer.status, healthScore: customer.healthScore, reasoning: 'Analysis failed' };
  }
};

export const decideNextAction = async (customer: Customer, analysis: any): Promise<Partial<AgentAction>> => {
  const response = await ai.models.generateContent({
    model: ModelType.PRO,
    contents: `Based on this customer analysis, decide the single best next action to take.
    Analysis: ${JSON.stringify(analysis)}
    Customer: ${JSON.stringify(customer)}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          actionType: { type: Type.STRING, description: 'One of: SEND_EMAIL, OFFER_DISCOUNT, SCHEDULE_CALL, SEND_TUTORIAL, NOTIFY_SALES' },
          thoughtProcess: { type: Type.STRING },
          content: { type: Type.STRING, description: 'The actual message or internal note content' }
        },
        required: ['actionType', 'thoughtProcess', 'content']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse decision:", e);
    return { actionType: 'SEND_EMAIL', thoughtProcess: 'Defaulting due to error', content: 'Hello' };
  }
};
