import { FC, useEffect } from 'react';
import { ReactComponent as IconInfo } from 'assets/icons/tooltip.svg';
import { Button } from 'components/common/button';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { lsService } from 'services/localeStorage';

export const MainMenuRightWalkthrough: FC = () => {
  useEffect(() => {
    const hasWalkthrough = lsService.getItem('hasWalkthrough');
    if (!hasWalkthrough) {
      start();
    }
  }, []);

  const start = () => {
    (globalThis as any).Storylane.Play({
      type: 'popup',
      demo_type: 'image',
      width: 2560,
      height: 1291.851851851852,
      scale: '0.95',
      demo_url: 'https://app.storylane.io/demo/i2ok96zcpzqw?embed=popup',
      padding_bottom: 'calc(50.46% + 25px)',
    });
    lsService.setItem('hasWalkthrough', true);
  };

  return (
    <Tooltip element="Start Walkthrough">
      <Button
        variant="secondary"
        className="size-40 hidden p-0 md:grid"
        onClick={start}
      >
        <IconInfo className="place-self-center size-20" />
      </Button>
    </Tooltip>
  );
};
