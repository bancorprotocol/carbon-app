import { FC, ReactNode } from 'react';

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
        return 'text-warning-500 bg-warning-500/25';
      case 'error':
        return 'text-red bg-red/25';
      case 'success':
        return 'text-green bg-green/25';
      default:
        return 'bg-emphasis';
    }
  };

  const variantClass = getVariantClass();

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-60 w-60 items-center justify-center rounded-full p-18 ${variantClass}`}
      >
        {icon}
      </div>
      <h2 className="my-16 text-center">{title}</h2>
      {text && (
        <p className="text-secondary text-center font-weight-400">{text}</p>
      )}
    </div>
  );
};
