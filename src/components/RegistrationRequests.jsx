import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/RegistrationRequests.css';

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://192.168.16.11:8000/registration-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
        setIsAdmin(true);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setIsAdmin(false);
        } else {
          console.error('Error fetching registration requests:', error);
          toast.error('Error fetching registration requests');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const handleApprove = async (pending_user_id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `http://192.168.16.11:8000/registration-requests/${pending_user_id}/approve-registration/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(requests.filter(request => request.user_id !== pending_user_id));
      toast.success('Registration request approved successfully');
      console.log('Approve response:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error approving registration request:', error.response.data);
        toast.error(`Error approving registration request`);
      }
    }
  };

  const handleDeny = async (pending_user_id) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete(
        `http://192.168.16.11:8000/registration-requests/${pending_user_id}/deny-registration/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(requests.filter(request => request.user_id !== pending_user_id));
      toast.success('Registration request denied successfully');
      console.log('Deny response:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error denying registration request:', error.response.data);
        toast.error(`Error denying registration request: ${error.response.data.detail}`);
      } else {
        console.error('Error denying registration request:', error.message);
        toast.error('Error denying registration request');
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="registration-requests-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-message">Loading...</div>
      </motion.div>
    );
  }

  if (!isAdmin) {
    return (
      <motion.div 
        className="unauthorized-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Access Denied</h2>
        <p>You do not have permission to access this feature. Please contact your administrator for access.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="registration-requests-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <h1 className="page-title">Registration Requests</h1>
      
      {requests.length === 0 ? (
        <p className="no-requests">No registration requests</p>
      ) : (
        <div className="requests-grid">
          {requests.map((request, index) => (
            <motion.div
              key={request.user_id}
              className="request-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="request-header">
                <h3>{request.username}</h3>
                <span className="request-date">{formatDate(request.date_created)}</span>
              </div>
              
              <div className="request-content">
                <p className="request-email">{request.email}</p>
                <p className="request-description">
                  {request.registration_request_description || 'No description provided'}
                </p>
              </div>
              
              <div className="request-actions">
                <motion.button
                  className="approve-button"
                  onClick={() => handleApprove(request.user_id)}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(79, 70, 229, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Approve
                </motion.button>
                
                <motion.button
                  className="deny-button"
                  onClick={() => handleDeny(request.user_id)}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Deny
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RegistrationRequests;