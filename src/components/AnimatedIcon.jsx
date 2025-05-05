import { motion } from 'framer-motion';
import React from 'react';

const iconVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.2,
    rotate: 20,
    transition: {
      duration: 0.2
    }
  }
};

export const AnimatedIcon = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`animated-icon ${className}`}
      variants={iconVariants}
      initial="initial"
      whileHover="hover"
      {...props}
    >
      {children}
    </motion.div>
  );
}; 