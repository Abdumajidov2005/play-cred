import React, { useState } from 'react';
import './Reports.css';
import { Calendar, Check, Download, File, FileText } from 'lucide-react';

const Reports = () => {
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded] = useState(null);

  const reports = [
    { id: 1, title: 'Users Report', desc: 'Full list of users with demographics and activity stats.' },
    { id: 2, title: 'Financial Report', desc: 'Revenue breakdown from Ads, Commissions, and Sponsorships.' },
    { id: 3, title: 'Bookings Log', desc: 'Detailed log of all confirmed and cancelled bookings.' },
    { id: 4, title: 'Ad Performance', desc: 'Campaign level performance, impressions and click rates.' },
  ];

  const handleDownload = (id) => {
    setDownloading(id);
    setDownloaded(null);

    // Simulate download
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(id);

      setTimeout(() => setDownloaded(null), 3000);
    }, 2000);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h2>Reports & Export</h2>
          <p>Download operational and financial data.</p>
        </div>
      </div>

      <div className="reports-grid">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="card-icon"><FileText size={30}/></div>
            <div className="format-badge">CSV / PDF</div>

            <h3>{report.title}</h3>
            <p>{report.desc}</p>

            <div className="date-range">
              <span><Calendar/></span>
              <span>Last 30 Days</span>
            </div>

            <button
              onClick={() => handleDownload(report.id)}
              disabled={downloading === report.id}
              className={`download-btn ${
                downloaded === report.id ? 'success' :
                downloading === report.id ? 'loading' : ''
              }`}
            >
              {downloaded === report.id ? (
                <>
                  <span><Check/></span>
                  <span>Downloaded</span>
                </>
              ) : downloading === report.id ? (
                <>
                  <span className="spinner">⟳</span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span><Download/></span>
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;