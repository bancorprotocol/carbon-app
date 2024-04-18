import { FC } from 'react';

export type CopyrightProps = {
  symbol: string;
};

export const Copyright: FC<CopyrightProps> = ({ symbol }) => {
  const href = `https://www.tradingview.com/symbols/${symbol}`;

  return (
    <div className="text-12 text-center align-middle leading-10 text-[#9db2bd]">
      <a
        className="text-[#9db2bd] no-underline"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {symbol}&nbsp;
      </a>
      By TradingView
    </div>
  );
};
