import { motion, Variants } from 'framer-motion';
import { useState } from 'react';

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={'relative w-full'}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </motion.button>
      <motion.ul
        className={
          'absolute mt-10 -ml-20 min-w-[200px] space-y-10 bg-lightGrey px-20 py-10 dark:bg-darkGrey'
        }
        variants={{
          open: {
            clipPath: 'inset(0% 0% 0% 0% round 10px)',
            opacity: 1,
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05,
            },
          },
          closed: {
            clipPath: 'inset(10% 50% 90% 50% round 10px)',
            opacity: 0,
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <motion.li variants={itemVariants}>Item 1 </motion.li>
        <motion.li variants={itemVariants}>Item 2 </motion.li>
        <motion.li variants={itemVariants}>Item 3 </motion.li>
        <motion.li variants={itemVariants}>Item 4 </motion.li>
        <motion.li variants={itemVariants}>Item 5 </motion.li>
      </motion.ul>
    </motion.div>
  );
};
