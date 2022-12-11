import { FC } from 'react';
import { Strategy } from 'queries';
import { m, mItemVariant } from 'motion';
import { TokensOverlap } from 'components/TokensOverlap';
import { Imager } from 'elements/Imager';

type Props = { strategy: Strategy };

export const StrategyBlock: FC<Props> = ({ strategy }) => {
  return (
    <m.div
      variants={mItemVariant}
      className="bg-content space-y-20 rounded-10 p-20"
    >
      <div className={'flex space-x-10'}>
        <TokensOverlap
          className="h-40 w-40"
          tokens={[strategy.tokens.source, strategy.tokens.target]}
        />
        <div>
          <div className="flex">
            <span>{strategy.tokens.source.symbol}</span>
            <div>·</div>
            <span>{strategy.tokens.target.symbol}</span>
          </div>
          <div className="text-secondary">????</div>
        </div>
      </div>
      <hr className="border-silver dark:border-black-low" />
      <Section
        title={<div className="text-14 text-success-500">Buy Price</div>}
        description={`????????? ${strategy.tokens.target.symbol}`}
      />
      <Section
        title={<div className="text-14 text-error-500">Sell Price</div>}
        description={`????????? ${strategy.tokens.target.symbol}`}
      />
      <Section
        title={
          <div className="text-secondary flex items-center gap-5 text-14">
            <Imager
              className="h-10 w-10"
              src={strategy.tokens.source.logoURI}
              alt="token"
            />
            {strategy.tokens.source.symbol}
          </div>
        }
        description={`????????? ${strategy.tokens.source.symbol}`}
      />
      <Section
        title={
          <div className="text-secondary flex items-center gap-5 text-14">
            <Imager
              className="h-10 w-10"
              src={strategy.tokens.target.logoURI}
              alt="token"
            />
            {strategy.tokens.target.symbol}
          </div>
        }
        description={`????????? ${strategy.tokens.target.symbol}`}
      />
    </m.div>
  );
};

const Section = ({
  title,
  description,
}: {
  title: JSX.Element;
  description: string;
}) => {
  return (
    <div>
      {title}
      <div>{description}</div>
    </div>
  );
};
