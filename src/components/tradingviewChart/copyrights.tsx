import { FC } from 'react';

export type CopyrightProps = {
  symbol: string;
};

export const Copyright: FC<CopyrightProps> = ({ symbol }) => {
  const href = `https://www.tradingview.com/symbols/${symbol}`;

  return (
    <div className="text-center align-middle text-12 leading-10 text-[#9db2bd]">
      <a
        className="text-[#2962FF] no-underline"
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
