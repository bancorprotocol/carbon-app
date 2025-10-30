import { FC, ReactNode } from 'react';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { EditPriceNav } from './EditPriceNav';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';

interface Props {
  editType: EditTypes;
  children: ReactNode;
}

export const EditStrategyLayout: FC<Props> = (props) => {
  const { editType, children } = props;

  return (
    <>
      <header className="2xl:grid lg:flex grid gap-16 self-start grid-area-[nav] 2xl:sticky top-[96px]">
        <EditStrategyOverlapTokens />
        <EditPriceNav editType={editType} />
      </header>
      {children}
    </>
  );
};
