import { FC } from 'react';
import InfoIcon from 'assets/icons/info.svg?react';

export const ModalTokenImportNotification: FC = () => {
  return (
    <div className="text-12 flex items-center gap-8">
      <InfoIcon className="size-24 flex-shrink-0" />
      You can import additional tokens by entering their contract addresses in
      the search field.
    </div>
  );
};
