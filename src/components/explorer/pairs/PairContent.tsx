import { useBreakpoints } from 'hooks/useBreakpoints';
import { FC } from 'react';
import { PairList } from './PairList';
import { PairRow } from './types';
import { PairTable } from './PairTable';
import { NotFound } from 'components/common/NotFound';

interface Props {
  pairs: PairRow[];
}
export const PairContent: FC<Props> = ({ pairs }) => {
  const { belowBreakpoint } = useBreakpoints();

  if (!pairs.length) {
    return (
      <NotFound
        variant="info"
        title="No results found"
        text="Try changing the search term"
        className="bg-white-gradient rounded-2xl grid-area-[list]"
      />
    );
  }

  if (!belowBreakpoint('xl')) {
    return <PairTable pairs={pairs} />;
  } else {
    return <PairList pairs={pairs} />;
  }
};
