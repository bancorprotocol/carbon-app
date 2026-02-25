import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

export type IconTitleTextProps = {
  icon: ReactNode;
  title: string;
  text?: string | ReactNode;
  variant?: 'warning' | 'error' | 'success';
};

export const IconTitleText: FC<IconTitleTextProps> = ({
  icon,
  title,
  text,
  variant,
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'warning':
        return 'text-warning bg-warning/25';
      case 'error':
        return 'text-error bg-error/25';
      case 'success':
        return 'text-primary bg-primary/25';
      default:
        return 'bg-main-700';
    }
  };

  const variantClass = getVariantClass();

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'grid place-items-center size-60 rounded-full p-16',
          variantClass,
        )}
      >
        {icon}
      </div>
      <h2 className="my-16 text-center">{title}</h2>
      {text && (
        <p className="text-14 font-normal text-center text-main-0/60">{text}</p>
      )}
    </div>
  );
};
