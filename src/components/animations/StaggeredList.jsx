import { motion } from 'framer-motion';

const StaggeredList = ({ children, direction = 'up', duration = 0.6, stagger = 0.12, ...props }) => {
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
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      {...props}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: initial,
                show: {
                  ...animate,
                  transition: { duration, ease: [0.4, 0, 0.2, 1] },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
};

export default StaggeredList; 