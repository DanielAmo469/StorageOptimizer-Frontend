import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', style = {}, ...props }) => (
  <motion.button
    type={type}
    onClick={onClick}
    style={style}
    className="custom-btn"
    whileHover={{ scale: 1.045, boxShadow: '0 0 0 4px #6366f133' }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    {...props}
  >
    {children}
  </motion.button>
);

export default Button; 