import { useModal } from 'hooks/useModal';
import { Modal, ModalHeader } from '../../Modal';
import { ModalFC } from '../../modals.types';
import { Link } from 'libs/routing';
import { Strategy } from 'components/strategies/common/types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import {
  getEditBudgetPage,
  getEditPricesPage,
} from 'components/strategies/edit/utils';

export interface ModalConfirmWithdrawData {
  strategy: Strategy;
}

export const ModalConfirmWithdraw: ModalFC<ModalConfirmWithdrawData> = ({
  id,
  data,
}) => {
  const { closeModal } = useModal();
  const { strategy } = data;
  const editPrices = getEditPricesPage(strategy, 'editPrices');
  const withdraw = getEditBudgetPage(strategy, 'withdraw');

  const edit = () => closeModal(id);

  return (
    <Modal id={id} className="grid gap-16">
      <ModalHeader id={id}>
        <h2>Withdraw Funds</h2>
      </ModalHeader>
      <IconTitleText
        icon={<IconWallet className="size-24" />}
        title="Are you sure you would like to withdraw your funds?"
      />
      <article className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded-2xl bg-white/10 p-16">
        <h3 className="text-14 font-medium">Did you know?</h3>
        <Link
          onClick={edit}
          to={editPrices.to}
          search={editPrices.search}
          params={{ strategyId: strategy.id }}
          className="btn-primary-gradient row-span-2 self-center"
        >
          Edit Prices
        </Link>
        <p className="text-12 text-white/80">
          Editing prices is cheaper and keeps your strategy working for you.
        </p>
      </article>
      <Link
        onClick={edit}
        to={withdraw.to}
        search={withdraw.search}
        params={{ strategyId: strategy.id }}
        className="btn-on-surface"
        data-testid="withdraw-strategy-btn"
      >
        Withdraw Funds
      </Link>
    </Modal>
  );
};
