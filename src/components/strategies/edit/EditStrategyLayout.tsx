import { FC, ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { BackButton } from 'components/common/button/BackButton';
import { EditStrategyOverlapTokens } from './EditStrategyOverlapTokens';
import { EditPriceNav } from './EditPriceNav';

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
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-20 p-20">
      <header className="flex items-center gap-16">
        <BackButton onClick={() => history.back()} />
        <div className="flex mr-auto">
          <EditStrategyOverlapTokens />
          <h1 className="grid place-items-center px-16 text-24 font-medium rounded-e-full bg-white-gradient">
            {titleByType[editType]}
          </h1>
        </div>
        <EditPriceNav editType={editType} />
      </header>
      <div className="flex flex-col-reverse gap-20 md:grid md:grid-cols-[auto_450px] md:items-start">
        {children}
      </div>
    </div>
  );
};
