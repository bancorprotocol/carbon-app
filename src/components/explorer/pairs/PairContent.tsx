import { useBreakpoints } from 'hooks/useBreakpoints';
import { FC } from 'react';
import { PairList } from './PairList';
import { PairRow } from './types';
import { PairTable } from './PairTable';

interface Props {
  pairs: PairRow[];
}
export const PairContent: FC<Props> = ({ pairs }) => {
  const { belowBreakpoint } = useBreakpoints();

  if (!belowBreakpoint('xl')) {
    return <PairTable pairs={pairs} />;
  } else {
    return <PairList pairs={pairs} />;
  }
};
