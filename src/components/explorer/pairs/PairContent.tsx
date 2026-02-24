import { useBreakpoints } from 'hooks/useBreakpoints';
import { FC } from 'react';
import { PairList } from './PairList';
import { PairRow } from './types';
import { PairTable } from './PairTable';
import { NotFound } from 'components/common/NotFound';

interface Props {
  url: '/explore/pairs' | '/portfolio/pairs';
  pairs: PairRow[];
}
export const PairContent: FC<Props> = ({ pairs, url }) => {
  const { belowBreakpoint } = useBreakpoints();

  if (!pairs.length) {
    return (
      <NotFound
        variant="info"
        title="No results found"
        text="Try changing the search term"
        className="surface rounded-2xl grid-area-[list]"
      />
    );
  }

  if (!belowBreakpoint('xl')) {
    return <PairTable pairs={pairs} url={url} />;
  } else {
    return <PairList pairs={pairs} url={url} />;
  }
};
