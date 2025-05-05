import { motion } from 'framer-motion';
import React from 'react';

const pageVariants = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: { 
    opacity: 1,
    y: 0
  },
  exit: { 
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  duration: 0.5,
  ease: 'easeInOut'
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const childVariants = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: { 
    opacity: 1,
    y: 0
  }
};

export const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
  >
    <motion.div 
      variants={containerVariants} 
      animate="animate"
      className="page-content"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
); 