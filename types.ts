export type Category = 
  | "Discovery" 
  | "Diagnostics" 
  | "Treatment" 
  | "Prevention" 
  | "Long-acting" 
  | "Vaccines" 
  | "Cure Research";

export type Status = 
  | "Validated" 
  | "Implementation" 
  | "Ongoing" 
  | "Experimental" 
  | "Superseded";

export interface Identifier {
  type: "PMID" | "DOI" | "NCT";
  id: string;
  citation?: string | null;
}

export interface QuantitativeFinding {
  metric: string;
  value: string;
  context: string;
  source: Identifier;
}

export interface SecondarySource {
  publisher: "WHO" | "CDC" | "NIH" | "UNAIDS" | "FDA" | "EMA" | "Other";
  title: string | null;
  year: number | null;
}

export interface LightCard {
  id: string;
  title: string;
  year: number;
  month: number | null;
  category: Category;
  status: Status;
  one_liner: string;
  primary_ids: Identifier[];
  tags: string[];
}

export interface FullCard {
  canonical_claim: string;
  why_it_matters_today: string;
  what_was_validated: string[];
  limitations: string[];
  scientific_gaps: string[];
  implementation_gaps: string[];
  quantitative_findings: QuantitativeFinding[];
  sources: {
    primary: Identifier[];
    secondary: SecondarySource[];
  };
}

export interface NewCard {
  light: LightCard;
  full: FullCard;
}

export interface Match {
  existing_id: string;
  reason: string;
}

export interface MergePlan {
  insert_by_date: boolean;
  sort_key: string;
  notes: string[];
}

export interface AnalysisResponse {
  rejected: boolean;
  reason?: string;
  matches_existing?: Match[];
  new_cards?: NewCard[];
  merge_plan?: MergePlan;
}

export interface DiscoveryCard {
  id: string;
  title: string;
  country_or_region: string;
  discovery_type: "Public Health Impact" | "Clinical Trial" | "Policy" | "Implementation" | "Research";
  summary: string;
  why_this_matters: string;
  date_announced: string;
  sources: string[];
  source_labels?: string[];
  confidence_basis: string;
}

export interface DiscoveryResponse {
  discovery_cards: DiscoveryCard[];
  rejected_items?: { reason: string }[];
}

// --- NEW AGENT TYPES ---

/** When user topic belongs to another agent, refer them by name. */
export interface AgentHandoff {
  topic: string;
  referToAgentName: string;
  /** Explicit keywords/phrases that force handoff (model checks these first). */
  triggerKeywords?: string[];
}

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string; // lucide icon name reference
  capabilities: string[];
  /** Strict scope: what this agent MUST limit itself to. Used for stop criteria. */
  inScope: string;
  /** Topics that belong to other agents: do not answer; refer user to that agent. */
  handoffTopics: AgentHandoff[];
}

export interface UserProgress {
  viewedMilestones: string[];
  completedHelpSteps: string[];
  lastActive: number;
}

// Get Help — regenerate links (Gemini)
export interface HelpLinkRegenerateItem {
  label: string;
  url: string;
  authority: string;
  note?: string | null;
}

export interface RegenerateHelpLinksResponse {
  links: HelpLinkRegenerateItem[];
}