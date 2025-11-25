import { FC } from 'react';
import IconTooltip from 'assets/icons/tooltip.svg?react';

export const ModalTokenImportNotification: FC = () => {
  return (
    <div className="text-12 flex items-center gap-8">
      <IconTooltip className="size-16 flex-shrink-0" />
      You can import additional tokens by entering their contract addresses in
      the search field.
    </div>
  );
};
