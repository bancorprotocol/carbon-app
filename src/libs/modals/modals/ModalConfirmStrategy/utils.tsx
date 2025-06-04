import { ReactNode } from 'react';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';

export type MutateModalContentData = {
  modalTitle: string;
  icon: ReactNode;
  title: string;
  content: string;
  additionalContent?: ReactNode;
  actionButton: string;
  variant?: 'error';
};

export const getModalDataByType = (
  type: 'pause' | 'delete',
): MutateModalContentData => {
  switch (type) {
    case 'pause':
      return {
        modalTitle: 'Pause Strategy',
        icon: <IconPause className="size-16" />,
        title: 'Are you sure you would like to pause your strategy?',
        content:
          'This will prevent your strategy from being traded against, however you will retain access to any associated funds.',
        actionButton: 'Pause Strategy',
      };

    case 'delete':
      return {
        modalTitle: 'Delete Strategy',
        icon: <IconTrash className="size-24" />,
        title: 'Are you sure you would like to delete your strategy?',
        content:
          'All data on the strategy will be deleted. It will be impossible to restore them.',
        additionalContent: (
          <div className="mt-20 flex items-center">
            <IconWallet className="mr-10 size-12" />
            <div className="text-14 font-weight-500 flex-1 text-white/80">
              All funds will be withdrawn to your wallet
            </div>
          </div>
        ),
        actionButton: 'Delete Strategy',
        variant: 'error',
      };
  }
};
