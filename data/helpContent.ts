export type Authority = "CDC" | "CDPH" | "UNAIDS" | "WHO" | "NIH" | "LocalGov" | "NGO_Legal" | "HRSA" | "UNHCR" | "MSF" | "PAHO" | "UNRWA" | "GlobalFund";

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
        label: "Find HIV Care (Ryan White)",
        url: "https://findhivcare.hrsa.gov/",
        authority: "HRSA",
        note: "HIV care providers by location"
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

// Florida (US) — official state and federal resources
const US_FL_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "HIV Testing Services",
    description: "Free, confidential testing locations across Florida.",
    links: [
      {
        label: "Find Testing Sites (CDC)",
        url: "https://gettested.cdc.gov/",
        authority: "CDC",
        note: "Search by zip code"
      },
      {
        label: "Find HIV Care (Ryan White)",
        url: "https://findhivcare.hrsa.gov/",
        authority: "HRSA",
        note: "HIV care providers by location"
      }
    ],
    what_you_need: ["No ID required for most anonymous sites", "Walk-ins often accepted"]
  },
  {
    id: "treatment",
    title: "Treatment & ADAP",
    description: "Florida ADAP provides medication assistance for people living with HIV who meet income and residency criteria.",
    links: [
      {
        label: "Florida ADAP (AIDS Drug Assistance)",
        url: "https://floridaadap.org/",
        authority: "LocalGov",
        note: "State program – prescriptions for eligible residents"
      },
      {
        label: "Find a Health Center (HRSA)",
        url: "https://findahealthcenter.hrsa.gov/",
        authority: "HRSA",
        note: "Low-cost / sliding scale care"
      }
    ],
    eligibility_notes: [
      "Florida resident",
      "Income at or below 400% Federal Poverty Level",
      "Uninsured or inadequate prescription coverage"
    ],
    what_you_need: ["Proof of residency", "Proof of income", "HIV diagnosis"]
  },
  {
    id: "prep_pep",
    title: "PrEP & PEP",
    description: "Find PrEP and nPEP (emergency) providers in Florida.",
    links: [
      {
        label: "Florida PrEP & nPEP Clinic Search",
        url: "https://flhiv.doh.state.fl.us/ClinicSearch/FloridaPrEPnPrEPClinicSearch.aspx",
        authority: "LocalGov",
        note: "State health department – by area"
      },
      {
        label: "National PrEP Locator",
        url: "https://preplocator.org/",
        authority: "NGO_Legal",
        note: "Find providers near you"
      }
    ],
    eligibility_notes: [
      "PrEP for ongoing prevention",
      "PEP must be started within 72 hours of exposure"
    ]
  },
  {
    id: "immigrant_legal",
    title: "Immigrant & Legal Support",
    description: "Legal and health access support for immigrants living with HIV.",
    links: [
      {
        label: "Immigration Equality",
        url: "https://immigrationequality.org/",
        authority: "NGO_Legal",
        note: "National legal resource"
      },
      {
        label: "Find HIV Care (HRSA)",
        url: "https://findhivcare.hrsa.gov/",
        authority: "HRSA",
        note: "Ryan White providers – often serve regardless of status"
      }
    ]
  },
  {
    id: "support",
    title: "Support & Care",
    description: "Ryan White and care coordination in Florida.",
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

// United States — national resources (all states except CA/FL which have state-specific content above)
const US_GENERIC_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "HIV Testing Services",
    description: "Find free, confidential testing locations nationwide.",
    links: [
      {
        label: "Find Testing Sites (CDC)",
        url: "https://gettested.cdc.gov/",
        authority: "CDC",
        note: "Search by zip code"
      },
      {
        label: "Find HIV Care (Ryan White)",
        url: "https://findhivcare.hrsa.gov/",
        authority: "HRSA",
        note: "HIV care providers by location"
      }
    ],
    what_you_need: ["No ID required for most anonymous sites", "Walk-ins often accepted"]
  },
  {
    id: "treatment",
    title: "Treatment & ADAP",
    description: "Every state has an AIDS Drug Assistance Program (ADAP). Find care and medication assistance near you.",
    links: [
      {
        label: "Find HIV Care (HRSA)",
        url: "https://findhivcare.hrsa.gov/",
        authority: "HRSA",
        note: "Ryan White providers – includes ADAP info"
      },
      {
        label: "Find a Health Center (HRSA)",
        url: "https://findahealthcenter.hrsa.gov/",
        authority: "HRSA",
        note: "Low-cost / sliding scale care"
      },
      {
        label: "NASTAD – State ADAP contacts",
        url: "https://www.nastad.org/prevention/ryan-white-hivaids-program/part-b-adap",
        authority: "NGO_Legal",
        note: "State-by-state ADAP information"
      }
    ],
    eligibility_notes: [
      "Must be a resident of the state",
      "Income and insurance rules vary by state",
      "ADAP covers prescriptions for eligible people living with HIV"
    ],
    what_you_need: ["Proof of residency", "Proof of income", "HIV diagnosis"]
  },
  {
    id: "prep_pep",
    title: "PrEP & PEP",
    description: "Find PrEP and PEP providers in your area.",
    links: [
      {
        label: "National PrEP Locator",
        url: "https://preplocator.org/",
        authority: "NGO_Legal",
        note: "Find providers near you"
      },
      {
        label: "CDC – PrEP & PEP basics",
        url: "https://www.cdc.gov/hiv/basics/prep.html",
        authority: "CDC",
        note: "Information and resources"
      }
    ],
    eligibility_notes: [
      "PrEP is for ongoing prevention",
      "PEP must be started within 72 hours of exposure"
    ]
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
        note: "National legal resource"
      },
      {
        label: "Find HIV Care (HRSA)",
        url: "https://findhivcare.hrsa.gov/",
        authority: "HRSA",
        note: "Ryan White providers – often serve regardless of status"
      }
    ],
    eligibility_notes: [
      "Many ADAP and Ryan White programs do not require U.S. citizenship",
      "Accessing health services is generally safe under public charge rules"
    ]
  },
  {
    id: "support",
    title: "Support & Care",
    description: "Ryan White and care coordination nationwide.",
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

// Iran — access in complex context (UNAIDS/WHO)
const IR_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "Teste e Informação (Irã)",
    description: "Informações oficiais sobre HIV e serviços de testagem no Irã, com apoio da OMS e UNAIDS.",
    links: [
      {
        label: "UNAIDS – Irã (país)",
        url: "https://www.unaids.org/en/regionscountries/countries/islamicrepublicofiran",
        authority: "UNAIDS",
        note: "Dados e programas nacionais"
      },
      {
        label: "OMS – Irã",
        url: "https://www.who.int/countries/irn/",
        authority: "WHO",
        note: "Perfil de saúde e programas"
      }
    ]
  },
  {
    id: "treatment",
    title: "Acesso a Tratamento (ART)",
    description: "O Irã dispõe de programas de TARV com apoio internacional. A UNAIDS apoia multimonth dispensing e aquisição de medicamentos.",
    links: [
      {
        label: "UNAIDS – Irã (recursos e resposta)",
        url: "https://www.unaids.org/en/regionscountries/countries/islamicrepublicofiran",
        authority: "UNAIDS",
        note: "Acesso a tratamento e medicamentos"
      },
      {
        label: "OMS – HIV e AIDS",
        url: "https://www.who.int/health-topics/hiv-aids",
        authority: "WHO",
        note: "Diretrizes globais de tratamento"
      }
    ],
    eligibility_notes: [
      "Serviços vinculados ao Ministério da Saúde",
      "Barreiras comuns: transporte, estigma, custo – procure unidades de confiança"
    ]
  },
  {
    id: "support",
    title: "Suporte e Redes",
    description: "Organizações internacionais e redes locais podem ajudar a localizar serviços e apoio.",
    links: [
      {
        label: "UNAIDS – Coalizão de Prevenção (Irã)",
        url: "https://www.unaids.org/en/regionscountries/countries/islamicrepublicofiran",
        authority: "UNAIDS",
        note: "Estratégias nacionais e parceiros"
      }
    ]
  }
];

