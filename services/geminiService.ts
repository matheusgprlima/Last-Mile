import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, DISCOVERY_SYSTEM_INSTRUCTION } from "../prompts";
import { AnalysisResponse, DiscoveryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeEvidence = async (text: string): Promise<AnalysisResponse> => {
  try {
    // We strictly follow the prompt requirement to provide a baseline_history_index.
    // Since we don't have persistence yet, we pass an empty list.
    const combinedPrompt = `
INPUT TEXT:
${text}

BASELINE HISTORY INDEX (JSON):
[]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: combinedPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error("No response received from model");
    }

    const parsedResult = JSON.parse(responseText);
    return parsedResult as AnalysisResponse;

  } catch (error) {
    console.error("Error analyzing evidence:", error);
    throw error;
  }
};

export const analyzeDiscovery = async (text: string): Promise<DiscoveryResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: DISCOVERY_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error("No response received from Discovery Monitor");
    }

    const parsedResult = JSON.parse(responseText);
    return parsedResult as DiscoveryResponse;

  } catch (error) {
    console.error("Error analyzing discovery:", error);
    throw error;
  }
};