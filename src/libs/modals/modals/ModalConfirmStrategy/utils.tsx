import { ReactNode } from 'react';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { TFunction } from 'libs/translations';

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
  t: TFunction<string, undefined, string>
): MutateModalContentData => {
  switch (type) {
    case 'pause':
      return {
        modalTitle: t('modals.pauseStrategy.modalTitle'),
        icon: <IconPause className="h-16 w-16" />,
        title: t('modals.pauseStrategy.title'),
        content: t('modals.pauseStrategy.content'),
        actionButton: t('modals.pauseStrategy.actionButtons.actionButton1'),
      };

    case 'delete':
      return {
        modalTitle: t('modals.deleteStrategy.modalTitle'),
        icon: <IconTrash className="h-24 w-24" />,
        title: t('modals.deleteStrategy.title'),
        content: t('modals.deleteStrategy.contents.content1'),
        additionalContent: (
          <div className="mt-20 flex items-center">
            <IconWallet className="mr-10 h-12 w-12" />
            <div className="flex-1 text-14 font-weight-500 text-white/80">
              {t('modals.deleteStrategy.contents.content2')}
            </div>
          </div>
        ),
        actionButton: t('modals.deleteStrategy.actionButtons.actionButton1'),
        variant: 'error',
      };
  }
};