// Gaza / Palestina — contexto humanitário (OMS, UNRWA)
const PS_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "Testagem e Informação (Gaza / Palestina)",
    description: "Em contexto de crise, serviços de saúde estão sob forte pressão. OMS e UNRWA mantêm esforços de saúde para refugiados e população local.",
    links: [
      {
        label: "OMS – Território Palestino Ocupado",
        url: "https://www.who.int/countries/pse/",
        authority: "WHO",
        note: "Perfil de saúde e emergências"
      },
      {
        label: "UNRWA – Saúde",
        url: "https://www.unrwa.org/our-work/health",
        authority: "UNRWA",
        note: "Serviços de saúde para refugiados palestinos"
      }
    ]
  },
  {
    id: "treatment",
    title: "Acesso a Medicamentos (ART) em Crise",
    description: "Acesso a ART e medicamentos essenciais é afetado pelo conflito. OMS e parceiros distribuem suprimentos e apoiam estruturas de saúde quando possível.",
    links: [
      {
        label: "OMS – Apelo de Emergência Saúde (oPt) 2025",
        url: "https://www.who.int/publications/m/item/occupied-palestinian-territory--who-health-emergency-appeal-2025",
        authority: "WHO",
        note: "Resposta de emergência e medicamentos"
      },
      {
        label: "Cluster de Saúde – oPt (OMS)",
        url: "https://healthcluster.who.int/countries-and-regions/occupied-palestinian-territory",
        authority: "WHO",
        note: "Coordenação de saúde em emergência"
      }
    ],
    eligibility_notes: [
      "Serviços variam conforme segurança e disponibilidade de medicamentos",
      "Procure postos UNRWA ou unidades de saúde indicadas por OMS/parceiros"
    ]
  },
  {
    id: "support",
    title: "Suporte Humanitário",
    description: "Organizações humanitárias tentam manter cuidados de saúde e medicamentos onde há acesso.",
    links: [
      {
        label: "UNRWA – Onde atuamos",
        url: "https://www.unrwa.org/where-we-work/gaza-strip",
        authority: "UNRWA",
        note: "Serviços e pontos de atendimento"
      }
    ]
  }
];

