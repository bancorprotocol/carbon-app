import { PairLogoName } from 'components/common/PairLogoName';
import { ExplorerSearchProps } from 'components/explorer/ExplorerSearch';
import { Link, PathNames } from 'libs/routing';
import { Dispatch, FC, SetStateAction } from 'react';
import { cn } from 'utils/helpers';

interface Props extends Pick<ExplorerSearchProps, 'filteredPairs'> {
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
}

export const ExplorerSearchSuggestions: FC<Props> = (props) => {
  return (
    <div
      className={
        'absolute left-0 z-30 mt-20 max-h-[300px] w-full overflow-hidden overflow-y-scroll rounded-10 bg-emphasis py-10'
      }
    >
      {props.filteredPairs.map((pair) => {
        const slug =
          `${pair.baseToken.symbol}-${pair.quoteToken.symbol}`.toLowerCase();

        return (
          <Link
            to={PathNames.explorerOverview('token-pair', slug)}
            key={slug}
            className={cn(
              'flex items-center space-x-10 px-30 py-10 hover:bg-white/10'
            )}
            onClick={() => {
              props.setShowSuggestions(false);
            }}
          >
            <PairLogoName pair={pair} />
          </Link>
        );
      })}
    </div>
  );
};
