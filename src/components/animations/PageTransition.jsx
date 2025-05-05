import { motion } from 'framer-motion';

const variants = {
  initial: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0,
    y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
    y: direction === 'up' ? -60 : direction === 'down' ? 60 : 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

const PageTransition = ({
  children,
  direction = 'up',
  duration = 0.5,
  style = {},
  ...props
}) => (
  <motion.div
    custom={direction}
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={style}
    {...props}
  >
    {children}
  </motion.div>
);

export default PageTransition; 