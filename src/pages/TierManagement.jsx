import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/TierManagement.css';
import robotImage from '../assets/Robot1.png';
import robotImage2 from '../assets/Robot2.png';
import robotImage3 from '../assets/Robot3.png';
import robotImage4 from '../assets/Robot4.png';
import FancyActionButton from '../components/FancyActionButton';
// Import Flaticon icons
import pdfIcon from '../assets/icons/pdf.png';
import pngIcon from '../assets/icons/png.png';
import jpgIcon from '../assets/icons/jpg.png';
import txtIcon from '../assets/icons/txt.png';
import jsonIcon from '../assets/icons/json-file.png';

// --- FILE MOVEMENTS COMPONENT ---
const FileMovementsCard = () => {
  const [fileInput, setFileInput] = useState('');
  const [filePaths, setFilePaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const addFilePath = () => {
    if (fileInput.trim() !== '') {
      setFilePaths([...filePaths, fileInput.trim()]);
      setFileInput('');
    }
  };

  const removeFilePath = (index) => {
    setFilePaths(filePaths.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://192.168.16.11:8000/process-file-paths', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filePaths)
      });
      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      console.error(error);
      setApiResult({ status: 'error', reason: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tier-management-card file-movements-card">
      <div className="tier-management-text">
        <h2>File Movements Manager</h2>
        <p>
          The File Movements Manager allows you to seamlessly process and manage file paths for archival and restoration operations. Simply enter the full UNC paths of the files you wish to archive or restore, add them to the list, and execute the process with a single click. This tool interacts directly with the backend API, intelligently determining whether each file should be archived or restored based on its current storage location and metadata. Results are displayed in a clear and structured format, ensuring transparency and traceability for every file action performed.
        </p>
        
        <div className="file-movements-input-group">
          <input
            type="text"
            className="file-movements-input"
            placeholder="Enter file path..."
            value={fileInput}
            onChange={(e) => setFileInput(e.target.value)}
          />
          <button className="file-movements-button" onClick={addFilePath}>Add</button>
        </div>

        <ul className="file-movements-list">
          {filePaths.map((path, index) => (
            <li key={index} className="file-movements-list-item">
              {path}
              <span className="file-movements-remove" onClick={() => removeFilePath(index)}>❌</span>
            </li>
          ))}
        </ul>

        <button className="file-movements-button process-files-btn" onClick={handleSubmit}>
          Process Files
        </button>

        {loading && <div className="file-movements-spinner"></div>}

        {apiResult && (
          <div className="file-movements-result-container">
            {apiResult.restored_files && apiResult.restored_files.length > 0 && (
              <div className="file-movements-result-block restored">
                <h4>Restored Files ({apiResult.restored_files.length})</h4>
                <ul>
                  {apiResult.restored_files.map((file, index) => (
                    <li key={index}>{file}</li>
                  ))}
                </ul>
              </div>
            )}

            {apiResult.skipped_restores && apiResult.skipped_restores.length > 0 && (
              <div className="file-movements-result-block skipped">
                <h4>Skipped Restores ({apiResult.skipped_restores.length})</h4>
                <ul>
                  {apiResult.skipped_restores.map((file, index) => (
                    <li key={index}>{file.path || JSON.stringify(file)}</li>
                  ))}
                </ul>
              </div>
            )}

            {apiResult.archived_files && apiResult.archived_files.length > 0 && (
              <div className="file-movements-result-block archived">
                <h4>Archived Files ({apiResult.archived_files.length})</h4>
                <ul>
                  {apiResult.archived_files.map((file, index) => (
                    <li key={index}>{file}</li>
                  ))}
                </ul>
              </div>
            )}

            {apiResult.skipped_archives && apiResult.skipped_archives.length > 0 && (
              <div className="file-movements-result-block skipped">
                <h4>Skipped Archives ({apiResult.skipped_archives.length})</h4>
                <ul>
                  {apiResult.skipped_archives.map((file, index) => (
                    <li key={index}>{file.path || JSON.stringify(file)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="robot-container">
        <img src={robotImage4} alt="File Movements Illustration" className="robot-image" />
      </div>
    </div>
  );
};

const TierManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // New state variables for filter component
  const [filterVolume, setFilterVolume] = useState('');
  const [selectedDateType, setSelectedDateType] = useState('creation_time');
  const [dateFilters, setDateFilters] = useState([]);
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [blacklistInput, setBlacklistInput] = useState('');
  const [blacklistItems, setBlacklistItems] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [previewResult, setPreviewResult] = useState(null);
  const [showCount, setShowCount] = useState(20);
  const [executeResult, setExecuteResult] = useState(null);
  const [executeExpanded, setExecuteExpanded] = useState(false);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [archiveSelecting, setArchiveSelecting] = useState(false);
  const [restoreSelecting, setRestoreSelecting] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState([]);
  const [selectedRestore, setSelectedRestore] = useState([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  useEffect(() => {
    // Get role from sessionStorage
    const role = sessionStorage.getItem('role');
    setCurrentUserRole(role);
  }, []);

  const handleScanAll = async () => {
    setLoading(true);
    setScanResults(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Authentication token missing');
      }

      // Ensure token is properly formatted
      const formattedToken = token.trim();
      
      const res = await fetch('http://192.168.16.11:8000/manual-scan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formattedToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server response:', res.status, errorData);
        if (res.status === 401) {
          // Token might be expired or invalid
          sessionStorage.removeItem('token'); // Clear invalid token
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Server responded with ${res.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await res.json();
      setScanResults(data.results);
    } catch (err) {
      console.error('Scan error:', err);
      setScanResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScanSingle = async () => {
    if (!selectedVolume) return;
    setLoading(true);
    setScanResults(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Authentication token missing');
      }

      // Ensure token is properly formatted
      const formattedToken = token.trim();

      const res = await fetch(`http://192.168.16.11:8000/manual-scan/${selectedVolume}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formattedToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server response:', res.status, errorData);
        if (res.status === 401) {
          // Token might be expired or invalid
          sessionStorage.removeItem('token'); // Clear invalid token
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Server responded with ${res.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await res.json();
      setScanResults(data.result);
    } catch (err) {
      console.error('Scan error:', err);
      setScanResults([]);
    } finally {
      setLoading(false);
    }
  };

  // New functions for filter component
  const addDateFilter = () => {
    setDateFilters([...dateFilters, { type: selectedDateType, startDate: '', endDate: '' }]);
  };

  const updateDateFilter = (index, field, value) => {
    const newFilters = [...dateFilters];
    newFilters[index][field] = value;
    setDateFilters(newFilters);
  };

  const removeDateFilter = (index) => {
    setDateFilters(dateFilters.filter((_, i) => i !== index));
  };

  const toggleFileType = (type) => {
    setSelectedFileTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const addBlacklistItem = () => {
    if (blacklistInput.trim() && !blacklistItems.includes(blacklistInput.trim())) {
      setBlacklistItems([...blacklistItems, blacklistInput.trim()]);
      setBlacklistInput('');
    }
  };

  const removeBlacklistItem = (index) => {
    setBlacklistItems(blacklistItems.filter((_, i) => i !== index));
  };

  const handleApplyFilters = () => {
    // Implement filter application logic
    console.log('Applying filters:', {
      volume: filterVolume,
      dateFilters,
      sizeRange: { min: minSize, max: maxSize },
      fileTypes: selectedFileTypes,
      blacklist: blacklistItems
    });
  };

  const handleResetFilters = () => {
    setFilterVolume('');
    setDateFilters([]);
    setMinSize('');
    setMaxSize('');
    setSelectedFileTypes([]);
    setBlacklistItems([]);
  };

  const handleShowMore = () => setVisibleCount(visibleCount + 5);
  const handleShowLess = () => setVisibleCount(5);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handlePreview = async () => {
    if (!filterVolume) {
      toast.error("Please select a volume (Data1 or Data2) before previewing.");
      return;
    }
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      // Build date filters object in the correct nested structure
      const dateFilterObj = {};
      dateFilters.forEach(df => {
        dateFilterObj[df.type] = {
          start_date: df.startDate ? `${df.startDate} 00:00:00` : null,
          end_date: df.endDate ? `${df.endDate} 23:59:59` : null
        };
      });

      // Convert KB to bytes
      const minSizeBytes = minSize && !isNaN(parseInt(minSize)) ? parseInt(minSize) * 1024 : null;
      const maxSizeBytes = maxSize && !isNaN(parseInt(maxSize)) ? parseInt(maxSize) * 1024 : null;

      const payload = {
        share_name: filterVolume,
        file_type: selectedFileTypes.map(t => t.replace('.', '')),
        min_size: minSizeBytes,
        max_size: maxSizeBytes,
        date_filters: Object.keys(dateFilterObj).length > 0 ? dateFilterObj : null,
        blacklist: blacklistItems
      };

      console.log('Sending payload:', payload);

      const response = await fetch('http://192.168.16.11:8000/preview-filtered-files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to preview files: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Preview results:', data);
      setPreviewResult(data);
      setExpanded(true);
    } catch (error) {
      console.error('Preview error:', error);
      toast.error("Failed to preview files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!filterVolume) {
      toast.error("Please select a volume (Data1 or Data2) before executing transfer.");
      return;
    }
    setExecuteLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      // Build date filters object in the correct nested structure
      const dateFilterObj = {};
      dateFilters.forEach(df => {
        dateFilterObj[df.type] = {
          start_date: df.startDate ? `${df.startDate} 00:00:00` : null,
          end_date: df.endDate ? `${df.endDate} 23:59:59` : null
        };
      });

      // Convert KB to bytes
      const minSizeBytes = minSize && !isNaN(parseInt(minSize)) ? parseInt(minSize) * 1024 : null;
      const maxSizeBytes = maxSize && !isNaN(parseInt(maxSize)) ? parseInt(maxSize) * 1024 : null;

      const payload = {
        share_name: filterVolume,
        file_type: selectedFileTypes.map(t => t.replace('.', '')),
        min_size: minSizeBytes,
        max_size: maxSizeBytes,
        date_filters: Object.keys(dateFilterObj).length > 0 ? dateFilterObj : null,
        blacklist: blacklistItems
      };

      console.log('Sending payload:', payload);

      const response = await fetch('http://192.168.16.11:8000/execute-filtered-transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to execute transfer: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Transfer results:', data);
      setExecuteResult(data);
      setExecuteExpanded(true);
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error("Failed to execute transfer. Please try again.");
    } finally {
      setExecuteLoading(false);
    }
  };

  const toggleArchiveSelection = () => {
    setArchiveSelecting(!archiveSelecting);
    if (archiveSelecting) {
      setSelectedArchive([]);
    }
  };

  const toggleRestoreSelection = () => {
    setRestoreSelecting(!restoreSelecting);
    if (restoreSelecting) {
      setSelectedRestore([]);
    }
  };

  const toggleArchiveFile = (file) => {
    setSelectedArchive(prev => 
      prev.some(f => f.full_path === file.full_path)
        ? prev.filter(f => f.full_path !== file.full_path)
        : [...prev, file]
    );
  };

  const toggleRestoreFile = (file) => {
    setSelectedRestore(prev => 
      prev.some(f => f.full_path === file.full_path)
        ? prev.filter(f => f.full_path !== file.full_path)
        : [...prev, file]
    );
  };

  const handleArchiveMultiple = async () => {
    if (selectedArchive.length === 0) {
      toast.error("Please select at least one file to archive.");
      return;
    }

    setArchiveLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const filesToSend = selectedArchive.map(file => ({
        full_path: file.full_path,
        creation_time: file.creation_time,
        last_access_time: file.last_access_time,
        last_modified_time: file.last_modified_time,
        file_size: file.file_size
      }));

      const response = await fetch('http://192.168.16.11:8000/archive-multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filesToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`❌ Failed to archive files: ${errorData.detail || JSON.stringify(errorData)}`);
      } else {
        const data = await response.json();
        toast.success(`Successfully archived ${selectedArchive.length} files!`);
        setArchiveSelecting(false);
        setSelectedArchive([]);
      }
    } catch (error) {
      console.error('Archive error:', error);
      toast.error(`❌ Archive failed: ${error.message}`);
    } finally {
      setArchiveLoading(false);
    }
  };

  const handleRestoreMultiple = async () => {
    if (selectedRestore.length === 0) {
      toast.error("Please select at least one file to restore.");
      return;
    }

    setRestoreLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const restoreRequests = selectedRestore.map(file => ({
        archived_path: file.full_path,
        original_path: file.original_path,
        creation_time: file.creation_time,
        last_access_time: file.last_access_time,
        last_modified_time: file.last_modified_time,
        file_size: file.file_size
      }));

      const response = await fetch('http://192.168.16.11:8000/restore-multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(restoreRequests)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to restore files: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      toast.success(`Successfully restored ${selectedRestore.length} files`);
      setRestoreSelecting(false);
      setSelectedRestore([]);
      // Refresh preview results
      handlePreview();
    } catch (error) {
      console.error('Restore error:', error);
      toast.error("Failed to restore selected files. Please try again.");
    } finally {
      setRestoreLoading(false);
    }
  };

  if (currentUserRole === 'viewonly') {
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
    <div className="tier-management-page">
      <div className="tier-management-card">
        <button className="preferences-button" onClick={() => navigate('/system-preferences')}>
          System Preferences
        </button>
        <img src={robotImage} alt="Robot organizing library" className="robot-image" />
        <div className="tier-management-text">
          <h1>Volume Management: Optimize Your Storage Volumes</h1>
          <p>
            This feature empowers you to take full control over your storage infrastructure by performing intelligent volume scans that identify inactive (cold) data for archiving and recently accessed files for restoration. By leveraging a fast and efficient decision-making algorithm based on real-time telemetry, historical usage patterns, and customizable weighting factors, the system ensures that only the most relevant files are relocated. This not only improves performance by freeing up primary storage but also reduces costs associated with high-speed storage tiers. Use this tool to automate smart data placement, enhance responsiveness, and make confident, data-driven decisions about your storage ecosystem.
          </p>
          <div className="scan-actions">
            <div className="scan-action-group">
              <FancyActionButton label="Scan All Volumes" onClick={handleScanAll} />
              <p className="method-desc">
                <b>Scan All Volumes:</b> Evaluates all storage volumes to identify optimization opportunities and data movement needs.
              </p>
            </div>

            <div className="scan-action-group">
              <div className="button-row">
                <div className="volume-selector">
                  <button 
                    className={selectedVolume === 'data1' ? 'selected' : ''} 
                    onClick={() => setSelectedVolume('data1')}
                  >
                    Data1
                  </button>
                  <button 
                    className={selectedVolume === 'data2' ? 'selected' : ''} 
                    onClick={() => setSelectedVolume('data2')}
                  >
                    Data2
                  </button>
                </div>
                <FancyActionButton 
                  label="Scan Selected Volume" 
                  onClick={handleScanSingle} 
                  disabled={!selectedVolume}
                />
              </div>
              <p className="method-desc">
                <b>Scan Single Volume:</b> Analyzes a specific storage volume to identify data that can be moved to optimize performance and costs.
              </p>
            </div>
          </div>

          {loading && (
            <div className="loading-bar">
              <div className="spinner"></div>
              <p>Scanning in progress...</p>
            </div>
          )}

          {scanResults && (
            <div className={`scan-results ${expanded ? 'expanded' : 'collapsed'}`}>
              <button className="toggle-button" onClick={() => setExpanded(!expanded)}>
                {expanded ? '▲ Hide Results' : '▼ Show Results'}
              </button>

              {expanded && (
                <div className="scan-results-content">
                  <div className="result-column">
                    <h3>Scanned Volumes</h3>
                    {scanResults.filter(v => v.should_scan).length === 0 ? (
                      <p>No volumes were scanned.</p>
                    ) : (
                      scanResults.filter(v => v.should_scan).map((v, idx) => (
                        <div className="result-card" key={idx}>
                          <h4>{v.volume}</h4>
                          <p>Score: {v.score}</p>
                          <p>Reason: {v.reason}</p>
                          <p>Archive Success: {v.archive_success}</p>
                          <p>Restore Success: {v.restore_success}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="result-column">
                    <h3>Skipped Volumes</h3>
                    {scanResults.filter(v => !v.should_scan).length === 0 ? (
                      <p>All volumes processed.</p>
                    ) : (
                      scanResults.filter(v => !v.should_scan).map((v, idx) => (
                        <div className="result-card" key={idx}>
                          <h4>{v.volume}</h4>
                          <p>Score: {v.score}</p>
                          <p>Reason: {v.reason}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FileMovementsCard />

      <div className="tier-management-card filter-card" style={{ marginTop: '2rem' }}>
        <div className="robot-container">
          <img src={robotImage2} alt="Robot filtering files" className="robot-image" />
          <img src={robotImage3} alt="Robot overlay" className="robot-overlay" />
        </div>
        <div className="tier-management-text">
          <h2>Smart Filter-Based File Preview & Execution</h2>
          <p>
            This feature allows you to add filters and perform a smart recursive scan over a selected volume and its archive volume. It automatically identifies which files are eligible for archiving or restoration based on the filters and criteria you set. Use "Preview" to view potential actions, or "Execute" to apply the transfer directly with optimized decisions.
          </p>

          <div className="filter-section">
            {/* Volume Selector */}
            <h4 className="filter-header">Select Volume</h4>
            <div className="volume-selector">
              <button 
                className={filterVolume === 'data1' ? 'selected' : ''} 
                onClick={() => setFilterVolume('data1')}
              >
                Data1
              </button>
              <button 
                className={filterVolume === 'data2' ? 'selected' : ''} 
                onClick={() => setFilterVolume('data2')}
              >
                Data2
              </button>
            </div>

            {/* Date Filters */}
            <h4 className="filter-header">Date Filters</h4>
            <div className="date-filters">
              <div className="date-filter-header">
                <select 
                  value={selectedDateType} 
                  onChange={(e) => setSelectedDateType(e.target.value)}
                >
                  <option value="creation_time">Creation Time</option>
                  <option value="last_access_time">Last Access Time</option>
                  <option value="last_modified_time">Last Modified Time</option>
                </select>
                <button onClick={addDateFilter} className="add-filter-btn">Add Filter</button>
              </div>

              {dateFilters.map((filter, index) => (
                <div key={index} className="date-filter-row">
                  <label>
                    Start Date: 
                    <input 
                      type="date" 
                      value={filter.startDate}
                      onChange={(e) => updateDateFilter(index, 'startDate', e.target.value)}
                    />
                  </label>
                  <label>
                    End Date: 
                    <input 
                      type="date" 
                      value={filter.endDate}
                      onChange={(e) => updateDateFilter(index, 'endDate', e.target.value)}
                    />
                  </label>
                  <button 
                    onClick={() => removeDateFilter(index)}
                    className="remove-filter-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Size Filters */}
            <h4 className="filter-header">Size Filters</h4>
            <div className="size-filters">
              <label>
                Min Size (KB): 
                <input 
                  type="number" 
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                />
              </label>
              <label>
                Max Size (KB): 
                <input 
                  type="number" 
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                />
              </label>
            </div>

            {/* File Type Selector */}
            <h4 className="filter-header">File Type Filters</h4>
            <div className="file-types">
              {[
                { type: 'pdf', icon: pdfIcon },
                { type: 'png', icon: pngIcon },
                { type: 'jpg', icon: jpgIcon },
                { type: 'txt', icon: txtIcon },
                { type: 'json', icon: jsonIcon }
              ].map(({ type, icon }) => (
                <div
                  key={type}
                  className={`file-type-icon ${selectedFileTypes.includes(`.${type}`) ? 'selected' : ''}`}
                  onClick={() => toggleFileType(`.${type}`)}
                >
                  <img src={icon} alt={type.toUpperCase()} />
                </div>
              ))}
            </div>

            {/* Blacklist Input */}
            <h4 className="filter-header">Blacklist Patterns</h4>
            <div className="blacklist-section">
              <div className="blacklist-input">
                <input 
                  type="text" 
                  value={blacklistInput}
                  onChange={(e) => setBlacklistInput(e.target.value)}
                  placeholder="Add blacklist items"
                />
                <button onClick={addBlacklistItem}>Add</button>
              </div>
              <div className="blacklist-tags">
                {blacklistItems.map((item, index) => (
                  <div key={index} className="blacklist-tag">
                    <span>{item}</span>
                    <button onClick={() => removeBlacklistItem(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="filter-actions">
              <button className="apply-btn" onClick={handleApplyFilters}>Apply Filters</button>
              <button className="reset-btn" onClick={handleResetFilters}>Reset</button>
            </div>
          </div>

          {/* Preview and Execute Buttons */}
          <div className="preview-execute-buttons">
            <div className="button-with-desc">
              <button className="preview-btn" onClick={handlePreview}>Analyze Filters</button>
              <p className="button-desc">
                <b>Analyze Filters:</b> Simulates the scan without moving files.
              </p>
            </div>
            <div className="button-with-desc">
              <button className="execute-btn" onClick={handleExecute}>Apply Transfer</button>
              <p className="button-desc">
                <b>Apply Transfer:</b> Executes the archiving/restoration based on filters.
              </p>
            </div>
          </div>

          {/* Loading Indicators */}
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Analyzing files...</p>
            </div>
          )}

          {executeLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Applying transfer...</p>
            </div>
          )}

          {/* Preview Results */}
          {previewResult && (
            <div className={`result-container ${expanded ? 'expanded' : ''}`}>
              <div className="result-section">
                <div className="result-header">
                  <h4>📦 Archive Candidates ({previewResult.archive_candidates_count})</h4>
                  <button onClick={toggleArchiveSelection} className="select-toggle-btn">
                    {archiveSelecting ? 'Cancel Select' : 'Select Files'}
                  </button>
                </div>
                {previewResult.archive_candidates.length > 0 ? (
                  <ul>
                    {previewResult.archive_candidates.slice(0, showCount).map((file, index) => (
                      <li key={index}>
                        <div className="file-row">
                          {archiveSelecting && (
                            <input
                              type="checkbox"
                              className="file-checkbox"
                              checked={selectedArchive.some(f => f.full_path === file.full_path)}
                              onChange={() => toggleArchiveFile(file)}
                            />
                          )}
                          <span className="file-path">{file.full_path}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No archive candidates found.</p>
                )}
                {archiveSelecting && selectedArchive.length > 0 && (
                  <button 
                    onClick={handleArchiveMultiple} 
                    className="action-btn"
                    disabled={archiveLoading}
                  >
                    {archiveLoading ? (
                      <>
                        <div className="spinner"></div>
                        Moving Files...
                      </>
                    ) : (
                      `Move Selected to Archive (${selectedArchive.length})`
                    )}
                  </button>
                )}
                {previewResult.archive_candidates.length > showCount && (
                  <button onClick={() => setShowCount(prev => prev + 20)} className="load-more-btn">
                    Show More
                  </button>
                )}
              </div>

              <div className="result-section">
                <div className="result-header">
                  <h4>♻️ Restore Candidates ({previewResult.restore_candidates_count})</h4>
                  <button onClick={toggleRestoreSelection} className="select-toggle-btn">
                    {restoreSelecting ? 'Cancel Select' : 'Select Files'}
                  </button>
                </div>
                {previewResult.restore_candidates.length > 0 ? (
                  <ul>
                    {previewResult.restore_candidates.map((file, index) => (
                      <li key={index}>
                        <div className="file-row">
                          {restoreSelecting && (
                            <input
                              type="checkbox"
                              className="file-checkbox"
                              checked={selectedRestore.some(f => f.full_path === file.full_path)}
                              onChange={() => toggleRestoreFile(file)}
                            />
                          )}
                          <span className="file-path">{file.full_path}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No restore candidates found.</p>
                )}
                {restoreSelecting && selectedRestore.length > 0 && (
                  <button 
                    onClick={handleRestoreMultiple} 
                    className="action-btn"
                    disabled={restoreLoading}
                  >
                    {restoreLoading ? (
                      <>
                        <div className="spinner"></div>
                        Restoring Files...
                      </>
                    ) : (
                      `Restore Selected Files (${selectedRestore.length})`
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Execute Results */}
          {executeResult && (
            <div className={`execute-container ${executeExpanded ? 'expanded' : ''}`}>
              <div className="execute-section">
                <h4>📦 Archive Summary</h4>
                <p>Success: {executeResult.archive_summary.success_count}</p>
                <p>Failed: {executeResult.archive_summary.failed_count}</p>

                {executeResult.archive_summary.failed_count > 0 && (
                  <>
                    <h5>❌ Failed Files:</h5>
                    <ul>
                      {executeResult.archive_summary.failures.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="execute-section">
                <h4>♻️ Restore Summary</h4>
                <p>Restored: {executeResult.restore_summary.restored_count}</p>
                <p>Skipped: {executeResult.restore_summary.skipped_count}</p>

                {executeResult.restore_summary.skipped_count > 0 && (
                  <>
                    <h5>🚫 Skipped Files:</h5>
                    <ul>
                      {executeResult.restore_summary.skipped.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TierManagement; 