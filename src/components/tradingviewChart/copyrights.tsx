import { FC } from 'react';

export type CopyrightProps = {
  symbol: string;
};

export const Copyright: FC<CopyrightProps> = ({ symbol }) => {
  const href = `https://www.tradingview.com/symbols/${symbol}`;

  return (
    <div className="text-center align-middle text-12 leading-10 text-lightBlue">
      <a
        className="text-lightBlue no-underline"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <span className="text-blue">{symbol} </span>
      </a>
      By TradingView
    </div>
  );
};
