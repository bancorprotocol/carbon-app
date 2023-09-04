import { lsService } from 'services/localeStorage';
import { config } from 'services/web3/config';

function toValue(mix: string | undefined) {
  if (!mix) return '';
  var str = decodeURIComponent(mix);
  if (str === 'false') return false;
  if (str === 'true') return true;
  if (str.startsWith('0x')) return str;
  if (str.startsWith('0X')) return str;
  return +str * 0 === 0 ? +str : str;
}

export function decode(str: string) {
  let tmp,
    k,
    out: any = {},
    arr = str.split('&');

  while ((tmp = arr.shift())) {
    tmp = tmp.split('=');
    k = tmp.shift();
    if (k && out[k] !== void 0) {
      // @ts-ignore
      out[k] = [].concat(out[k], toValue(tmp.shift()));
    } else {
      // @ts-ignore
      out[k] = toValue(tmp.shift());
    }
  }

  return out;
}

export const parseSearchWith = (parser: (str: string) => any) => {
  return (searchStr: string): Record<string, any> => {
    if (searchStr.substring(0, 1) === '?') {
      searchStr = searchStr.substring(1);
    }

    let query: Record<string, unknown> = decode(searchStr);

    // Try to parse any query params that might be json
    for (let key in query) {
      if (key === 'quote' || key === 'base') {
        // eslint-disable-next-line
        query[key] = query[key];
      } else {
        const value = query[key];
        if (typeof value === 'string') {
          try {
            query[key] = parser(value);
          } catch (err) {
            //
          }
        }
      }
    }

    return query;
  };
};

export const getLastVisitedPair = () => {
  const [base, quote] = lsService.getItem('tradePair') || [
    config.tokens.ETH,
    config.tokens.USDC,
  ];

  return { base, quote };
};
