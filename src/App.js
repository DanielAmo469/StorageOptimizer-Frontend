import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './routes/PrivateRoute';
import LandingPage from './pages/LandingPage';
import RegisterRequests from './components/RegistrationRequests';
import AllUsersPage from './pages/AllUsersPage';
import SystemPreferences from './pages/SystemPreferences';
import Navbar from './components/Navbar';
import { PageWrapper } from './components/PageWrapper';
import TierManagement from './pages/TierManagement';
import StatisticsPage from './pages/StatisticsPage';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Fetch current user and store user_id
      axios.get('http://192.168.16.11:8000/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        sessionStorage.setItem('user_id', res.data.user_id);
        sessionStorage.setItem('username', res.data.username);
        sessionStorage.setItem('email', res.data.email);
        sessionStorage.setItem('role', res.data.role);
      })
      .catch(err => {
        console.error('Failed to fetch user info:', err);
        sessionStorage.clear();
      });
    }
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    sessionStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={
            <PageWrapper>
              <Login onLogin={handleLogin} />
            </PageWrapper>
          } />
          <Route path="/register" element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          } />
          <Route path="/landing-page" element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/registration-requests" element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PageWrapper>
                <RegisterRequests />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/all-users" element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PageWrapper>
                <AllUsersPage />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/system-preferences" element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PageWrapper>
                <SystemPreferences />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/tier" element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PageWrapper>
                <TierManagement />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/statistics" element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PageWrapper>
                <StatisticsPage />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/landing-page" : "/login"} />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
