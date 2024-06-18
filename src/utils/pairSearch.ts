import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { exist } from './helpers/operators';

/**
 * Remove " ", "-", "/" from a string
 * If you need another separator add it between |
 * @example
 * ```typescript
 * // support "&" and "<->"separator
 * const pairSearchExp = new RegExp('(\\s|&|<->||-|/){1,}', 'g');
 * ```
 */
const pairSearchExp = new RegExp('(\\s|-|/){1,}', 'g');

export type PairMaps = ReturnType<typeof createPairMaps>;

/**
 * Transform a pair of symbols to a pair name
 * pair name is used to be displayed
 */
export const toPairSlug = (
  base: { address: string },
  quote: { address: string }
) => {
  return `${base.address}_${quote.address}`.toLowerCase();
};

/**
 * Transform a pair of symbols to a pair name
 * pair name is used to be displayed
 */
export const toPairName = (
  base: { symbol: string },
  quote: { symbol: string }
) => {
  return `${base.symbol}/${quote.symbol}`;
};

/**
 * Transform a slug into a pair key
 * slug comes from a search (query params or input)
 */
export const fromPairSearch = (
  value: string,
  regex: RegExp = pairSearchExp
) => {
  return value.toLowerCase().replaceAll(regex, '_');
};

export const createPairMaps = (
  pairs: TradePair[] = [],
  transformSlugExp: RegExp = pairSearchExp
) => {
  const pairMap = new Map<string, TradePair>();
  const nameMap = new Map<string, string>();
  for (const pair of pairs) {
    const { baseToken: base, quoteToken: quote } = pair;
    const slug = toPairSlug(base, quote);
    pairMap.set(slug, pair);
    const displayName = toPairName(base, quote);
    const name = fromPairSearch(displayName, transformSlugExp);
    nameMap.set(slug, name);
  }
  return { pairMap, nameMap };
};

/**
 * Filter and sort pair keys based on a search input
 * @param nameMap A mapping of keys and names.
 * - **keys** are used to filter, they should have been built with `createPairMaps` with the same regex than this function
 * - **names** are used to sort, they include a separator between each token's symbol
 * @param search Input that can includes theses separators defined by the regex in params
 * @param transformSlugExp A regex used to normalize search. By default it replace these separators " ", "-", "/" with "_"
 * @returns List of pair keys that match the input in the right order
 */
export const searchPairKeys = (
  nameMap: Map<string, string>,
  search: string,
  transformSlugExp: RegExp = pairSearchExp
) => {
  // Transform search into pair
  const searchSlug = fromPairSearch(search, transformSlugExp);
  const names: { key: string; name: string }[] = [];
  for (const [key, name] of nameMap.entries()) {
    if (name.includes(searchSlug)) names.push({ key, name });
    else if (key.includes(searchSlug)) names.push({ key, name });
  }
  return names.sort((a, b) => {
    if (a.name.startsWith(searchSlug)) {
      if (!b.name.startsWith(searchSlug)) return -1;
    }
    if (a.key.startsWith(searchSlug)) {
      if (!b.key.startsWith(searchSlug)) return -1;
    }
    if (b.name.startsWith(searchSlug)) {
      if (!a.name.startsWith(searchSlug)) return 1;
    }
    if (b.key.startsWith(searchSlug)) {
      if (!a.key.startsWith(searchSlug)) return 1;
    }
    return a.name.localeCompare(b.name);
  });
};

/** Filter and search PairTrades based on a search input */
export const searchPairTrade = (
  pairMap: Map<string, TradePair>,
  nameMap: Map<string, string>,
  search: string,
  transformSlugExp: RegExp = pairSearchExp
) => {
  if (!search) return Array.from(pairMap.values());
  const result = searchPairKeys(nameMap, search, transformSlugExp);
  return result.map(({ key }) => pairMap.get(key)).filter(exist);
};
