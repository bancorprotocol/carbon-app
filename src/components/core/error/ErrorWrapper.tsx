import { NewTabLink, externalLinks } from 'libs/routing';
import { FC, ReactNode } from 'react';
import {
  IconTitleText,
  IconTitleTextProps,
} from 'components/common/iconTitleText/IconTitleText';
import { Button } from 'components/common/button';

type Props = IconTitleTextProps & {
  children?: ReactNode;
};

const DefaultChildren = () => (
  <div>
    <NewTabLink to={externalLinks.faq}>
      <Button variant="error" fullWidth>
        Contact Support
      </Button>
    </NewTabLink>
  </div>
);

export const ErrorWrapper: FC<Props> = ({ children, ...props }) => {
  return (
    <div className="rounded-10 bg-background-900 w-[385px] space-y-16 place-self-center p-20">
      <IconTitleText {...props} />
      {children ? children : <DefaultChildren />}
    </div>
  );
};
