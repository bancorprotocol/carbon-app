/** Get the same format for all pairs */
export const toSortedPairSlug = (base: string, quote: string) => {
  return [base, quote]
    .map((v) => v.toLowerCase())
    .sort((a, b) => a.localeCompare(b))
    .join('_');
};
