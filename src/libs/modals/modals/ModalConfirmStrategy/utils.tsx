import { ReactNode } from 'react';
import { i18n } from 'libs/translations';
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
  type: 'pause' | 'delete'
): MutateModalContentData => {
  switch (type) {
    case 'pause':
      return {
        modalTitle: i18n.t('modals.pauseStrategy.modalTitle'),
        icon: <IconPause className="h-16 w-16" />,
        title: i18n.t('modals.pauseStrategy.title'),
        content: i18n.t('modals.pauseStrategy.content'),
        actionButton: i18n.t(
          'modals.pauseStrategy.actionButtons.actionButton1'
        ),
      };

    case 'delete':
      return {
        modalTitle: i18n.t('modals.deleteStrategy.modalTitle'),
        icon: <IconTrash className="h-24 w-24" />,
        title: i18n.t('modals.deleteStrategy.title'),
        content: i18n.t('modals.deleteStrategy.contents.content1'),
        additionalContent: (
          <div className="mt-20 flex items-center">
            <IconWallet className="h-12 w-12 me-10" />
            <div className="flex-1 text-14 font-weight-500 text-white/80">
              {i18n.t('modals.deleteStrategy.contents.content2')}
            </div>
          </div>
        ),
        actionButton: i18n.t(
          'modals.deleteStrategy.actionButtons.actionButton1'
        ),
        variant: 'error',
      };
  }
};
