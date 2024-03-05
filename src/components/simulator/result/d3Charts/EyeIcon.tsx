import { FC } from 'react';

interface ToggleEyeProps {
  visible: boolean;
  transform?: string;
  className?: string;
}

export const ToggleEye: FC<ToggleEyeProps> = (props) => {
  const { visible, transform, className } = props;
  if (visible) {
    return (
      <g transform={transform} className={className}>
        <path
          d="M11.2288 7.00033C11.2288 7.58366 10.208 10.6462 6.99967 10.6462C3.79134 10.6462 2.77051 7.58366 2.77051 7.00033C2.77051 6.41699 3.79134 3.35449 6.99967 3.35449C10.208 3.35449 11.2288 6.41699 11.2288 7.00033Z"
          stroke="currentColor"
          fill="none"
        />
        <path
          d="M7 8.3125C7.72487 8.3125 8.3125 7.72487 8.3125 7C8.3125 6.27513 7.72487 5.6875 7 5.6875C6.27513 5.6875 5.6875 6.27513 5.6875 7C5.6875 7.72487 6.27513 8.3125 7 8.3125Z"
          stroke="currentColor"
          fill="none"
        />
      </g>
    );
  } else {
    return (
      <path
        d="M11.2298 6.99976C11.2298 7.58309 10.209 10.6456 7.00065 10.6456M11.2305 2.77051L2.77214 11.2288M6.07322 7.92777C5.56066 7.4152 5.56066 6.58418 6.07322 6.07161C6.5858 5.55903 7.41681 5.55903 7.92939 6.07161M2.77148 6.99976C2.77148 6.41642 3.79232 3.35392 7.00065 3.35392C8.17652 3.35392 9.05855 3.7653 9.70418 4.31522L4.33421 9.71551C3.19023 8.76391 2.77148 7.37336 2.77148 6.99976Z"
        stroke="currentColor"
        transform={transform}
        className={className}
        fill="none"
      />
    );
  }
};
