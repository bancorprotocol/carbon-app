import {
  IconTitleText,
  IconTitleTextProps,
} from 'components/common/iconTitleText/IconTitleText';
import { FC, ReactNode } from 'react';
import { Button } from 'components/common/button';
import { Link } from 'libs/routing';

type Props = IconTitleTextProps & {
  children?: ReactNode;
};

const DefaultChildren = () => (
  <div>
    <Link to={'https://faq.carbondefi.xyz/'}>
      <Button variant={'error'} fullWidth>
        Contact Support
      </Button>
    </Link>
  </div>
);

export const ErrorWrapper: FC<Props> = ({ children, ...props }) => {
  return (
    <div
      id="networkError"
      className={
        'mx-auto mt-100 w-[385px] space-y-16 rounded-10 bg-silver p-20'
      }
    >
      <IconTitleText {...props} />
      {children ? children : <DefaultChildren />}
    </div>
  );
};
