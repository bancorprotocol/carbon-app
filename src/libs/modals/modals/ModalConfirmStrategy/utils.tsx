import { ReactNode } from 'react';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { TFunction } from 'libs/translations';

export type MutateModalContentData = {
  modalTitle: string;
  icon: ReactNode;
  subtitle: string;
  content: string;
  additionalContent?: ReactNode;
  actionButton: string;
  variant?: 'error';
};

export const getModalDataByType = (
  type: 'pause' | 'delete',
  t: TFunction<string, undefined, string>
): MutateModalContentData => {
  switch (type) {
    case 'pause':
      return {
        modalTitle: t('modal.pause.title', 'Pause Strategy'),
        icon: <IconPause className="h-16 w-16" />,
        subtitle: t(
          'modal.pause.subtitle',
          'Are you sure you would like to pause your strategy?'
        ),
        content: t(
          'modal.pause.content',
          'This will prevent your strategy from being traded against, however you will retain access to any associated funds.'
        ),
        actionButton: t('modal.pause.actionButton', 'Pause Strategy'),
      };
    case 'delete':
      return {
        modalTitle: t('modal.delete.title', 'Delete Strategy'),
        icon: <IconTrash className="h-24 w-24" />,
        subtitle: t(
          'modal.delete.subtitle',
          'Are you sure you would like to delete your strategy?'
        ),
        content: t(
          'modal.delete.content',
          'All data on the strategy will be deleted. It will be impossible to restore them.'
        ),
        additionalContent: (
          <div className="mt-20 flex items-center">
            <IconWallet className="mr-10 h-12 w-12" />
            <div className="flex-1 text-14 font-weight-500 text-white/80">
              {t(
                'modal.delete.additionalContent',
                'All funds will be withdrawn to your wallet'
              )}
            </div>
          </div>
        ),
        actionButton: t('modal.delete.actionButton', 'Delete Strategy'),
        variant: 'error',
      };
  }
};
