import { FC } from 'react';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';

export const ModalTokenImportNotification: FC = () => {
  return (
    <div className="text-12 flex items-center gap-10">
      <IconTooltip className="size-14 flex-shrink-0" />
      You can import additional tokens by entering their contract addresses in
      the search field.
    </div>
  );
};
