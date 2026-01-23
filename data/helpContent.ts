export type Authority = "CDC" | "CDPH" | "HIV.gov" | "UNAIDS" | "WHO" | "NIH" | "LocalGov" | "NGO_Legal" | "HRSA";

export interface HelpLink {
  label: string;
  url: string;
  authority: Authority;
  note?: string;
}

export interface HelpCard {
  id: "testing" | "treatment" | "prep_pep" | "support" | "immigrant_legal" | "emergency";
  title: string;
  description: string;
  links: HelpLink[];
  eligibility_notes?: string[];
  what_you_need?: string[];
}

export type LocationKey = {
  country: string;
  region?: string; // State for US
};

// Content Map Type
type HelpContentMap = Record<string, HelpCard[]>;

// --- DATA CONFIGURATION ---

const US_CA_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "HIV Testing Services",
    description: "Find free, confidential, and fast testing locations near you.",
    links: [
      {
        label: "Find Testing Sites (CDC)",
        url: "https://gettested.cdc.gov/",
        authority: "CDC",
        note: "Search by zip code"
      },
      {
        label: "HIV.gov Services Locator",
        url: "https://locator.hiv.gov/",
        authority: "HIV.gov"
      }
    ],
    what_you_need: ["No ID required for most anonymous sites", "Walk-ins often accepted"]
  },
  {
    id: "treatment",
    title: "Treatment Access & ADAP",
    description: "Access medication assistance (ADAP) and medical care regardless of insurance status.",
    links: [
      {
        label: "CA ADAP (Office of AIDS)",
        url: "https://www.cdph.ca.gov/Programs/CID/DOA/Pages/OAmain.aspx#",
        authority: "CDPH",
        note: "Official State Program"
      },
      {
        label: "Find a Health Center (HRSA)",
        url: "https://findahealthcenter.hrsa.gov/",
        authority: "HRSA",
        note: "Low-cost/Sliding scale care"
      }
    ],
    eligibility_notes: [
      "Must be a resident of California",
      "Must have a positive HIV/AIDS diagnosis",
      "Income requirements apply (but are generous)"
    ],
    what_you_need: ["Proof of Residency", "Proof of Income", "Diagnosis Letter"]
  },
  {
    id: "prep_pep",
    title: "PrEP & PEP Assistance",
    description: "Find providers for Pre-Exposure Prophylaxis (prevention) and emergency PEP.",
    links: [
      {
        label: "National PrEP Locator",
        url: "https://preplocator.org/",
        authority: "NGO_Legal",
        note: "Find providers near you"
      },
      {
        label: "CA PrEP-AP (Assistance Program)",
        url: "https://www.cdph.ca.gov/Programs/CID/DOA/Pages/OA_prev_prep_ap.aspx",
        authority: "CDPH",
        note: "Covers insured and uninsured"
      }
    ],
    eligibility_notes: [
      "PrEP is for ongoing prevention",
      "PEP must be started within 72 hours of exposure"
    ],
    what_you_need: ["Negative HIV test (for PrEP)", "Residency info"]
  },
  {
    id: "immigrant_legal",
    title: "Immigrant & Legal Support",
    description: "Legal protections and health access for immigrants living with HIV.",
    links: [
      {
        label: "Immigration Equality",
        url: "https://immigrationequality.org/",
        authority: "NGO_Legal",
        note: "National Legal Resource"
      },
      {
        label: "AIDS Legal Referral Panel",
        url: "https://www.alrp.org/",
        authority: "NGO_Legal",
        note: "Free services (Bay Area/CA)"
      }
    ],
    eligibility_notes: [
      "ADAP and PrEP-AP in California do NOT require U.S. citizenship or green card",
      "Accessing these health services is generally safe under public charge rules"
    ]
  },
  {
    id: "support",
    title: "Support & Care Coordination",
    description: "Case management and mental health resources.",
    links: [
      {
        label: "Ryan White HIV/AIDS Program",
        url: "https://ryanwhite.hrsa.gov/hiv-care",
        authority: "HRSA",
        note: "Federal program for low-income support"
      }
    ]
  }
];

