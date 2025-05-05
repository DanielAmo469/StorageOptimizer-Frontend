import { motion } from 'framer-motion';
import React from 'react';

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

export const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  return (
    <motion.button
      type={type}
      className={`animated-button ${className}`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}; 