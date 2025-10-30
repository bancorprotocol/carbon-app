import { NewTabLink, externalLinks } from 'libs/routing';
import { FC, ReactNode } from 'react';
import {
  IconTitleText,
  IconTitleTextProps,
} from 'components/common/iconTitleText/IconTitleText';

type Props = IconTitleTextProps & {
  children?: ReactNode;
};

const DefaultChildren = () => (
  <NewTabLink to={externalLinks.faq} className="btn-error-gradient text-14 ">
    Contact Support
  </NewTabLink>
);

export const ErrorWrapper: FC<Props> = ({ children, ...props }) => {
  return (
    <div className="rounded-lg bg-main-900/60 w-[385px] grid gap-16 place-self-center p-20">
      <IconTitleText {...props} />
      {children ? children : <DefaultChildren />}
    </div>
  );
};