const BR_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "Testagem de HIV (SUS)",
    description: "Testing is free, confidential, and available at basic health units (UBS) and CTA (Testing and Counseling Centers).",
    links: [
      {
        label: "Departamento de HIV/Aids (Gov.br)",
        url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/aids-hiv",
        authority: "LocalGov",
        note: "Official Ministry of Health Info"
      }
    ],
    what_you_need: ["Cartão SUS (optional for testing)", "Photo ID (RG/Passport/RNE)"]
  },
  {
    id: "treatment",
    title: "Tratamento (TARV) Gratuito",
    description: "Brazil guarantees free access to antiretroviral therapy (ART) for all people living with HIV through SUS.",
    links: [
      {
        label: "Protocolos Clínicos (PCDT)",
        url: "https://www.gov.br/saude/pt-br/assuntos/pcdt",
        authority: "LocalGov",
        note: "Guidelines and Access Info"
      }
    ],
    eligibility_notes: [
      "Guaranteed by Law No. 9.313/1996",
      "Available to all residents including migrants"
    ],
    what_you_need: ["Positive diagnosis", "ID Document", "Cartão SUS"]
  },
  {
    id: "prep_pep",
    title: "PrEP e PEP (Prevenção)",
    description: "Prevention medication is available free of charge through the SUS network.",
    links: [
      {
        label: "PrEP e PEP (Gov.br)",
        url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/aids-hiv",
        authority: "LocalGov",
        note: "Prevention methods info"
      }
    ],
    eligibility_notes: [
      "PrEP is available for key populations and those at risk",
      "PEP is emergency use only"
    ]
  },
  {
    id: "support",
    title: "Atenção Integral (SUS)",
    description: "Multidisciplinary care, including psychological support and follow-up.",
    links: [
      {
        label: "Onde encontrar (Serviços)",
        url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/aids-hiv",
        authority: "LocalGov",
        note: "Find Specialized Services (SAE)"
      }
    ]
  },
  {
    id: "immigrant_legal",
    title: "Migrantes e Estrangeiros",
    description: "Access to HIV testing and treatment in Brazil regardless of nationality or migration status.",
    links: [
      {
        label: "Princípios do SUS (Universalidade)",
        url: "https://www.gov.br/saude/pt-br/assuntos/noticias/2024/abril/saude-lanca-nota-tecnica-com-orientacoes-de-atendimento-a-migrantes-refugiados-e-apatridas",
        authority: "LocalGov",
        note: "Health is a right of all"
      }
    ],
    eligibility_notes: [
      "Lack of documentation (RG/CPF) does not prevent emergency care",
      "Foreigners can obtain a Cartão SUS"
    ]
  }
];

const GLOBAL_FALLBACK: HelpCard[] = [
  {
    id: "testing",
    title: "Global HIV Testing",
    description: "Find WHO and UNAIDS recognized testing information.",
    links: [
      {
        label: "UNAIDS Testing Services",
        url: "https://www.unaids.org/en",
        authority: "UNAIDS"
      }
    ]
  },
  {
    id: "treatment",
    title: "Treatment Information",
    description: "International guidelines on Antiretroviral Therapy (ART).",
    links: [
      {
        label: "WHO HIV Treatment Guidelines",
        url: "https://www.who.int/health-topics/hiv-aids",
        authority: "WHO"
      }
    ]
  }
];

const CONTENT_REGISTRY: HelpContentMap = {
  "US-CA": US_CA_CONTENT,
  "BR": BR_CONTENT,
  "GLOBAL": GLOBAL_FALLBACK
};

// --- RESOLVER FUNCTION ---

export const getHelpCardsForLocation = (
  location: LocationKey, 
  showImmigrantHelp: boolean
): HelpCard[] => {
  // If region exists, use country-region format. Otherwise just country.
  const key = location.region && location.country === "US" 
    ? `${location.country}-${location.region}` 
    : location.country;
    
  const content = CONTENT_REGISTRY[key] || CONTENT_REGISTRY["GLOBAL"];

  return content.filter(card => {
    if (card.id === 'immigrant_legal' && !showImmigrantHelp) {
      return false;
    }
    return true;
  });
};