import { ReactNode } from 'react';
import { ReactComponent as IconWarning } from 'assets/icons/pause.svg';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';

export type DataType = {
  modalTitle: string;
  icon: ReactNode;
  title: string;
  content: string;
  additionalContent?: ReactNode;
  actionButton: string;
  variant?: 'error';
};

export const getData = (type: 'pause' | 'delete'): DataType | undefined => {
  switch (type) {
    case 'pause':
      return {
        modalTitle: 'Pause Strategy',
        icon: <IconWarning className="h-16 w-16" />,
        title: 'Are you sure you would like to pause your strategy?',
        content:
          'This will pause the strategy but you will maintain access to any associated funds',
        actionButton: 'Pause Strategy',
      };
    case 'delete':
      return {
        modalTitle: 'Delete Strategy',
        icon: <IconTrash className="h-24 w-24" />,
        title: 'Are you sure you would like to delete your strategy?',
        content:
          'All data on the strategy will be deleted.It will be impossible to restore them.',
        additionalContent: (
          <div className="mt-20 flex items-center">
            <IconWallet className="mr-10 h-12 w-12" />
            <div className="white/80 flex-1 text-14 font-weight-500">
              All funds will be withdrawn to your wallet
            </div>
          </div>
        ),
        actionButton: 'Delete Strategy',
        variant: 'error',
      };
    default:
      return {
        icon: null,
        modalTitle: '',
        title: '',
        content: '',
        actionButton: '',
      };
  }
};