// Ucrânia — guerra e deslocamento (UNAIDS, OMS, UNHCR)
const UA_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "Testagem e Informação (Ucrânia)",
    description: "Serviços de testagem e informação sobre HIV mantidos com apoio de UNAIDS, OMS e parceiros durante o conflito.",
    links: [
      {
        label: "UNAIDS – Ucrânia (país)",
        url: "https://www.unaids.org/en/regionscountries/countries/ukraine",
        authority: "UNAIDS",
        note: "Resposta à crise e programas"
      },
      {
        label: "UNAIDS – Guerra na Ucrânia (especial)",
        url: "https://unaids.org/en/War-Ukraine-special",
        authority: "UNAIDS",
        note: "Acesso a tratamento e apoio em contexto de guerra"
      }
    ]
  },
  {
    id: "treatment",
    title: "Acesso a Tratamento (ART) na Ucrânia",
    description: "UNAIDS, OMS, Global Fund e parceiros trabalham para manter fornecimento de ARV e cuidados. Pessoas em deslocamento podem ter apoio via UNHCR e redes de acolhimento.",
    links: [
      {
        label: "UNAIDS – Resposta à crise na Ucrânia",
        url: "https://unaids.org/en/War-Ukraine-special",
        authority: "UNAIDS",
        note: "Medicamentos e continuidade do tratamento"
      },
      {
        label: "OMS – Ucrânia",
        url: "https://www.who.int/countries/ukr/",
        authority: "WHO",
        note: "Saúde em emergência e medicamentos essenciais"
      },
      {
        label: "UNHCR – Refugiados e saúde",
        url: "https://www.unhcr.org/health.html",
        authority: "UNHCR",
        note: "Para deslocados – acesso a saúde"
      }
    ],
    eligibility_notes: [
      "Tratamento mantido na maior parte do país com apoio internacional",
      "Deslocados: procurar pontos UNHCR ou centros de saúde indicados"
    ]
  },
  {
    id: "support",
    title: "Suporte e Refugiados",
    description: "Para pessoas que deixaram a Ucrânia, UNHCR e parceiros nos países de acolhimento podem ajudar com saúde e medicamentos.",
    links: [
      {
        label: "UNHCR – Saúde",
        url: "https://www.unhcr.org/health.html",
        authority: "UNHCR",
        note: "Acesso a cuidados em contexto de refúgio"
      }
    ]
  }
];

