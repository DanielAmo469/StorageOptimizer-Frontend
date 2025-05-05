import React from 'react';
import '../styles/LandingPage.css';
import homeFirst from '../assets/home-fisrt.png';
import homeSecond from '../assets/home-second.png';
import homeThird from '../assets/home-third.png';

const LandingPage = () => {
  return (
    <div className="home-container">
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
    </div>
  );
};

export default LandingPage;
