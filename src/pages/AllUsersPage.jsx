import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AllUsersPage.css';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState(Number(sessionStorage.getItem('user_id')));
  const [currentUserRole, setCurrentUserRole] = useState(sessionStorage.getItem('role'));
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const apiBase = 'http://192.168.16.11:8000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${apiBase}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Date not available'
      : date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
  };

  const handlePromoteUser = async (username) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${apiBase}/promote_user/${username}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => 
        user.username === username ? { ...user, role: 'manager' } : user
      ));
      toast.success(`User '${username}' promoted to manager`);
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user');
    }
    setShowPromoteModal(false);
  };

  const handleRemoveUser = async (username) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${apiBase}/remove_viewonly/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.username !== username));
      toast.success(`User '${username}' removed`);
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    }
    setShowRemoveModal(false);
  };

  const handleDowngradeUser = async (username) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${apiBase}/downgrade_user/${username}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => 
        user.username === username ? { ...user, role: 'viewonly' } : user
      ));
      toast.success(`User '${username}' downgraded to viewonly`);
    } catch (error) {
      console.error('Error downgrading user:', error);
      toast.error('Failed to downgrade user');
    }
    setShowDowngradeModal(false);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="modal-actions">
            <motion.button className="modal-button cancel" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Cancel
            </motion.button>
            <motion.button className="modal-button confirm" onClick={onConfirm} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Confirm
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div className="all-users-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ToastContainer />
      <h1 className="page-title">All Users</h1>
      <div className="search-container">
        <input type="text" placeholder="Search by username or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
      </div>

      <div className="users-list">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div 
              key={user.username} 
              className={`user-row ${user.role === 'manager' ? 'manager' : 'viewonly'} ${user.user_id === currentUserId ? 'current-user' : ''}`} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ delay: index * 0.1 }}
            >
              <div className="user-info">
                <div className="user-header">
                  <span className="user-date">{formatDate(user.date_created)}</span>
                </div>
                <div className="user-details">
                  <h3 className={`username ${user.role === 'manager' ? 'manager' : ''}`}>
                    {user.username} ({user.role})
                    {user.user_id === currentUserId && <span className="current-user-indicator">(You)</span>}
                  </h3>
                  <p className={`user-email ${user.role === 'manager' ? 'manager' : ''}`}>{user.email}</p>
                </div>
              </div>

              {currentUserRole === 'manager' && user.user_id !== currentUserId && (
                <div className="user-actions">
                  {user.role === 'viewonly' ? (
                    <>
                      <motion.button 
                        className="action-button promote" 
                        onClick={() => { setSelectedUser(user); setShowPromoteModal(true); }} 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        Promote User
                      </motion.button>
                      <motion.button 
                        className="action-button remove" 
                        onClick={() => { setSelectedUser(user); setShowRemoveModal(true); }} 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove User
                      </motion.button>
                    </>
                  ) : (
                    <motion.button 
                      className="action-button downgrade" 
                      onClick={() => { setSelectedUser(user); setShowDowngradeModal(true); }} 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      Downgrade Permissions
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {currentUserRole === 'manager' && (
        <>
          <ConfirmationModal isOpen={showPromoteModal} onClose={() => setShowPromoteModal(false)} onConfirm={() => handlePromoteUser(selectedUser?.username)} title="Promote User" message={`Are you sure you want to promote ${selectedUser?.username} to manager?`} />
          <ConfirmationModal isOpen={showRemoveModal} onClose={() => setShowRemoveModal(false)} onConfirm={() => handleRemoveUser(selectedUser?.username)} title="Remove User" message={`Are you sure you want to remove ${selectedUser?.username}?`} />
          <ConfirmationModal isOpen={showDowngradeModal} onClose={() => setShowDowngradeModal(false)} onConfirm={() => handleDowngradeUser(selectedUser?.username)} title="Downgrade User" message={`Are you sure you want to downgrade ${selectedUser?.username} to viewonly?`} />
        </>
      )}
    </motion.div>
  );
};

export default AllUsersPage;
