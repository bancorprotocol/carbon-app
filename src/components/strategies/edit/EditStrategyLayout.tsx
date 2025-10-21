import { FC, ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { BackButton } from 'components/common/button/BackButton';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { EditPriceNav } from './EditPriceNav';
import { cn } from 'utils/helpers';
import style from '../common/root.module.css';

interface Props {
  editType: EditTypes;
  children: ReactNode;
}

const titleByType: Record<EditTypes, string> = {
  renew: 'Renew Strategy',
  editPrices: 'Edit Prices',
  deposit: 'Deposit Budgets',
  withdraw: 'Withdraw Budgets',
};

export const EditStrategyLayout: FC<Props> = (props) => {
  const { editType, children } = props;
  const { history } = useRouter();

  return (
    <div
      className={cn(
        style.root,
        'mx-auto grid w-full gap-16 p-16 max-w-[1920px]',
      )}
    >
      <header className="2xl:grid lg:flex grid gap-16 self-start grid-area-[nav] 2xl:sticky top-[96px]">
        <div className="flex gap-8 items-center">
          <BackButton onClick={() => history.back()} />
          <div className="flex">
            <EditStrategyOverlapTokens />
            <h1 className="grid place-items-center px-16 text-18 font-medium rounded-e-full surface">
              {titleByType[editType]}
            </h1>
          </div>
        </div>
        <EditPriceNav editType={editType} />
      </header>
      {children}
    </div>
  );
};
