import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './components/LandingPage';
import RegisterRequests from './components/RegistrationRequests';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> 
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing-page" element={<PrivateRoute isLoggedIn={isLoggedIn}><LandingPage /></PrivateRoute>} />
        <Route path="/registration-requests" element={<PrivateRoute isLoggedIn={isLoggedIn}><RegisterRequests /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/landing-page" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;