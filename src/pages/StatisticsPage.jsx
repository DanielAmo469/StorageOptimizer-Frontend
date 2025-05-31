import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Label
} from "recharts";
import '../styles/StatisticsPage.css';

const StatisticsPage = () => {
  const [fileStats, setFileStats] = useState(null);
  const [volumeStats, setVolumeStats] = useState(null);
  const [scanStats, setScanStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const filesRes = await axios.get("http://192.168.16.11:8000/stats/files?filter=all_time");
      const volumesRes = await axios.get("http://192.168.16.11:8000/stats/volumes?filter=all_time");
      const scansRes = await axios.get("http://192.168.16.11:8000/stats/scans?filter=all_time");
      setFileStats(filesRes.data);
      setVolumeStats(volumesRes.data);
      setScanStats(scansRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ["#3B82F6", "#6B7280"]; // blue, grey

  if (loading) return <div className="loading-message">Loading statistics...</div>;
  if (!fileStats || !volumeStats || !scanStats) return <div className="error-message">Error loading statistics.</div>;

  return (
    <div className="statistics-page-container">
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

          {/* Archive Size Growth */}
          <div className="chart-card chart-wide">
            <div className="chart-header">
              <h3 className="chart-title">Archive Size Growth</h3>
              <div className="chart-metrics">
                <div>
                  <span className="metric-value">{(fileStats.total_archive_size / 1e9).toFixed(2)} GB</span>
                  <span className="metric-label">Total Size</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={fileStats.monthly_trends}>
                  <defs>
                    <linearGradient id="colorArchive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="archive_size" stroke={COLORS[0]} fillOpacity={1} fill="url(#colorArchive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This area chart illustrates cumulative archive growth over time. Monitoring archive size trends enables data managers to forecast storage needs, assess the pace of data offloading, and ensure archive resources scale appropriately.
            </p>
          </div>

          {/* File Size Comparison */}
          <div className="chart-card chart-wide">
            <div className="chart-header">
              <h3 className="chart-title">Average File Size Comparison</h3>
              <div className="chart-metrics">
                <div>
                  <span className="metric-value">{(fileStats.avg_archive_file_size / 1e6).toFixed(2)} MB</span>
                  <span className="metric-label">Avg Archived</span>
                </div>
                <div>
                  <span className="metric-value">{(fileStats.avg_restore_file_size / 1e6).toFixed(2)} MB</span>
                  <span className="metric-label">Avg Restored</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: "Archived", value: fileStats.avg_archive_file_size },
                  { name: "Restored", value: fileStats.avg_restore_file_size }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[0]}>
                    <Label position="top" fill={COLORS[0]} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This bar chart compares typical file sizes between archived and restored files. Such comparison informs optimization of archiving policies, threshold tuning, and understanding of user retrieval patterns across data sizes.
            </p>
          </div>

          {/* File Age Distribution */}
          <div className="chart-card chart-half">
            <h3 className="chart-title">File Age Distribution</h3>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={fileStats.age_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This chart shows how old files were at the time of archiving, grouped into monthly age ranges. It reveals whether archiving policies prioritize older data or also capture relatively newer files. This insight supports refining archiving rules to align with data lifecycle goals.
            </p>
          </div>
        </div>
      </div>

      {/* Restore Cluster */}
      <div className="chart-cluster">
        <h2 className="cluster-header">Restore Performance</h2>
        <div className="chart-grid">
          <div className="chart-card chart-half">
            <div className="chart-header">
              <h3 className="chart-title">Restore Success vs Failure</h3>
              <div className="chart-metrics">
                <div>
                  <span className="metric-value">{fileStats.restore_success_count}</span>
                  <span className="metric-label">Success</span>
                </div>
                <div>
                  <span className="metric-value">{fileStats.restore_failure_count}</span>
                  <span className="metric-label">Failure</span>
                </div>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={[
                      { name: "Success", value: fileStats.restore_success_count },
                      { name: "Failure", value: fileStats.restore_failure_count }
                    ]}
                    cx="50%" cy="50%" outerRadius={80}
                    fill={COLORS[0]}
                    dataKey="value"
                    label
                  >
                    {["Success", "Failure"].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This pie chart summarizes the success rate of restore operations. High success rates indicate reliable data retrieval, while any failure rates may signal issues requiring operational attention, such as missing files or permission problems.
            </p>
          </div>
        </div>
      </div>

      {/* Scan Cluster */}
      <div className="chart-cluster">
        <h2 className="cluster-header">Scan Analytics</h2>
        <div className="chart-grid">
          <div className="chart-card chart-half">
            <h3 className="chart-title">Scan Activity Summary</h3>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: "Manual", value: scanStats.manual_scans },
                  { name: "System", value: scanStats.system_scans }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This chart compares the number of manual versus automated scans triggering archiving processes. It reflects how much intervention is user-driven versus system-scheduled, helping assess automation coverage and reliance on manual triggers.
            </p>
          </div>

          <div className="chart-card chart-half">
            <h3 className="chart-title">Scan Decisions by Mode</h3>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={Object.entries(volumeStats.mode_counts).map(([key, value]) => ({ name: key, value }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This chart shows how frequently each scan mode (eco, default, super) was used when evaluating volumes. Understanding mode usage helps validate policy adoption and balance between conservative and aggressive scanning approaches.
            </p>
          </div>

          <div className="chart-card chart-half">
            <h3 className="chart-title">Average Scan Score by Mode</h3>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={Object.entries(volumeStats.mode_scores).map(([key, value]) => ({ name: key, value }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-description">
              This chart shows the average scan evaluation score per mode. It indicates how 'cold' or 'active' volumes were assessed in each policy mode, supporting analysis of decision patterns and archival aggressiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
