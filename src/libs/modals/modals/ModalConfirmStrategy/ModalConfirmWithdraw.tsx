import { useModal } from 'hooks/useModal';
import { Modal, ModalHeader } from '../../Modal';
import { ModalProps } from '../../modals.types';
import { Link } from 'libs/routing';
import { Strategy } from 'components/strategies/common/types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import IconWallet from 'assets/icons/wallet.svg?react';
import {
  getEditBudgetPage,
  getEditPricesPage,
} from 'components/strategies/edit/utils';

interface ModalConfirmWithdrawData {
  strategy: Strategy;
}

export default function ModalConfirmWithdraw({
  id,
  data,
}: ModalProps<ModalConfirmWithdrawData>) {
  const { closeModal } = useModal();
  const { strategy } = data;
  const editPrices = getEditPricesPage(strategy, 'editPrices');
  const withdraw = getEditBudgetPage(strategy, 'withdraw');

  const close = () => closeModal(id);

  return (
    <Modal id={id} className="grid gap-16">
      <ModalHeader id={id}>
        <h2>Withdraw Funds</h2>
      </ModalHeader>
      <IconTitleText
        icon={<IconWallet className="size-24" />}
        title="Are you sure you would like to withdraw your funds?"
      />
      <article className="bg-main-900/80 grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded-2xl p-16">
        <h3 className="text-14 font-medium">Did you know?</h3>
        <Link
          onClick={close}
          to={editPrices.to}
          search={editPrices.search}
          params={{ strategyId: strategy.id }}
          className="btn-main-gradient row-span-2 self-center"
        >
          Edit Prices
        </Link>
        <p className="text-12 text-main-0/80">
          Editing prices is cheaper and keeps your strategy working for you.
        </p>
      </article>
      <article className="bg-main-900/80 grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded-2xl p-16">
        <h3 className="text-14 font-medium">Only Withdraw Funds</h3>
        <Link
          onClick={close}
          to={withdraw.to}
          search={withdraw.search}
          params={{ strategyId: strategy.id }}
          className="btn-primary row-span-2 self-center"
          data-testid="withdraw-strategy-btn"
        >
          Withdraw Funds
        </Link>
        <p className="text-12 text-main-0/80">
          Withdraw all or a part of the funds in the strategy.
        </p>
      </article>

      <button type="reset" className="btn-on-surface" onClick={close}>
        Cancel
      </button>
    </Modal>
  );
}
