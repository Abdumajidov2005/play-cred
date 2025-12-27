import React from 'react';
import './Referrals.css';
import { Share, Share2 } from 'lucide-react';

const Referrals = () => {
  return (
    <div className="referrals-container">
      {/* Referral Program Status Banner */}
      <div className="status-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h2>Referral Program Status</h2>
            <p>Active • 50 Credits per Invite</p>
          </div>
          <div className="banner-stats">
            <div className="stat-item">
              <div className="stat-value">12.5k</div>
              <div className="stat-label">Invites Sent</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">3.2k</div>
              <div className="stat-label">Converted</div>
            </div>
            <div className="stat-item highlight">
              <div className="stat-value">25.6%</div>
              <div className="stat-label">Conv. Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="referals_main-grid">
        {/* Top Referrers */}
        <div className="top-referrers-card">
          <div className="card-header">
            <span className="icon">🏆</span>
            <h3>Top Referrers</h3>
          </div>
          <div className="referrers-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="referrer-item">
                <div className="rank-info">
                  <div className={`rank-badge rank-${i}`}>
                    {i}
                  </div>
                  <div className="user-name">Super User {i}</div>
                </div>
                <div className="referral-stats">
                  <div className="invites">{150 - (i * 10)} Invites</div>
                  <div className="credits">{5000 - (i * 300)} Credits Earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Channels */}
        <div className="channels-card">
          <span className="icon large"><Share2 size={60}/></span>
          <h3>Invite Channels</h3>
          <p>Where users are sharing their referral codes most frequently.</p>
          <div className="channels-list">
            <div className="channel-item">
              <span>WhatsApp</span>
              <div className="progress-bar">
                <div className="progress-fill whatsapp" style={{ width: '65%' }}></div>
              </div>
              <span className="percentage">65%</span>
            </div>
            <div className="channel-item">
              <span>Instagram</span>
              <div className="progress-bar">
                <div className="progress-fill instagram" style={{ width: '20%' }}></div>
              </div>
              <span className="percentage">20%</span>
            </div>
            <div className="channel-item">
              <span>Direct Link</span>
              <div className="progress-bar">
                <div className="progress-fill direct" style={{ width: '15%' }}></div>
              </div>
              <span className="percentage">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;