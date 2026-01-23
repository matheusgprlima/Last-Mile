export interface ValidationResult {
  ok: boolean;
  reason?: string;
  resolvedUrl?: string;
}

/**
 * Validates an evidence source and returns a resolved URL if valid.
 * Supports strings (URLs, PMIDs, DOIs) and structured Identifier objects.
 */
export const validateEvidenceSource = (source: string | { type: string; id: string }): ValidationResult => {
  let type = '';
  let id = '';

  if (typeof source === 'string') {
    const trimmed = source.trim();
    if (trimmed.startsWith('http')) {
      type = 'URL';
      id = trimmed;
    } else if (/^\d+$/.test(trimmed)) {
      type = 'PMID';
      id = trimmed;
    } else if (trimmed.includes('/') && !trimmed.includes(' ')) {
      type = 'DOI';
      id = trimmed;
    } else if (trimmed.startsWith('NCT')) {
      type = 'NCT';
      id = trimmed;
    } else {
      return { ok: false, reason: "Unrecognized format. Expected URL, DOI (e.g. 10.1126/...), or PMID (digits)." };
    }
  } else {
    type = source.type;
    id = source.id;
  }

  switch (type.toUpperCase()) {
    case 'URL':
      try {
        const url = new URL(id);
        if (url.protocol !== 'https:') {
          return { ok: false, reason: "Insecure protocol. Only HTTPS links are allowed." };
        }
        return { ok: true, resolvedUrl: id };
      } catch {
        return { ok: false, reason: "Malformed URL provided." };
      }
    case 'PMID':
      if (!/^\d+$/.test(id)) return { ok: false, reason: "PMID must be numeric." };
      return { ok: true, resolvedUrl: `https://pubmed.ncbi.nlm.nih.gov/${id}/` };
    case 'DOI':
      if (!id.includes('/') || id.includes(' ')) return { ok: false, reason: "Invalid DOI format." };
      return { ok: true, resolvedUrl: `https://doi.org/${id}` };
    case 'NCT':
      return { ok: true, resolvedUrl: `https://clinicaltrials.gov/ct2/show/${id}` };
    default:
      return { ok: false, reason: `No viewer route implemented for type: ${type}` };
  }
};

/**
 * Checks if a string is a valid HTTPS URL.
 * Used primarily for resource links in the Get Help section.
 */
export const isValidHttpsUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};