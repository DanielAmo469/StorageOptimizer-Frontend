import { motion } from 'framer-motion';

const FadeIn = ({ children, duration = 0.7, delay = 0, direction = 'up', style = {}, ...props }) => {
  let initial = { opacity: 0 };
  let animate = { opacity: 1 };
  if (direction === 'up') {
    initial.y = 30;
    animate.y = 0;
  } else if (direction === 'down') {
    initial.y = -30;
    animate.y = 0;
  } else if (direction === 'left') {
    initial.x = 30;
    animate.x = 0;
  } else if (direction === 'right') {
    initial.x = -30;
    animate.x = 0;
  }
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn; 