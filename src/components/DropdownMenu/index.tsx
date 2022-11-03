import { motion } from 'framer-motion';
import { useState } from 'react';

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={'relative'}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </motion.button>
      <motion.div
        className={
          'absolute mt-10 -ml-20 min-w-[200px] space-y-10 rounded bg-primary-500/10 px-24 py-16 shadow-xl backdrop-blur-2xl dark:bg-darkGrey/30'
        }
        variants={{
          open: {
            //clipPath: 'inset(0% 0% 0% 0% round 10px)',
            opacity: 1,
            scale: 1,
            y: '0px',
            x: '0px',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05,
            },
          },
          closed: {
            //clipPath: 'inset(10% 50% 90% 50% round 10px)',
            opacity: 0,
            scale: 0.8,
            y: '-40px',
            x: '-30px',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div>Item 1</div>
        <div>Item 1</div>
        <div>Item 1</div>
        <div>Item 1</div>
        <div>Item 1</div>
        <div>Item 1</div>
        <div>Item 1</div>
        <div>Item 1</div>
      </motion.div>
    </motion.div>
  );
};
