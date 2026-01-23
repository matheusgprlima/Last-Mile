import { AgentPersona } from "../types";

export const AGENTS: AgentPersona[] = [
  {
    id: "testing",
    name: "Locator",
    role: "Testing Guide",
    description: "Find free, anonymous HIV testing near you. Answers questions about windows, types of tests, and requirements.",
    icon: "TestTube",
    capabilities: ["Find Testing Sites", "Explain Test Types", "Privacy Rights"]
  },
  {
    id: "treatment",
    name: "Access",
    role: "Treatment Specialist",
    description: "Navigate the path to ART (Antiretroviral Therapy). Immigrant-safe, insurance-agnostic guidance.",
    icon: "Pill",
    capabilities: ["Start Treatment", "Insurance Help", "Immigrant Access"]
  },
  {
    id: "prevention",
    name: "Shield",
    role: "PrEP / PEP Guide",
    description: "Emergency PEP access (72h window) and long-term PrEP navigation.",
    icon: "Shield",
    capabilities: ["Emergency PEP", "Get PrEP", "Cost Assistance"]
  },
  {
    id: "navigation",
    name: "Compass",
    role: "System Navigator",
    description: "Step-by-step bureaucratic guidance. Translates forms, acronyms, and systems into plain language.",
    icon: "Compass",
    capabilities: ["Form Helper", "System Translator", "Step-by-Step Guides"]
  }
];

export const getAgentById = (id: string): AgentPersona | undefined => {
  return AGENTS.find(a => a.id === id);
};