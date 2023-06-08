import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';

export type NotEnoughLiquidityProps = {
  source: Token;
  target: Token;
};

export const NotEnoughLiquidity = ({
  source,
  target,
}: NotEnoughLiquidityProps) => {
  const { t } = useTranslation();
  const { duplicate } = useDuplicateStrategy();

  return (
    <div className="t-grey mt-5 min-h-[228px] flex-1">
      <div
        className={`flex h-full flex-col items-center
          justify-center rounded-12 border border-red/100 px-[4rem] text-center text-14 font-weight-400`}
      >
        <div className="mb-16 flex flex h-38 w-38 items-center justify-center rounded-full bg-red/10">
          <IconWarning className="h-16 w-16 fill-red/100" />
        </div>
        <div className="mb-8 font-weight-500">
          {t('pages.trade.errors.error3')}
        </div>
        <div>{t('pages.trade.errors.error8')}</div>
        <div>
          {t('pages.trade.section2.content2')}
          <span
            onClick={() => duplicate({ base: source, quote: target })}
            className="cursor-pointer font-weight-500"
          >
            {t('pages.trade.section2.actionButton6')}
          </span>
        </div>
      </div>
    </div>
  );
};
