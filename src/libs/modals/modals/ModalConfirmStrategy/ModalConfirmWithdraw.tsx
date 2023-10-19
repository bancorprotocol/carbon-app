import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from '../../ModalOrMobileSheet';
import { ModalFC } from '../../modals.types';
import { Link, PathNames } from 'libs/routing';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Strategy } from 'libs/queries';
import { useStore } from 'store';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { cn } from 'utils/helpers';

export interface ModalConfirmWithdrawData {
  strategy: Strategy;
}

export const ModalConfirmWithdraw: ModalFC<ModalConfirmWithdrawData> = ({
  id,
  data,
}) => {
  const { strategies } = useStore();
  const { closeModal } = useModal();

  const edit = () => {
    strategies.setStrategyToEdit(data.strategy);
    closeModal(id);
  };

  return (
    <ModalOrMobileSheet id={id} title="Withdraw Funds">
      <IconTitleText
        icon={<IconWallet className="h-24 w-24" />}
        title="Are you sure you would like to withdraw your funds?"
      />
      <article className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded bg-emphasis p-16">
        <h3 className="text-14 font-weight-500">Did you know ?</h3>
        <Link
          onClick={edit}
          to={PathNames.editStrategy}
          search={{ type: 'editPrices' }}
          className={cn(
            'row-span-2 self-center',
            buttonStyles({ variant: 'white' })
          )}
        >
          Edit Prices
        </Link>
        <p className="text-12 text-white/80">
          Editing prices is cheaper and keeps your strategy working for you.
        </p>
      </article>
      <Link
        onClick={edit}
        to={PathNames.editStrategy}
        search={{ type: 'withdraw' }}
        className={buttonStyles({ variant: 'white' })}
      >
        Withdraw Funds
      </Link>
    </ModalOrMobileSheet>
  );
};
