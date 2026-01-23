import { NewCard } from '../types';

export const DEFAULT_MILESTONES: NewCard[] = [
  {
    light: {
      id: "hiv-discovery",
      title: "Discovery of HIV as causative agent",
      year: 1983,
      month: 5,
      category: "Discovery",
      status: "Validated",
      one_liner: "Identification of the retrovirus (LAV/HTLV-III) responsible for AIDS.",
      primary_ids: [{ type: "PMID", id: "6304593" }],
      tags: ["Foundational", "Virology"]
    },
    full: {
      canonical_claim: "HIV-1 is the primary etiological agent of Acquired Immunodeficiency Syndrome.",
      why_it_matters_today: "Established the target for all subsequent diagnostic, treatment, and prevention research.",
      what_was_validated: ["Isolation of retrovirus from patients with lymphadenopathy", "Characterization of reverse transcriptase activity"],
      limitations: ["Initial debate over nomenclature (LAV vs HTLV-III)"],
      scientific_gaps: ["Full mechanism of CD4 depletion not understood in 1983"],
      implementation_gaps: ["No diagnostic test available at the moment of discovery"],
      quantitative_findings: [],
      sources: {
        primary: [{ type: "PMID", id: "6304593", citation: "Barre-Sinoussi et al. Science, 1983" }],
        secondary: [{ publisher: "WHO", title: "History of HIV/AIDS", year: 2011 }]
      }
    }
  },
  {
    light: {
      id: "first-elisa",
      title: "First HIV Antibody ELISA Test",
      year: 1985,
      month: 3,
      category: "Diagnostics",
      status: "Validated",
      one_liner: "FDA approval of the first commercial blood test to detect HIV antibodies.",
      primary_ids: [{ type: "DOI", id: "10.1126/science.3838595" }],
      tags: ["Screening", "Blood Safety"]
    },
    full: {
      canonical_claim: "Enzyme-linked immunosorbent assays can reliably detect HIV-1 exposure in blood samples.",
      why_it_matters_today: "Secured the global blood supply and allowed for the first large-scale epidemiological tracking.",
      what_was_validated: ["High sensitivity for HIV-1 antibodies", "Feasibility of mass screening"],
      limitations: ["'Window period' where antibodies are not yet detectable", "Early tests had higher false-positive rates than modern assays"],
      scientific_gaps: ["Requirement for confirmatory Western Blot"],
      implementation_gaps: ["Initial lack of counseling protocols for those testing positive"],
      quantitative_findings: [],
      sources: {
        primary: [{ type: "DOI", id: "10.1126/science.3838595", id_val: "10.1126/science.3838595" } as any],
        secondary: [{ publisher: "FDA", title: "Milestones in HIV/AIDS History", year: 2021 }]
      }
    }
  },
  {
    light: {
      id: "actg-076",
      title: "PMTCT Breakthrough: ACTG 076",
      year: 1994,
      month: 11,
      category: "Prevention",
      status: "Validated",
      one_liner: "Zidovudine (AZT) reduces mother-to-child transmission by 67%.",
      primary_ids: [{ type: "PMID", id: "7935654" }],
      tags: ["PMTCT", "Maternal Health"]
    },
    full: {
      canonical_claim: "Vertical transmission of HIV can be significantly interrupted using antiretroviral prophylaxis.",
      why_it_matters_today: "Saved millions of infants and proved that prevention-of-transmission is a reachable goal.",
      what_was_validated: ["Three-part AZT regimen efficacy", "Safety in pregnancy"],
      limitations: ["Complex regimen for resource-limited settings", "Did not address transmission via breastfeeding"],
      scientific_gaps: ["Optimal duration of infant prophylaxis"],
      implementation_gaps: ["Access to prenatal care in global south"],
      quantitative_findings: [{ metric: "Transmission Reduction", value: "67.5%", context: "Compared to placebo in clinical trial", source: { type: "PMID", id: "7935654" } }],
      sources: {
        primary: [{ type: "PMID", id: "7935654", citation: "Connor et al. NEJM, 1994" }],
        secondary: [{ publisher: "CDC", title: "Prevention of Mother-to-Child Transmission", year: 2016 }]
      }
    }
  },
  {
    light: {
      id: "haart-standard",
      title: "HAART Becomes Global Standard",
      year: 1996,
      month: 7,
      category: "Treatment",
      status: "Validated",
      one_liner: "Triple-drug combination therapy transforms HIV into a manageable chronic condition.",
      primary_ids: [{ type: "DOI", id: "10.1038/383117a0" }],
      tags: ["HAART", "Survival"]
    },
    full: {
      canonical_claim: "Combination antiretroviral therapy (cART) achieves sustained viral suppression and restores immune function.",
      why_it_matters_today: "Ended the 'death sentence' era of AIDS and remains the foundation of all current HIV care.",
      what_was_validated: ["Sustained suppression of viral replication", "Significant reduction in opportunistic infections"],
      limitations: ["High pill burden in early versions", "Metabolic side effects", "High initial cost"],
      scientific_gaps: ["Long-term cardiovascular and bone health impacts"],
      implementation_gaps: ["'Access Gap' between wealthy and developing nations"],
      quantitative_findings: [],
      sources: {
        primary: [{ type: "DOI", id: "10.1038/383117a0", citation: "Hammer et al. Nature, 1996" }],
        secondary: [{ publisher: "UNAIDS", title: "The HAART Revolution", year: 2006 }]
      }
    }
  },
  {
    light: {
      id: "berlin-patient",
      title: "Berlin Patient: Proof-of-Concept Cure",
      year: 2009,
      month: 2,
      category: "Cure Research",
      status: "Validated",
      one_liner: "First documented case of long-term HIV remission following CCR5-delta32 stem cell transplant.",
      primary_ids: [{ type: "PMID", id: "19213682" }],
      tags: ["Cure", "Stem Cell"]
    },
    full: {
      canonical_claim: "A functional cure for HIV is biologically possible through the elimination of susceptible host cells.",
      why_it_matters_today: "Shifted the scientific community's focus from suppression to eradication.",
      what_was_validated: ["Persistence of HIV remission without ART", "Role of CCR5-delta32 mutation"],
      limitations: ["Procedure is high-risk (stem cell transplant)", "Not scalable to the global population"],
      scientific_gaps: ["Understanding the 'reservoir' in different tissue types"],
      implementation_gaps: ["Finding matched donors with the rare CCR5 mutation"],
      quantitative_findings: [{ metric: "Viral Load", value: "Undetectable", context: "Sustained for 12+ years post-procedure", source: { type: "PMID", id: "19213682" } }],
      sources: {
        primary: [{ type: "PMID", id: "19213682", citation: "Hutter et al. NEJM, 2009" }],
        secondary: [{ publisher: "NIH", title: "HIV Cure Research", year: 2020 }]
      }
    }
  },
  {
    light: {
      id: "hptn-052",
      title: "Treatment as Prevention (U=U Foundation)",
      year: 2011,
      month: 7,
      category: "Prevention",
      status: "Validated",
      one_liner: "HPTN 052 study proves that viral suppression eliminates transmission risk.",
      primary_ids: [{ type: "PMID", id: "21767103" }],
      tags: ["U=U", "Transmission"]
    },
    full: {
      canonical_claim: "Effective antiretroviral therapy reduces the risk of HIV transmission in serodiscordant couples by at least 96%.",
      why_it_matters_today: "Formed the scientific basis for the 'Undetectable = Untransmittable' (U=U) global movement.",
      what_was_validated: ["Direct link between lower viral load and lower transmission risk", "Benefits of early ART initiation"],
      limitations: ["Required nearly 100% adherence to be reliable"],
      scientific_gaps: ["Transmission risk through breastfeeding (partially addressed later)"],
      implementation_gaps: ["Stigma reduction needed to encourage testing and treatment"],
      quantitative_findings: [{ metric: "Transmission Reduction", value: "96.3%", context: "Among early ART group vs delayed group", source: { type: "PMID", id: "21767103" } }],
      sources: {
        primary: [{ type: "PMID", id: "21767103", citation: "Cohen et al. NEJM, 2011" }],
        secondary: [{ publisher: "UNAIDS", title: "Zero New Infections Goal", year: 2012 }]
      }
    }
  },
  {
    light: {
      id: "oral-prep-approval",
      title: "First Oral PrEP Approval",
      year: 2012,
      month: 7,
      category: "Prevention",
      status: "Validated",
      one_liner: "FDA approves TDF/FTC for pre-exposure prophylaxis (PrEP).",
      primary_ids: [{ type: "PMID", id: "21091443" }],
      tags: ["PrEP", "Pre-exposure"]
    },
    full: {
      canonical_claim: "Daily oral TDF/FTC provides significant protection against HIV acquisition in high-risk individuals.",
      why_it_matters_today: "Gave individuals a preventative tool they could control independently of their partner's status.",
      what_was_validated: ["Safety and efficacy of daily dosing", "Importance of adherence to efficacy outcomes"],
      limitations: ["Bone and renal density monitoring required", "Adherence fatigue"],
      scientific_gaps: ["Efficacy in female cisgender populations (clarified in later studies)"],
      implementation_gaps: ["Cost barriers and distribution in non-urban areas"],
      quantitative_findings: [{ metric: "Efficacy", value: "92-99%", context: "When taken consistently", source: { type: "PMID", id: "21091443" } }],
      sources: {
        primary: [{ type: "PMID", id: "21091443", citation: "Grant et al. NEJM, 2010 (iPrEx)" }],
        secondary: [{ publisher: "FDA", title: "PrEP Approval News", year: 2012 }]
      }
    }
  },
  {
    light: {
      id: "la-prep-2021",
      title: "Long-Acting Injectable PrEP",
      year: 2021,
      month: 12,
      category: "Long-acting",
      status: "Validated",
      one_liner: "Bimonthly Cabotegravir injections proven superior to daily oral PrEP.",
      primary_ids: [{ type: "PMID", id: "34379861" }],
      tags: ["Cabotegravir", "Next-Gen"]
    },
    full: {
      canonical_claim: "Long-acting injectable Cabotegravir is more effective than daily oral TDF/FTC due to better adherence coverage.",
      why_it_matters_today: "Removes the daily burden of pills and addresses adherence challenges in key populations.",
      what_was_validated: ["Superiority in preventing HIV infections", "Safety and injection site tolerability"],
      limitations: ["Requires clinic visits every 2 months", "Complex implementation in rural areas"],
      scientific_gaps: ["Long-term safety over decades", "Impact of 'the tail' (lingering low drug levels)"],
      implementation_gaps: ["High cost of injectable formulations"],
      quantitative_findings: [{ metric: "Relative Efficacy", value: "66-89% more effective", context: "Than oral PrEP in head-to-head trials", source: { type: "PMID", id: "34379861" } }],
      sources: {
        primary: [{ type: "PMID", id: "34379861", citation: "Landovitz et al. NEJM, 2021 (HPTN 083)" }],
        secondary: [{ publisher: "WHO", title: "Consolidated Guidelines", year: 2022 }]
      }
    }
  },
  {
    light: {
      id: "lenacapavir-efficacy-2024",
      title: "Lenacapavir 100% Efficacy (Phase 3)",
      year: 2024,
      month: 7,
      category: "Prevention",
      status: "Validated",
      one_liner: "Twice-yearly injectable lenacapavir achieved zero HIV infections in a large Phase 3 prevention trial.",
      primary_ids: [{ type: "PMID", id: "39046123" }],
      tags: ["PrEP", "Lenacapavir", "Zero Infections"]
    },
    full: {
      canonical_claim: "Lenacapavir, a long-acting HIV-1 capsid inhibitor, completely prevented HIV infection when administered twice yearly for PrEP in a Phase 3 trial.",
      why_it_matters_today: "First time a biomedical HIV prevention strategy achieved zero infections in a large Phase 3 trial, addressing adherence limitations of daily oral PrEP.",
      what_was_validated: [
        "Complete prevention of HIV infection in over 5,300 participants",
        "Efficacy of twice-yearly subcutaneous dosing",
        "Superior real-world adherence compared to daily oral PrEP"
      ],
      limitations: [
        "Study population limited to young women",
        "Conducted in South Africa and Uganda"
      ],
      scientific_gaps: [
        "Effectiveness in other populations and exposure routes",
        "Long-term resistance surveillance"
      ],
      implementation_gaps: [
        "Cost and accessibility of patented long-acting biologics"
      ],
      quantitative_findings: [
        { metric: "Efficacy", value: "100%", context: "0 infections in Lenacapavir group vs 16 in Truvada group", source: { type: "PMID", id: "39046123" } }
      ],
      sources: {
        primary: [{ type: "PMID", id: "39046123", citation: "Bekker et al. NEJM, 2024" }],
        secondary: [{ publisher: "Other", title: "AIDS 2024 Conference (Munich)", year: 2024 }]
      }
    }
  },
  {
    light: {
      id: "lenacapavir-approval-2024",
      title: "FDA Approves Lenacapavir for PrEP",
      year: 2024,
      month: 12,
      category: "Prevention",
      status: "Validated",
      one_liner: "FDA approval of the first twice-yearly injectable PrEP providing six months of HIV protection per dose.",
      primary_ids: [],
      tags: ["Regulatory", "FDA", "Long-acting"]
    },
    full: {
      canonical_claim: "The FDA approved Gilead’s lenacapavir (Yeztugo) for pre-exposure prophylaxis to reduce the risk of sexually acquired HIV.",
      why_it_matters_today: "Establishes long-acting injectable PrEP as a regulatory standard, reducing reliance on daily adherence.",
      what_was_validated: [
        "Regulatory approval based on Phase 3 efficacy and safety",
        "Sustained HIV prevention with biannual dosing"
      ],
      limitations: [
        "Access and cost barriers may limit early adoption"
      ],
      scientific_gaps: [
        "Comparative effectiveness vs other long-acting PrEP options"
      ],
      implementation_gaps: [
        "Global rollout and equity of access"
      ],
      quantitative_findings: [],
      sources: {
        primary: [],
        secondary: [
          { publisher: "FDA", title: "U.S. FDA approval announcement", year: 2024 },
          { publisher: "Other", title: "Gilead Sciences regulatory filings", year: 2024 }
        ]
      }
    }
  }
];