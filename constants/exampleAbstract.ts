/** Example abstract for the analyzer "Example" button (CCR5 gene editing & HIV immunotherapy). */
export const EXAMPLE_ABSTRACT = `OPEN ACCESS
EDITED BY
Guido Poli, Vita-Salute San Raffaele University, Italy
REVIEWED BY
Daniela Cesana, San Raffaele Telethon Institute for Gene Therapy (SR-Tiget), Italy
*CORRESPONDENCE
Jian-Jun Xun
46700704@hebmu.edu.cn
RECEIVED 10 March 2025
ACCEPTED 02 June 2025 PUBLISHED 18 June 2025
CITATION
Wang J-W, Liu J-H and Xun J-J (2025) CCR5 gene editing and HIV immunotherapy: current understandings, challenges, and future directions. Front. Immunol. 16:1590690. doi: 10.3389/fimmu.2025.1590690
COPYRIGHT
© 2025 Wang, Liu and Xun. This is an open-access article distributed under the terms of the Creative Commons Attribution License (CC BY). The use, distribution or reproduction in other forums is permitted, provided the original author(s) and the copyright owner(s) are credited and that the original publication in this journal is cited, in accordance with accepted academic practice. No use, distribution or reproduction is permitted which does not comply with these terms.
PUBLISHED 18 June 2025
DOI 10.3389/fimmu.2025.1590690
CCR5 gene editing and HIV immunotherapy: current understandings, challenges, and future directions
Jia-Wen Wang, Jia-Hui Liu and Jian-Jun Xun*
Department of Orthopedics, The Fourth Hospital of Hebei Medical University, Shijiazhuang, Hebei, China
Human immunodeficiency virus (HIV) infection remains a major global public
health challenge. Although highly active antiretroviral therapy (HAART or ART)
can effectively control viral replication, it fails to eradicate latent viral reservoirs
and poses limitations such as lifelong medication and cumulative drug toxicity.
This study focuses on the pivotal role of C-C chemokine receptor 5 (CCR5) gene
editing in HIV immunotherapy, particularly highlighting the natural resistance to
R5-tropic HIV strains observed in the "Berlin" and "London" patients carrying the
homozygous CCR5-D32mutation. We further explore the synergistic potential of
multiplex gene editing strategies—including CCR5, CXCR4, and HIV LTR loci—
and the combinatorial mechanisms between gene editing technologies and
immunotherapy. A personalized treatment framework is proposed to address
the clinical heterogeneity among people living with HIV. In addition, we assess
the balance between long-term safety and global accessibility of gene-editing
approaches such as CRISPR/Cas9, emphasizing strategies to enhance
therapeutic efficacy while reducing cost and off-target effects. Our findings
suggest that the integration of CCR5-targeted gene editing with immune-
based interventions holds great promise for overcoming current therapeutic
limitations and achieving functional HIV cure. However, key challenges—such as
immune rejection, viral tropism switching, and economic feasibility—must be
resolved. This integrative approach provides a robust theoretical and technical
foundation for the next generation of HIV treatment paradigms.
KEYWORDS
HIV, CCR5, gene editing, immunotherapy, synergistic strategy, viral reservoir, challenges, future directions
1 Introduction
Human immunodeficiency virus (HIV) has exerted a profound impact on global public
health, claiming millions of lives (1). Highly active antiretroviral therapy (HAART or ART)
has significantly altered the natural course of HIV infection, prolonging survival and
improving quality of life for those affected (1, 2). However, ART is not curative: it cannot
eliminate latent viral reservoirs (3–5), necessitates lifelong
adherence, and is associated with cumulative drug toxicity and
the emergence of resistant viral strains (2, 6).
Traditional immune-based strategies—such as the use of
broadly neutralizing antibodies (bNAbs) to target circulating virus
(7–9) or immunostimulatory agents to enhance host immune
responses (10, 11)—have shown promise but remain limited in
their ability to eliminate latent HIV. Similarly, allogeneic
hematopoietic stem cell transplantation (allo-HSCT) is
constrained by high procedural risk and donor scarcity (6, 12).
The discovery of C-C chemokine receptor 5 (CCR5) as a major
HIV co-receptor represents a breakthrough in overcoming these
limitations. HIV entry into CD4+ T cells and other host cells
requires not only CD4 receptor binding but also co-receptors
such as CCR5 or CXCR4 (3, 13). Case studies of the "Berlin" and
"London" patients—who achieved viral remission following
transplantation from CCR5-D32 homozygous donors—have
provided compelling evidence that genetic disruption of CCR5
can confer natural resistance to R5-tropic HIV strains (6, 12).
These findings have catalyzed the rapid development of gene
editing technologies targeting CCR5, including CRISPR/Cas9, for
potential curative therapy (9, 13–15).
This paper seeks to address four key questions:
1. Synergistic Multi-target Editing: How can simultaneous
editing of CCR5, CXCR4, and HIV LTR collectively
establish a comprehensive viral blockade to counteract
tropism switching and latent reactivation?
2. Gene-Immune Synergy: How can gene editing augment the
anti-HIV capacity and persistence of immune cells?
Conversely, how can immunotherapy complement gene
editing to eradicate latent reservoirs more effectively?
3. Personalized Approaches for Clinical Heterogeneity: Given
the high variability in viral subtypes, host immunity, and
genetic background among HIV-infected individuals, how
can we design broadly applicable yet individually adaptable
treatment regimens?
4. Balancing Safety and Accessibility: How can we ensure
long-term safety while enhancing global accessibility
through technological optimization and innovative
payment models?
Figure 1 outlines the integrated framework for HIV treatment,
which systematically combines multi-target gene editing with
synergistic immunotherapy, not only intervening at key stages of
HIV infection but also addressing implementation challenges in
clinical applications.
2 Current advances in integrating gene editing with immunotherapy for HIV
For R5-tropic HIV-1 strains—which dominate during the early
and chronic phases of infection—C-C chemokine receptor 5
(CCR5) is an essential co-receptor for viral entry into CD4+ T
cells and macrophages (3, 13). Its expression directly determines the
susceptibility of these target cells to HIV. Individuals with naturally
occurring CCR5 deletions, such as the homozygous CCR5-D32 mutation, exhibit high resistance to HIV-1 infection, providing a
theoretical rationale for CCR5-targeted gene editing as a therapeutic
strategy (6, 12).
In recent years, molecular tools including zinc finger nucleases
(ZFNs), transcription activator-like effector nucleases (TALENs),
and the clustered regularly interspaced short palindromic repeats
(CRISPR)/Cas system have enabled precise targeting and editing of
the CCR5 gene (14, 16, 17). Each technology offers unique features
and therapeutic potential in the context of HIV treatment (see
Table 1). Notably, CCR5 editing using CRISPR/Cas9 has progressed
to early-phase clinical trials, including NCT03164135, which
assessed CRISPR/Cas9-mediated CCR5 editing in hematopoietic
stem cells for patients with both HIV and acute lymphoblastic
leukemia—demonstrating feasibility and safety (18).
Chronic viral infections such as HIV, HBV, and HCV share the
common hallmark of progressive T cell exhaustion, which is closely
linked to sustained expression of immune checkpoint molecules like
programmed cell death protein 1 (PD-1), PD-L1, and cytotoxic T-
lymphocyte-associated protein 4 (CTLA-4) (19). Evidence suggests
that PD-1/PD-L1 blockade may restore the function of HIV-specific
CD8+ T cells, improving their ability to clear infected cells and
potentially reactivating latent reservoirs (20, 21). Additionally, anti-
PD-1 chimeric antigen receptor (CAR) T cells have shown efficacy
in targeting SIV-infected CD4+ T cells in germinal centers of non-
human primate models (19), raising interest in the use of immune
checkpoint inhibitors in HIV treatment.`;
