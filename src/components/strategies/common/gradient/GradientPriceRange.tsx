import {
  FocusEvent,
  FC,
  useId,
  useEffect,
  useState,
  useMemo,
  MouseEvent,
  useRef,
} from 'react';
import { Token } from 'libs/tokens';
import { formatNumber, roundSearchParam, sanitizeNumber } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import { Presets } from 'components/common/preset/Preset';
import { buyPresets, sellPresets } from '../price-presets';
import { StrategyDirection } from 'libs/routing';
import { SafeDecimal } from 'libs/safedecimal';
import { useStrategyMarketPrice } from 'components/strategies/UserMarketPrice';
import { MarketPriceIndication } from 'components/strategies/marketPriceIndication/MarketPriceIndication';

interface Props {
  base: Token;
  quote: Token;
  start: string;
  setStart: (value: string) => void;
  end: string;
  setEnd: (value: string) => void;
  direction: StrategyDirection;
}

export const GradientPriceRange: FC<Props> = (props) => {
  const { base, quote, start, end, setStart, setEnd, direction } = props;
  const [localStart, setLocalStart] = useState(roundSearchParam(start));
  const [localEnd, setLocalEnd] = useState(roundSearchParam(end));
  const inputStartId = useId();
  const inputEndId = useId();
  const { marketPrice } = useStrategyMarketPrice({ base, quote });
  const startTimeout = useRef<NodeJS.Timeout>(null);
  const endTimeout = useRef<NodeJS.Timeout>(null);

  const startPercent = useMemo(() => {
    if (!marketPrice) return '';
    return new SafeDecimal(start).div(marketPrice).sub(1).mul(100).toString();
  }, [marketPrice, start]);

  const endPercent = useMemo(() => {
    if (!marketPrice) return '';
    return new SafeDecimal(end).div(marketPrice).sub(1).mul(100).toString();
  }, [marketPrice, end]);

  useEffect(() => {
    if (document.activeElement !== document.getElementById(inputStartId)) {
      setLocalStart(roundSearchParam(start));
    }
  }, [inputStartId, start]);

  useEffect(() => {
    if (document.activeElement !== document.getElementById(inputEndId)) {
      setLocalEnd(roundSearchParam(end));
    }
  }, [inputEndId, end]);

  const setStartPreset = (preset: string) => {
    if (!marketPrice) return;
    const percent = new SafeDecimal(1).add(new SafeDecimal(preset).div(100));
    const next = new SafeDecimal(marketPrice).mul(percent).toString();
    setLocalStart(roundSearchParam(next));
    setStart(next);
  };

  const onStartFocus = (e: FocusEvent<HTMLInputElement>) => {
    setLocalStart(start);
    e.target.select();
  };

  const onStartChange = (value: string) => {
    const sanitized = sanitizeNumber(value);
    setLocalStart(sanitized);
    if (startTimeout.current) clearTimeout(startTimeout.current);
    startTimeout.current = setTimeout(() => setStart(sanitized), 800);
  };

  const setStartMarket = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onStartChange(formatNumber(marketPrice!));
  };

  const onStartBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setLocalStart(roundSearchParam(formatted));
    setStart(formatted);
  };

  const onEndFocus = (e: FocusEvent<HTMLInputElement>) => {
    setLocalEnd(end);
    e.target.select();
  };

  const onEndChange = (value: string) => {
    const sanitized = sanitizeNumber(value);
    setLocalEnd(sanitized);
    if (endTimeout.current) clearTimeout(endTimeout.current);
    endTimeout.current = setTimeout(() => setEnd(sanitized), 800);
  };

  const setEndMarket = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onEndChange(formatNumber(marketPrice!));
  };

  const onEndBlur = (e: FocusEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setLocalEnd(roundSearchParam(formatted));
    setEnd(formatted);
  };

  const setEndPreset = (preset: string) => {
    if (!marketPrice) return;
    const percent = new SafeDecimal(1).add(new SafeDecimal(preset).div(100));
    const next = new SafeDecimal(marketPrice).mul(percent).toString();
    setLocalEnd(roundSearchParam(next));
    setEnd(next);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div
          className="rounded-s-2xl grid w-full cursor-text gap-8 border border-black bg-black p-16 focus-within:border-white/50"
          onClick={() => document.getElementById(inputStartId)?.focus()}
        >
          <header className="flex items-center justify-between">
            <label
              htmlFor={inputStartId}
              className="text-12 flex justify-between text-white/60"
            >
              _S P_
            </label>
            {!!marketPrice && (
              <button
                className="text-12 font-medium text-gradient hover:text-secondary focus:text-secondary active:text-secondary"
                type="button"
                onClick={setStartMarket}
                data-testid="market-start-price"
              >
                Use Market
              </button>
            )}
          </header>
          <input
            id={inputStartId}
            type="text"
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={localStart}
            placeholder="Enter Price"
            className="text-18 font-medium w-full text-ellipsis bg-transparent focus:outline-hidden"
            onChange={(e) => onStartChange(e.target.value)}
            onFocus={onStartFocus}
            onBlur={onStartBlur}
            required
          />
          <MarketPriceIndication
            base={base}
            quote={quote}
            price={localStart}
            isBuy={direction === 'buy'}
            ignoreMarketPriceWarning
          />
        </div>
        <div
          className="rounded-e-2xl grid w-full cursor-text gap-8 border border-black bg-black p-16 focus-within:border-white/50"
          onClick={() => document.getElementById(inputEndId)?.focus()}
        >
          <header className="flex items-center justify-between">
            <label
              htmlFor={inputEndId}
              className="text-12 flex justify-between text-white/60"
            >
              _E P_
            </label>
            {!!marketPrice && (
              <button
                className="text-12 font-medium text-gradient hover:text-secondary focus:text-secondary active:text-secondary"
                type="button"
                onClick={setEndMarket}
                data-testid="market-end-price"
              >
                Use Market
              </button>
            )}
          </header>
          <input
            id={inputEndId}
            type="text"
            pattern={decimalNumberValidationRegex}
            inputMode="decimal"
            value={localEnd}
            placeholder="Enter Price"
            className="text-18 font-medium w-full text-ellipsis bg-transparent focus:outline-hidden"
            onChange={(e) => onEndChange(e.target.value)}
            onFocus={onEndFocus}
            onBlur={onEndBlur}
            required
          />
          <MarketPriceIndication
            base={base}
            quote={quote}
            price={localEnd}
            isBuy={direction === 'buy'}
            ignoreMarketPriceWarning
          />
        </div>
        {!!marketPrice && (
          <>
            <Presets
              value={startPercent}
              presets={direction === 'buy' ? buyPresets : sellPresets}
              onChange={setStartPreset}
            />
            <Presets
              value={endPercent}
              presets={direction === 'buy' ? buyPresets : sellPresets}
              onChange={setEndPreset}
            />
          </>
        )}
      </div>
    </>
  );
};
