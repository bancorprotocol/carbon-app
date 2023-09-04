import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { orderBy } from 'lodash';
import { useMemo } from 'react';

interface Props {
  search: string;
  pairs: TradePair[];
}

export const usePairSearch = ({ pairs, search }: Props) => {
  const filteredPairs = useMemo(() => {
    const searchLowerCase = search.toLowerCase();
    const splitDash = searchLowerCase.split('-');
    const splitSpace = searchLowerCase.split(' ');
    const splitSlash = searchLowerCase.split('/');

    let value0 = searchLowerCase;
    let value1 = '';

    if (splitDash.length === 2) {
      value0 = splitDash[0];
      value1 = splitDash[1];
    }
    if (splitSpace.length === 2) {
      value0 = splitSpace[0];
      value1 = splitSpace[1];
    }
    if (splitSlash.length === 2) {
      value0 = splitSlash[0];
      value1 = splitSlash[1];
    }

    const baseTokens = pairs.filter((pair) =>
      pair.baseToken.symbol.toLowerCase().includes(value0)
    );

    if (value1) {
      return orderBy(
        baseTokens.filter((pair) =>
          pair.quoteToken.symbol.toLowerCase().includes(value1)
        ),
        'baseToken.symbol',
        'asc'
      );
    }
    return orderBy(baseTokens, 'baseToken.symbol', 'asc');
  }, [pairs, search]);

  return {
    filteredPairs,
  };
};
