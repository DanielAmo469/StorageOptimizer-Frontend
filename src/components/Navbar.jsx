import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Statistics", path: "/landing-page" },
    { name: "Tier Management", path: "/tier" },
    { name: "User Management", path: "/all-users" },
    { name: "System Preferences", path: "/system-preferences" },
  ];

  const navVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  if (!isLoggedIn) return null;

  return (
    <motion.nav
      className="navbar"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="navbar-container">
        <motion.div
          className="navbar-brand"
          onClick={() => navigate("/landing-page")}
          whileHover={{ opacity: 0.8 }}
          whileTap={{ opacity: 0.9 }}
        >
          <img src={require('../assets/logo.png')} alt="Storage Optimizer" className="navbar-logo" />
        </motion.div>

        <div className="navbar-links">
          {navItems.map((item, i) => (
            <motion.div
              key={item.name}
              className="nav-item"
              custom={i}
              variants={itemVariants}
            >
              <motion.button
                className="nav-link"
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="navbar-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="notification-button"
            onClick={() => navigate("/registration-requests")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </motion.button>
          <motion.button
            className="logout-button"
            onClick={handleLogout}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ opacity: 0.8 }}
          >
            Logout
          </motion.button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;