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
        modalTitle: t('modal.pauseStrategy.title'),
        icon: <IconPause className="h-16 w-16" />,
        subtitle: t('modal.pauseStrategy.subtitle'),
        content: t('modal.pauseStrategy.content'),
        actionButton: t('modal.pauseStrategy.actionButton1'),
      };
    case 'delete':
      return {
        modalTitle: t('modal.deleteStrategy.title'),
        icon: <IconTrash className="h-24 w-24" />,
        subtitle: t('modal.deleteStrategy.subtitle'),
        content: t('modal.deleteStrategy.content1'),
        additionalContent: (
          <div className="mt-20 flex items-center">
            <IconWallet className="mr-10 h-12 w-12" />
            <div className="flex-1 text-14 font-weight-500 text-white/80">
              {t('modal.deleteStrategy.content2')}
            </div>
          </div>
        ),
        actionButton: t('modal.deleteStrategy.actionButton1'),
        variant: 'error',
      };
  }
};
