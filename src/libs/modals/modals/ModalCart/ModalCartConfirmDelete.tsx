import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from '../../ModalOrMobileSheet';
import { ModalFC } from '../../modals.types';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { CartStrategy } from 'libs/queries';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { cn } from 'utils/helpers';
import { Button } from 'components/common/button';
import { lsService } from 'services/localeStorage';
import { useDuplicate } from 'components/strategies/create/useDuplicateStrategy';
import styles from 'components/strategies/overview/StrategyContent.module.css';

export interface ModalCartConfirmDeleteData {
  strategy: CartStrategy;
}

const flip = (selector: string) => {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const boxes = new Map<HTMLElement, DOMRect>();
  for (const el of elements) {
    boxes.set(el, el.getBoundingClientRect());
  }
  let attempts = 0;
  const checkChange = () => {
    if (attempts > 10) return;
    attempts++;
    const updated = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === updated.length) {
      return requestAnimationFrame(checkChange);
    }
    for (const [el, box] of boxes.entries()) {
      const newBox = el.getBoundingClientRect();
      if (box.top === newBox.top && box.left === newBox.left) continue;
      const keyframes = [
        // eslint-disable-next-line prettier/prettier
        {
          transform: `translate(${box.left - newBox.left}px, ${
            box.top - newBox.top
          }px)`,
        },
        { transform: `translate(0px, 0px)` },
      ];
      el.animate(keyframes, {
        duration: 300,
        easing: 'cubic-bezier(.85, 0, .15, 1)',
      });
    }
  };
  requestAnimationFrame(checkChange);
};

export const ModalCartConfirmDelete: ModalFC<ModalCartConfirmDeleteData> = ({
  id,
  data,
}) => {
  const { closeModal } = useModal();
  const { strategy } = data;
  const duplicate = useDuplicate();

  const onClick = async () => {
    closeModal(id);

    // Animate leaving strategy
    const keyframes = { opacity: 0, transform: 'scale(0.9)' };
    const option = {
      duration: 200,
      easing: 'cubic-bezier(.55, 0, 1, .45)',
      fill: 'forwards' as const,
    };
    await document.getElementById(id)?.animate(keyframes, option).finished;

    // Delete from localstorage
    const current = lsService.getItem('cart') ?? [];
    const next = current.filter(({ id }) => id !== strategy.id);
    lsService.setItem('cart', next);

    // Animate remaining strategies
    flip(`.${styles.strategyList} > li`);
  };

  const edit = () => {
    closeModal(id);
    duplicate(strategy);
  };

  return (
    <ModalOrMobileSheet id={id} title="Delete Strategy">
      <IconTitleText
        variant="error"
        icon={<IconTrash className="size-24" />}
        title="Are you sure you would like to delete your strategy?"
        text="Deleting your strategy will result in all strategy data being lost and impossible to restore. All funds will be withdrawn to your wallet."
      />
      <article className="bg-background-800 grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-8 rounded p-16">
        <h3 className="text-14 font-weight-500">Did you know?</h3>
        <button
          onClick={edit}
          className={cn(
            'row-span-2 self-center',
            buttonStyles({ variant: 'success' })
          )}
        >
          Edit
        </button>
        <p className="text-12 text-white/80">
          Editing prices is cheaper and keeps your strategy working for you.
        </p>
      </article>

      <Button
        variant="success"
        onClick={onClick}
        data-testid="delete-strategy-btn"
      >
        Delete Strategy
      </Button>
    </ModalOrMobileSheet>
  );
};
