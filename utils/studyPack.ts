import { NewCard } from '../types';
import { validateEvidenceSource } from './evidenceLink';

/**
 * Formats a NewCard (Roadmap Milestone) into a clean plaintext Study Pack.
 * This ensures high-quality ingestion by tools like NotebookLM.
 */
export const formatStudyPack = (card: NewCard): string => {
  const { light, full } = card;
  const sections: string[] = [];

  sections.push(`[MILESTONE: ${light.title.toUpperCase()} (${light.year})]`);
  sections.push(`CANONICAL CLAIM:\n${full.canonical_claim}`);
  sections.push(`SIGNIFICANCE TODAY:\n${full.why_it_matters_today}`);

  if (full.what_was_validated && full.what_was_validated.length > 0) {
    sections.push(`VALIDATED FINDINGS:\n${full.what_was_validated.filter(Boolean).map(f => `- ${f}`).join('\n')}`);
  }

  if (full.limitations && full.limitations.length > 0) {
    sections.push(`LIMITATIONS & BIASES:\n${full.limitations.filter(Boolean).map(l => `- ${l}`).join('\n')}`);
  }

  if (full.scientific_gaps && full.scientific_gaps.length > 0) {
    sections.push(`REMAINING SCIENTIFIC GAPS:\n${full.scientific_gaps.filter(Boolean).map(g => `- ${g}`).join('\n')}`);
  }

  if (full.implementation_gaps && full.implementation_gaps.length > 0) {
    sections.push(`IMPLEMENTATION BARRIERS:\n${full.implementation_gaps.filter(Boolean).map(g => `- ${g}`).join('\n')}`);
  }

  const sources = full.sources.primary
    .filter(Boolean)
    .map(src => {
      const val = validateEvidenceSource(src);
      const label = src.citation || `${src.type} ${src.id}`;
      return val.ok ? `- [${src.type}] ${label}: ${val.resolvedUrl}` : `- [${src.type}] ${label}: ${src.id}`;
    });

  if (sources.length > 0) {
    sections.push(`PRIMARY EVIDENCE SOURCES:\n${sources.join('\n')}`);
  }

  return sections.join('\n\n---\n\n');
};
