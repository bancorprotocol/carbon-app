import React, { createRef, useEffect } from 'react';

declare const TradingView: any;

type WidgetProps = {
  symbol: string;
};

type ScriptHTML = {
  width?: number | string;
  height?: number | string;
  symbol?: string;
  interval?:
    | '1'
    | '3'
    | '5'
    | '15'
    | '30'
    | '60'
    | '120'
    | '180'
    | '240'
    | 'D'
    | 'W';
  range?: '1D' | '5D' | '1M' | '3M' | '6M' | 'YTD' | '12M' | '60M' | 'ALL';
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  locale?: string | 'hu_HU' | 'fa_IR' | 'en_US';
  toolbar_bg?: string;
  enable_publishing?: boolean;
  withdateranges?: boolean;
  hide_side_toolbar?: boolean;
  save_image?: boolean;
  container_id: string;
  allow_symbol_change: boolean;
};

export const Widget: React.FC<WidgetProps> = ({ symbol }) => {
  const containerId = 'tradingview_container';
  const ref: { current: HTMLDivElement | null } = createRef();

  useEffect(() => {
    let refValue: HTMLDivElement;
    const scriptHTML: ScriptHTML = {
      symbol: symbol ? symbol : 'BINANCE:ETHUSDT',
      width: '100%',
      height: '100%',
      timezone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || 'UTC',
      theme: 'dark',
      style: '1',
      range: '5D',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      save_image: false,
      container_id: containerId,
      allow_symbol_change: true,
    };

    if (ref.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';

      script.onload = () => {
        if (typeof TradingView !== 'undefined') {
          script.innerHTML = JSON.stringify(new TradingView.widget(scriptHTML));
        }
      };
      ref.current.appendChild(script);
      refValue = ref.current;
    }

    return () => {
      if (refValue.firstChild) {
        refValue.removeChild(refValue.firstChild);
      }
    };
  }, [ref, symbol]);

  return <div ref={ref} id={containerId} />;
};
