import { FC, ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { BackButton } from 'components/common/BackButton';

interface Props {
  editType: EditTypes;
  graph?: ReactNode;
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
    <div className="m-auto flex w-[1620px] max-w-[100vw] flex-col gap-20 p-20 ">
      <header className="flex items-center gap-16">
        <BackButton onClick={() => history.back()} />
        <h1 className="text-24 font-weight-500 flex-1">
          {titleByType[editType]}
        </h1>
      </header>

      <div className="flex flex-col gap-20 md:grid md:grid-cols-[450px_auto]">
        {children}
      </div>
    </div>
  );
};
