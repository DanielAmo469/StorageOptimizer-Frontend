import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../styles/SystemPreferences.css';
import loadUserData from '../App'


const SystemPreferences = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [editStates, setEditStates] = useState({});
  const [newBlacklistItem, setNewBlacklistItem] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [showModeConfirm, setShowModeConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [isEditing, setIsEditing] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(null);

  const modeDescriptions = {
    default: "Balanced mode with standard scan frequency and performance. Suitable for general use where efficiency and resource use are balanced.",
    eco: "Energy-saving mode that reduces scan frequency to minimize system load and power consumption. Best for systems with limited resources or downtime.",
    super: "High-performance mode with aggressive scanning and archiving. Use when maximum cleanup and speed are required, but it may increase system load."
  };

    loadUserData();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to access this page');
      navigate('/login');
      return;
    }

    // Get role from sessionStorage first
    const role = sessionStorage.getItem('userRole') || sessionStorage.getItem('role');
    
    if (!role) {
      // If no role is found, fetch user info from /me endpoint
      fetchUserInfo();
    } else {
      setCurrentUserRole(role);
      fetchSettings();
    }
  }, [navigate]);

  const fetchUserInfo = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://192.168.16.11:8000/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.role) {
        const role = response.data.role;
        sessionStorage.setItem('userRole', role);
        setCurrentUserRole(role);
        fetchSettings();
      } else {
        toast.error('Unable to determine user role');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      toast.error('Error fetching user info');
      navigate('/login');
    }
  };

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('token');
      const res = await axios.get('http://192.168.16.11:8000/admin/get-settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(res.data.settings);
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (update) => {
    try {
      // Create a copy of the update object
      const cleanUpdate = { ...update };

      // Remove empty mode values
      if (cleanUpdate.mode && cleanUpdate.mode.trim() === '') {
        delete cleanUpdate.mode;
      }

      // Validate the update object
      if (Object.keys(cleanUpdate).length === 0) {
        toast.error('No valid changes to save');
        return;
      }

      const token = sessionStorage.getItem('token');
      await axios.post('http://192.168.16.11:8000/admin/update-settings', cleanUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Settings updated');
      fetchSettings();
    } catch (err) {
      console.error('Error updating settings:', err);
      toast.error('Failed to update settings');
    }
  };

  const handleModeChange = (mode) => {
    if (!mode || mode.trim() === '') {
      toast.error('Invalid mode selected');
      return;
    }
    updateSettings({ mode });
    setShowModeConfirm(false);
  };

  const handleEditMode = () => {
    setIsEditing(true);
    setOriginalSettings(JSON.parse(JSON.stringify(settings)));
  };

  const handleRevertChanges = () => {
    setSettings(JSON.parse(JSON.stringify(originalSettings)));
    setIsEditing(false);
    setEditStates({});
  };

  const handleSaveChanges = () => {
    setShowModeConfirm(true);
    setConfirmAction(() => () => {
      updateSettings(settings);
      setIsEditing(false);
      setEditStates({});
    });
  };

  
  if (isLoading || !settings) {
    return <div className="system-preferences-container"><div className="loading-spinner">Loading...</div></div>;
  }

  return (
    <motion.div className="system-preferences-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ToastContainer />
      <h1 className="page-title">System Preferences</h1>

      {currentUserRole === 'manager' && (
        <div className="edit-mode-controls">
          {!isEditing ? (
            <button className="edit" onClick={handleEditMode}>Edit</button>
          ) : (
            <>
              <button className="revert" onClick={handleRevertChanges}>Revert Changes</button>
              <button className="save" onClick={handleSaveChanges}>Save Changes</button>
            </>
          )}
        </div>
      )}

      <div className="preferences-grid">
        {/* Hours Between Scans Section */}
        <section className="preference-section hours-section">
          <h2>Hours Between Scans</h2>
          {editStates.min_hours_between_scans ? (
            <div className="hours-edit">
              <input
                type="number"
                value={settings.min_hours_between_scans}
                onChange={(e) => setSettings({ ...settings, min_hours_between_scans: Number(e.target.value) })}
                min="1"
                max="168"
              />
              <div className="hours-buttons">
                <button className="save" onClick={() => {
                  setShowModeConfirm(true);
                  setConfirmAction(() => () => {
                    updateSettings({ min_hours_between_scans: settings.min_hours_between_scans });
                    setEditStates({ ...editStates, min_hours_between_scans: false });
                  });
                }}>Save</button>
                <button className="cancel" onClick={() => {
                  setSettings(prev => ({ ...prev, min_hours_between_scans: prev.min_hours_between_scans }));
                  setEditStates({ ...editStates, min_hours_between_scans: false });
                }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="hours-content">
              <div className="hours-display">
                <span className="hours-value">{settings.min_hours_between_scans}</span>
                <span className="hours-label">hours</span>
              </div>
              {currentUserRole === 'manager' && (
                <button className="edit" onClick={() => setEditStates({ ...editStates, min_hours_between_scans: true })}>
                  Edit
                </button>
              )}
            </div>
          )}
        </section>

        {/* Blacklist Section */}
        <section className="preference-section">
          <h2>Blacklist</h2>
          {currentUserRole === 'manager' && (
            <div className="blacklist-controls">
              <div className="blacklist-input-group">
                <input
                  type="text"
                  className="text-input"
                  value={newBlacklistItem}
                  onChange={(e) => setNewBlacklistItem(e.target.value)}
                  placeholder="Enter item to blacklist"
                />
                <button className="primary" onClick={() => {
                  if (newBlacklistItem.trim()) {
                    setSettings(prev => ({
                      ...prev,
                      blacklist: [...prev.blacklist, newBlacklistItem]
                    }));
                    setNewBlacklistItem('');
                  }
                }}>Add</button>
                <button className="secondary" onClick={() => setNewBlacklistItem('')}>Clear</button>
              </div>
            </div>
          )}
          <div className="blacklist-items">
            {settings.blacklist.map((item, idx) => (
              <div key={idx} className="blacklist-item">
                <span>{item}</span>
                {currentUserRole === 'manager' && (
                  <button className="danger remove-button" onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      blacklist: prev.blacklist.filter(i => i !== item)
                    }));
                  }}>×</button>
                )}
              </div>
            ))}
          </div>
          {currentUserRole === 'manager' && settings.blacklist.length > 0 && (
            <div className="blacklist-buttons">
              <button className="cancel" onClick={() => fetchSettings()}>Cancel</button>
              <button className="save" onClick={() => {
                setShowModeConfirm(true);
                setConfirmAction(() => () => updateSettings({ blacklist: settings.blacklist }));
              }}>Save Changes</button>
            </div>
          )}
        </section>

        {/* Mode Section */}
        <section className="preference-section mode-section">
          <h2>Current Mode</h2>
          <div className="mode-display">
            <span>Current Mode: {settings.mode}</span>
            {currentUserRole === 'manager' && (
              <select
                className="mode-select"
                value={settings.mode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setSelectedMode(value);
                    setConfirmAction(() => () => handleModeChange(value));
                    setShowModeConfirm(true);
                  }
                }}
              >
                {Object.keys(settings.modes).map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            )}
          </div>
          <div className="mode-description">
            <p>{modeDescriptions[settings.mode]}</p>
          </div>
        </section>

        {/* Settings Section */}
        <section className="preference-section settings-section">
          <h2>Mode Settings</h2>
          <div className="settings-grid">
            {['thresholds', 'weights'].map((section) => (
              <div key={section} className="setting-group">
                <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
                {Object.entries(settings.modes[settings.mode][section]).length > 0 ? (
                  Object.entries(settings.modes[settings.mode][section]).map(([key, value]) => (
                    <div key={key} className="setting-item">
                      <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      {currentUserRole === 'manager' ? (
                        <input
                          type="number"
                          className="setting-input"
                          value={value}
                          onChange={(e) => {
                            const updatedModes = { ...settings.modes };
                            updatedModes[settings.mode][section][key] = parseFloat(e.target.value);
                            setSettings({ ...settings, modes: updatedModes });
                          }}
                          min="0"
                          max="1"
                          step="0.1"
                        />
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="setting-item">
                    <p>No {section} available for this mode.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {currentUserRole === 'manager' && (
            <div className="button-group">
              <button className="save" onClick={() => {
                setShowModeConfirm(true);
                setConfirmAction(() => () => updateSettings({ modes: settings.modes }));
              }}>Save Settings</button>
              <button className="cancel" onClick={() => fetchSettings()}>Cancel</button>
            </div>
          )}
        </section>
      </div>

      {/* Confirmation Modal */}
      {showModeConfirm && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
            <h3>Confirm Changes</h3>
            <p>Are you sure you want to save these changes?</p>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setShowModeConfirm(false)}>Cancel</button>
              <button className="primary" onClick={() => {
                confirmAction();
                setShowModeConfirm(false);
              }}>Confirm</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SystemPreferences;
