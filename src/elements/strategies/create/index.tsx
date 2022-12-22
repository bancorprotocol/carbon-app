import { Button } from 'components/Button';
import { m, Variants } from 'motion';
import { useCreate } from './useCreateStrategy';
import { SelectTokens } from 'components/SelectTokens';
import { BuySellBlock } from 'components/BuySellBlock';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useLocation } from 'routing';
import { Tooltip } from 'components/Tooltip';
import { NameBlock } from './NameBlock';

export const CreateStrategy = () => {
  const location = useLocation();

  const {
    source,
    target,
    name,
    setName,
    createStrategy,
    openTokenListModal,
    showStep2,
    isCTAdisabled,
  } = useCreate();

  return (
    <m.div
      className={'space-y-20'}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <div className="flex items-center gap-16 text-24">
        <button
          onClick={() => location.history.back()}
          className="h-40 w-40 rounded-full bg-emphasis"
        >
          <IconChevron className="mx-auto w-14 rotate-90" />
        </button>
        Create Strategy
      </div>
      <m.div variants={items} className={'bg-secondary rounded-18 p-20'}>
        <div className="mb-14 flex items-center justify-between">
          <h2>Token Pair</h2>
          <Tooltip>??????????</Tooltip>
        </div>

        <SelectTokens
          symbol0={source.token?.symbol}
          symbol1={target.token?.symbol}
          imgUrl0={source.token?.logoURI}
          imgUrl1={target.token?.logoURI}
          onClick0={() => openTokenListModal(true)}
          onClick1={() => openTokenListModal()}
          onMiddleClick={() => {
            if (source.token || target.token) {
              source.setToken(target.token);
              target.setToken(source.token);
            }
          }}
          middleDisabled={!(source.token || target.token)}
        />
      </m.div>
      {showStep2 && (
        <>
          <m.div variants={items}>
            <BuySellBlock source={source} target={target} buy />
          </m.div>

          <m.div variants={items}>
            <BuySellBlock source={source} target={target} />
          </m.div>

          <m.div variants={items}>
            <NameBlock name={name} setName={setName} />
          </m.div>

          <m.div variants={items}>
            <Button
              className="mb-80"
              variant={'secondary'}
              size={'lg'}
              fullWidth
              onClick={createStrategy}
              disabled={isCTAdisabled}
            >
              Create Strategy
            </Button>
          </m.div>
        </>
      )}
    </m.div>
  );
};

const list: Variants = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    transition: {
      when: 'afterChildren',
    },
    opacity: 0,
  },
};

const items: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
};
