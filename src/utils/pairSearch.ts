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

type PairMaps = ReturnType<typeof createPairMaps>;

export const pairSearchKey = (value: string, regex: RegExp = pairSearchExp) => {
  return value.toLowerCase().replaceAll(regex, '_');
};

export const createPairMaps = (
  pairs: TradePair[],
  transformKeyExp: RegExp = pairSearchExp
) => {
  const pairMap = new Map<string, TradePair>();
  const nameMap = new Map<string, string>();
  for (const pair of pairs) {
    const { baseToken: base, quoteToken: quote } = pair;
    const name = `${base.symbol}/${quote.symbol}`;
    const key = name.toLocaleLowerCase().replaceAll(transformKeyExp, '_');
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
 * @param transformKeyExp A regex used to normalize search. By default it remove these separators: " ", "-", "/"
 * @returns List of pair keys that match the input in the right order
 */
export const searchPairKeys = (
  nameMap: Map<string, string>,
  search: string,
  transformKeyExp: RegExp = pairSearchExp
) => {
  const keySearch = search.toLowerCase().replaceAll(transformKeyExp, '_');
  const keys = [];
  for (const key of nameMap.keys()) {
    if (key.includes(keySearch)) keys.push(key);
  }
  return keys.sort((a, b) => {
    if (a.startsWith(keySearch)) {
      if (!b.startsWith(keySearch)) return -1;
    } else {
      if (b.startsWith(keySearch)) return 1;
    }
    return nameMap.get(a)!.localeCompare(nameMap.get(b)!);
  });
};

/** Filter and search PairTrades based on a search input */
export const searchPairTrade = (
  pairMaps: PairMaps,
  search: string,
  transformKeyExp: RegExp = pairSearchExp
) => {
  const { pairMap, nameMap } = pairMaps;
  if (!search) return Array.from(pairMap.values());
  const keys = searchPairKeys(nameMap, search, transformKeyExp);
  return keys.map((key) => pairMap.get(key)).filter(exist);
};