// Venezuela — crise humanitária (PAHO, UNAIDS)
const VE_CONTENT: HelpCard[] = [
  {
    id: "testing",
    title: "Testagem e Informação (Venezuela)",
    description: "Informações sobre HIV e testagem na Venezuela, com apoio da OPAS e UNAIDS em contexto de crise.",
    links: [
      {
        label: "UNAIDS – Venezuela",
        url: "https://www.unaids.org/en/regionscountries/countries/venezuela",
        authority: "UNAIDS",
        note: "Dados e resposta no país"
      },
      {
        label: "OPAS – HIV",
        url: "https://www.paho.org/en/health-topics/hiv",
        authority: "PAHO",
        note: "Informação regional e programas"
      }
    ]
  },
  {
    id: "treatment",
    title: "Acesso a Medicamentos (ART)",
    description: "OPAS, UNAIDS e Global Fund apoiam distribuição de antirretrovirais na Venezuela. Centros estatais e parceiros dispõem medicamentos quando há estoque.",
    links: [
      {
        label: "OPAS – Parceria e medicamentos HIV (Venezuela)",
        url: "https://www.paho.org/en/news/21-7-2020-hiv-medication-maintained-through-paho-partnership",
        authority: "PAHO",
        note: "Manutenção de medicamentos em crise"
      },
      {
        label: "UNAIDS – Ação contra desabastecimento (Venezuela)",
        url: "https://unaids.org/en/resources/presscentre/featurestories/2019/february/20190214_Venezuela_HIV_treatment",
        authority: "UNAIDS",
        note: "Distribuição e doação de ARV"
      },
      {
        label: "OMS – Diretrizes de tratamento",
        url: "https://www.who.int/health-topics/hiv-aids",
        authority: "WHO",
        note: "Diretrizes globais de ART"
      }
    ],
    eligibility_notes: [
      "Acesso via centros do Ministério da Saúde e parceiros apoiados por OPAS/UNAIDS",
      "Multimonth dispensing pode estar disponível para reduzir deslocamentos"
    ]
  },
  {
    id: "support",
    title: "Suporte e Redes",
    description: "Organizações da sociedade civil e agências internacionais ajudam a localizar centros com medicamentos.",
    links: [
      {
        label: "OPAS – Cooperação Venezuela",
        url: "https://www.paho.org/en/countries/venezuela",
        authority: "PAHO",
        note: "Programas de saúde no país"
      }
    ]
  }
];

const GLOBAL_FALLBACK: HelpCard[] = [
  {
    id: "testing",
    title: "Global HIV Testing",
    description: "WHO and UNAIDS provide testing information and country-level data.",
    links: [
      {
        label: "UNAIDS – Country data and programs",
        url: "https://www.unaids.org/en/regionscountries",
        authority: "UNAIDS",
        note: "Find your country"
      },
      {
        label: "WHO – HIV/AIDS",
        url: "https://www.who.int/health-topics/hiv-aids",
        authority: "WHO",
        note: "Global guidelines"
      }
    ]
  },
  {
    id: "treatment",
    title: "Treatment Information (ART)",
    description: "International guidelines on Antiretroviral Therapy and access in humanitarian settings.",
    links: [
      {
        label: "WHO HIV Treatment Guidelines",
        url: "https://www.who.int/health-topics/hiv-aids",
        authority: "WHO",
        note: "Evidence-based ART guidelines"
      },
      {
        label: "UNAIDS – Treatment access",
        url: "https://www.unaids.org/en",
        authority: "UNAIDS",
        note: "Global and country-level info"
      }
    ]
  }
];

const CONTENT_REGISTRY: HelpContentMap = {
  "US-CA": US_CA_CONTENT,
  "US-FL": US_FL_CONTENT,
  "US": US_GENERIC_CONTENT,
  "BR": BR_CONTENT,
  "IR": IR_CONTENT,
  "PS": PS_CONTENT,
  "UA": UA_CONTENT,
  "VE": VE_CONTENT,
  "GLOBAL": GLOBAL_FALLBACK
};

// --- RESOLVER FUNCTION ---

export const getHelpCardsForLocation = (
  location: LocationKey, 
  showImmigrantHelp: boolean
): HelpCard[] => {
  // US: use state-specific content for CA/FL, otherwise national (US) content.
  let key: string;
  if (location.country === "US" && location.region) {
    key = (location.region === "CA" || location.region === "FL")
      ? `US-${location.region}`
      : "US";
  } else {
    key = location.country;
  }
  const content = CONTENT_REGISTRY[key] || CONTENT_REGISTRY["GLOBAL"];

  return content.filter(card => {
    if (card.id === 'immigrant_legal' && !showImmigrantHelp) {
      return false;
    }
    return true;
  });
};