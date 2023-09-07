import { searchSeparators } from 'components/explorer/utils';
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

    let value0 = searchLowerCase;
    let value1 = '';

    searchSeparators.forEach((separator) => {
      if (searchLowerCase.includes(separator)) {
        const split = searchLowerCase.split(separator);
        value0 = split[0];
        value1 = split[1];
      }
    });

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
