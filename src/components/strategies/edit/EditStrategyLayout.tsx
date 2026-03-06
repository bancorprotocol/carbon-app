import { FC, ReactNode } from 'react';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { EditPriceNav } from './EditPriceNav';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { StrategyFormProvider } from '../common/StrategyFormProvider';
import { useEditStrategyCtx } from './EditStrategyContext';

interface Props {
  editType: EditTypes;
  marketPrice?: number;
  children: ReactNode;
}

export const EditStrategyLayout: FC<Props> = (props) => {
  const { editType, children, marketPrice } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;

  return (
    <StrategyFormProvider base={base} quote={quote} marketPrice={marketPrice}>
      <div className="2xl:grid lg:flex grid gap-16 self-start grid-area-[nav] 2xl:sticky top-[96px]">
        <EditStrategyOverlapTokens />
        <EditPriceNav editType={editType} />
      </div>
      {children}
    </StrategyFormProvider>
  );
};
