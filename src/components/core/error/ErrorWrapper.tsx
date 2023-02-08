import {
  IconTitleText,
  IconTitleTextProps,
} from 'components/common/iconTitleText/IconTitleText';
import { FC, ReactNode } from 'react';
import { Button } from 'components/common/button';

type Props = IconTitleTextProps & {
  children?: ReactNode;
};

export const ErrorWrapper: FC<Props> = ({ children, ...props }) => {
  return (
    <div
      className={
        'mx-auto mt-100 w-[385px] space-y-16 rounded-10 bg-silver p-20'
      }
    >
      <IconTitleText {...props} />
      {children ? (
        children
      ) : (
        // TODO: Add support link
        <Button variant={'error'} fullWidth>
          Contact Support
        </Button>
      )}
    </div>
  );
};
