import { Variants } from 'libs/motion';
import { i18n } from 'libs/translations';

export const getInAndOutVariant = () => {
  const dropInAndOut: Variants = {
    hidden: {
      x: i18n.dir() === 'ltr' ? '100vh' : '-100vh',
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0,
        duration: 0.5,
      },
    },
    exit: {
      x: i18n.dir() === 'ltr' ? '100vh' : '-100vh',
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return dropInAndOut;
};
