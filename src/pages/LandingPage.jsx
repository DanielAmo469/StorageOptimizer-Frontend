import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LandingPage.css';
import homeFirst from '../assets/home-fisrt.png';
import homeSecond from '../assets/home-second.png';
import homeThird from '../assets/home-third.png';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const COLORS = ['#FF9800', '#4CAF50']; // Orange for archived, Green for restored

const LandingPage = () => {
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [visibleMovements, setVisibleMovements] = useState(3);
  const [visibleDecisions, setVisibleDecisions] = useState(1);
  const [visibleScans, setVisibleScans] = useState(1);
  const [fileStats, setFileStats] = useState({});

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const [scansRes, movementsRes, decisionsRes] = await Promise.all([
          axios.get('http://192.168.16.11:8000/stats/recent-scans'),
          axios.get('http://192.168.16.11:8000/stats/recent-movements'),
          axios.get('http://192.168.16.11:8000/stats/recent-decisions')
        ]);

        setRecentScans(scansRes.data);
        setRecentMovements(movementsRes.data);
        setRecentDecisions(decisionsRes.data);
      } catch (error) {
        console.error('Failed to fetch recent data:', error);
      }
    };

    fetchRecentData();
  }, []);

  useEffect(() => {
    const fetchFileStats = async () => {
      try {
        const res = await axios.get('http://192.168.16.11:8000/stats/files?filter=all_time');
        setFileStats(res.data);
      } catch (error) {
        console.error('Failed to fetch file stats:', error);
      }
    };

    fetchFileStats();
  }, []);

  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatValue = (value) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      if (value > 1e9) return `${(value / 1e9).toFixed(2)} GB`;
      if (value > 1e6) return `${(value / 1e6).toFixed(2)} MB`;
      if (value > 1e3) return `${(value / 1e3).toFixed(2)} KB`;
      return value.toString();
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .map(([k, v]) => `${formatKey(k)}: ${formatValue(v)}`)
        .join(' | ');
    }
    if (typeof value === 'string' && value.includes('T')) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return value?.toString() || 'N/A';
  };

  const renderScanData = (scan) => {
    const { id, ...scanData } = scan;
    return (
      <div className="data-section">
        <div className="data-row">
          <div className="label">Share Name:</div>
          <div className="value">{formatValue(scanData.share_name)}</div>
        </div>
        <div className="data-row">
          <div className="label">Timestamp:</div>
          <div className="value">{formatValue(scanData.timestamp)}</div>
        </div>
        <div className="data-row">
          <div className="label">Triggered By User:</div>
          <div className="value">{scanData.triggered_by_user ? 'Yes' : 'No'}</div>
        </div>
        <div className="data-row">
          <div className="label">Files Scanned:</div>
          <div className="value">{formatValue(scanData.files_scanned)}</div>
        </div>
        <div className="data-row">
          <div className="label">Files Archived:</div>
          <div className="value">{formatValue(scanData.files_archived)}</div>
        </div>
        <div className="data-row">
          <div className="label">Files Restored:</div>
          <div className="value">{formatValue(scanData.files_restored)}</div>
        </div>

        {scanData.filters_used && (
          <>
            <div className="section-header">Filters Used</div>
            <div className="data-section">
              {Object.entries(scanData.filters_used)
                .filter(([key, val]) => val != null)
                .map(([key, val]) => {
                  // Special handling for date values
                  if (key.includes('time') || key.includes('date')) {
                    return (
                      <div className="data-row" key={key}>
                        <div className="label">{formatKey(key)}:</div>
                        <div className="value">{formatValue(val)}</div>
                      </div>
                    );
                  }
                  return (
                    <div className="data-row" key={key}>
                      <div className="label">{formatKey(key)}:</div>
                      <div className="value">{formatValue(val)}</div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderMovementData = (movement) => {
    const { id, ...movementData } = movement;
    return (
      <div className="data-section">
        <div className="data-row">
          <div className="label">File Path:</div>
          <div className="value">{formatValue(movementData.full_path)}</div>
        </div>
        <div className="data-row">
          <div className="label">Operation:</div>
          <div className="value">{formatValue(movementData.action_type)}</div>
        </div>
        <div className="data-row">
          <div className="label">Destination Path:</div>
          <div className="value">{formatValue(movementData.destination_path)}</div>
        </div>
        <div className="data-row">
          <div className="label">File Size:</div>
          <div className="value">{formatValue(movementData.file_size)}</div>
        </div>
        <div className="data-row">
          <div className="label">Timestamp:</div>
          <div className="value">{formatValue(movementData.timestamp)}</div>
        </div>
      </div>
    );
  };

  const renderDecisionData = (decision) => {
    const { id, ...decisionData } = decision;
    return (
      <div className="data-section">
        <div className="data-row">
          <div className="label">Share Name:</div>
          <div className="value">{formatValue(decisionData.share_name)}</div>
        </div>
        <div className="data-row">
          <div className="label">Volume Name:</div>
          <div className="value">{formatValue(decisionData.volume_name)}</div>
        </div>
        <div className="data-row">
          <div className="label">Timestamp:</div>
          <div className="value">{formatValue(decisionData.timestamp)}</div>
        </div>
        <div className="data-row">
          <div className="label">Mode:</div>
          <div className="value">{formatValue(decisionData.mode)}</div>
        </div>
        <div className="data-row">
          <div className="label">Should Scan:</div>
          <div className="value">{decisionData.should_scan ? 'Yes' : 'No'}</div>
        </div>
        <div className="data-row">
          <div className="label">Scan Score:</div>
          <div className="value">{formatValue(decisionData.scan_score)}</div>
        </div>
        <div className="data-row">
          <div className="label">Reason:</div>
          <div className="value">{formatValue(decisionData.reason)}</div>
        </div>

        {decisionData.raw_scores && (
          <>
            <div className="section-header">Raw Scores</div>
            <div className="data-section">
              {Object.entries(decisionData.raw_scores).map(([key, value]) => (
                <div className="data-row" key={key}>
                  <div className="label">{formatKey(key)}:</div>
                  <div className="value">{formatValue(value)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {decisionData.weighted_scores && (
          <>
            <div className="section-header">Weighted Scores</div>
            <div className="data-section">
              {Object.entries(decisionData.weighted_scores).map(([key, value]) => (
                <div className="data-row" key={key}>
                  <div className="label">{formatKey(key)}:</div>
                  <div className="value">{formatValue(value)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="landing-container">
      <h2 className="home-title">The intelligent storage optimization platform</h2>
      <p className="home-subtitle">
        Maximize efficiency, improve performance, and reduce costs with automated file management.
      </p>
      <div className="home-cards">
        <div className="home-card blue-card">
          <h3 className="card-title">Automated Storage Optimization</h3>
          <p className="card-text">
            Automatically analyze and archive cold or inactive files across all volumes. Reduce SSD and primary storage costs by moving rarely accessed data to archive disks, while keeping it easily retrievable.
          </p>
          <img src={homeFirst} alt="Optimization" className="card-image" />
        </div>
        <div className="home-card cyan-card">
          <h3 className="card-title">Smart Insights & Reporting</h3>
          <p className="card-text">
            Gain real-time insights into your storage environment. Track volume usage, file access patterns, and archiving performance with intuitive dashboards, helping you make informed decisions.
          </p>
          <img src={homeSecond} alt="Insights" className="card-image" />
        </div>
        <div className="home-card purple-card">
          <h3 className="card-title">Seamless Integration & Control</h3>
          <p className="card-text">
            Easily integrate with existing systems and manage everything through a centralized web interface. Schedule scans, apply filters, and trigger archive or restore operations with just a few clicks.
          </p>
          <img src={homeThird} alt="Integration" className="card-image" />
        </div>
      </div>

      {/* Archive Cluster */}
      <div className="chart-cluster">
        <h2 className="cluster-header">Archive Overview</h2>
        <div className="chart-grid">
          {/* Main Volume Chart */}
          <div className="chart-card chart-full">
            <div className="chart-header">
              <h3 className="chart-title">Archive + Restore Volume Over Time</h3>
              <div className="chart-metrics">
                <div>
                  <span className="metric-value">{fileStats.total_archived_files}</span>
                  <span className="metric-label">Total Archived</span>
                </div>
                <div>
                  <span className="metric-value">{fileStats.total_restored_files}</span>
                  <span className="metric-label">Total Restored</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fileStats.monthly_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="archived_count" stroke={COLORS[0]} />
                  <Line type="monotone" dataKey="restored_count" stroke={COLORS[1]} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This chart visualizes month-by-month trends of archiving and restoring activity. Tracking changes in volume over time reveals operational patterns, workload fluctuations, and potential seasonal spikes. It supports proactive planning for storage capacity and archiving cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <div className="recent-activity-left">
          {/* Recent Scans Card */}
          <div className="recent-card">
            <h3 className="recent-card-title">Recent Scans</h3>
            <div className="recent-card-content">
              {recentScans
                .slice(0, visibleScans)
                .map((scan, index) => (
                  <div key={index} className="data-item">
                    <div className="section-header">Scan #{index + 1}</div>
                    {renderScanData(scan)}
                  </div>
                ))}
            </div>
            {recentScans.length > 1 && (
              <div 
                className="show-more-link"
                onClick={() => setVisibleScans(prev => 
                  prev === 1 ? recentScans.length : 1
                )}
              >
                {visibleScans === 1 ? 'Show More' : 'Show Less'}
              </div>
            )}
          </div>

          {/* Recent Decisions Card */}
          <div className="recent-card">
            <h3 className="recent-card-title">Recent Decisions</h3>
            <div className="recent-card-content">
              {recentDecisions
                .slice(0, visibleDecisions)
                .map((decision, index) => (
                  <div key={index} className="data-item">
                    <div className="section-header">Decision #{index + 1}</div>
                    {renderDecisionData(decision)}
                  </div>
                ))}
            </div>
            {recentDecisions.length > 1 && (
              <div 
                className="show-more-link"
                onClick={() => setVisibleDecisions(prev => 
                  prev === 1 ? recentDecisions.length : 1
                )}
              >
                {visibleDecisions === 1 ? 'Show More' : 'Show Less'}
              </div>
            )}
          </div>
        </div>

        {/* Recent Movements Card */}
        <div className="recent-activity-right">
          <div className="recent-card">
            <h3 className="recent-card-title">Recent File Movements</h3>
            <div className="recent-card-content">
              {recentMovements
                .slice(0, visibleMovements)
                .map((movement, index) => (
                  <div key={index} className="data-item movement-item">
                    {renderMovementData(movement)}
                  </div>
                ))}
            </div>
            {recentMovements.length > 3 && (
              <div 
                className="show-more-link"
                onClick={() => setVisibleMovements(prev => 
                  prev === 3 ? recentMovements.length : 3
                )}
              >
                {visibleMovements === 3 ? 'Show More' : 'Show Less'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
