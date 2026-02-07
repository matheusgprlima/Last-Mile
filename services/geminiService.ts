import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, DISCOVERY_SYSTEM_INSTRUCTION, HELP_LINKS_SYSTEM_INSTRUCTION } from "../prompts.js";
import type { AnalysisResponse, DiscoveryResponse, RegenerateHelpLinksResponse } from "../types.js";

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

export interface RegenerateHelpLinksInput {
  cardId: string;
  title: string;
  description: string;
  locationLabel: string;
  currentLinkLabels?: string[];
}

export const regenerateHelpLinks = async (input: RegenerateHelpLinksInput): Promise<RegenerateHelpLinksResponse> => {
  try {
    const prompt = `
CARD ID: ${input.cardId}
TITLE: ${input.title}
DESCRIPTION: ${input.description}
LOCATION: ${input.locationLabel}
${input.currentLinkLabels?.length ? `CURRENT LINK PURPOSES (replace with working URLs): ${input.currentLinkLabels.join(", ")}` : ""}

Return 2 to 5 current, official HTTPS links that help users get this resource in ${input.locationLabel}. Use only real, stable URLs (government, WHO, UNAIDS, HRSA, state health, PAHO, UNRWA, UNHCR, etc.). No placeholders.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: HELP_LINKS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from model");
    }

    const parsed = JSON.parse(responseText) as RegenerateHelpLinksResponse;
    if (!Array.isArray(parsed?.links)) {
      throw new Error("Invalid response shape: links array required");
    }
    // Normalize: ensure https and note optional
    parsed.links = parsed.links.map((l: { label?: string; url?: string; authority?: string; note?: string | null }) => ({
      label: typeof l.label === "string" ? l.label : "Resource",
      url: typeof l.url === "string" && l.url.startsWith("http") ? l.url : "",
      authority: typeof l.authority === "string" ? l.authority : "LocalGov",
      note: l.note ?? null
    })).filter((l: { url: string }) => l.url.startsWith("https"));
    return parsed;
  } catch (error) {
    console.error("Error regenerating help links:", error);
    throw error;
  }
};