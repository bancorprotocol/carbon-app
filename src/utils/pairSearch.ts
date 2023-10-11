import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { exist } from './helpers/filter';

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
export const toPairName = (
  base: { symbol: string },
  quote: { symbol: string }
) => {
  return `${base.symbol}/${quote.symbol}`;
};

/**
 * Transform pair symbols to pair key
 * pair key is used to access a pair in the map
 */
export const toPairKey = (base: string, quote: string) => {
  return `${base}_${quote}`.toLowerCase();
};

/**
 * Transform a slug into a pair key
 * slug comes from a search (query params or input)
 */
export const fromPairSlug = (value: string, regex: RegExp = pairSearchExp) => {
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
    const name = toPairName(base, quote);
    const key = fromPairSlug(name, transformSlugExp);
    pairMap.set(key, pair);
    nameMap.set(key, name);
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
  const searchSlug = fromPairSlug(search, transformSlugExp);
  const slugs = [];
  for (const slug of nameMap.keys()) {
    if (slug.includes(searchSlug)) slugs.push(slug);
  }
  return slugs.sort((a, b) => {
    if (a.startsWith(searchSlug)) {
      if (!b.startsWith(searchSlug)) return -1;
    } else {
      if (b.startsWith(searchSlug)) return 1;
    }
    return nameMap.get(a)!.localeCompare(nameMap.get(b)!);
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
  const keys = searchPairKeys(nameMap, search, transformSlugExp);
  return keys.map((key) => pairMap.get(key)).filter(exist);
};
