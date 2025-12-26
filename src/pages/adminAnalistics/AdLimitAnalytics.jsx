
import React from 'react';
import "./AdLimitAnalytics.css"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, AreaChart, Area
} from 'recharts';
import { 
  Shield, Clock, Filter, Search, Monitor, CheckCircle, Battery, XOctagon,
  Smartphone, Users, Zap, Ban, Lock, AlertCircle
} from 'lucide-react';

const AdLimitAnalytics = () => {
  const hourlyData = [
    { time: '00:00', views: 120 }, { time: '02:00', views: 80 }, { time: '04:00', views: 40 },
    { time: '06:00', views: 150 }, { time: '08:00', views: 450 }, { time: '10:00', views: 890 },
    { time: '12:00', views: 1200 }, { time: '14:00', views: 1450 }, { time: '16:00', views: 1300 },
    { time: '18:00', views: 1800 }, { time: '20:00', views: 2100 }, { time: '22:00', views: 900 },
  ];

  const distributionData = [
    { ads: '0 Ads', users: 15400, color: '#475569' },
    { ads: '1 Ad', users: 8200, color: '#64748b' },
    { ads: '2 Ads', users: 6100, color: '#94a3b8' },
    { ads: '3 Ads', users: 4500, color: '#3b82f6' },
    { ads: '4 Ads', users: 3200, color: '#8b5cf6' },
    { ads: '5 Ads (Max)', users: 4900, color: '#10b981' },
  ];

  const trendData = [
    { day: '1 Oct', percent: 8 }, { day: '5 Oct', percent: 9 }, { day: '10 Oct', percent: 12 },
    { day: '15 Oct', percent: 11 }, { day: '20 Oct', percent: 14 }, { day: '24 Oct', percent: 11.6 },
  ];

  const logs = [
    { time: "14:32:05", event: "Limit Reached - View Blocked", user: "User #103", device: "Android / Samsung S21" },
    { time: "14:31:55", event: "Ad Watched - Success (5/5)", user: "User #103", device: "Android / Samsung S21" },
    { time: "14:30:12", event: "Ad Watched - Success (2/5)", user: "User #192", device: "iOS / iPhone 13" },
    { time: "14:28:45", event: "Cooldown Active - Request Denied", user: "User #881", device: "Android / Pixel 6" },
  ];

  const users = [
    { id: '103', name: 'Alex Johnson', platform: 'Android', adsWatchedToday: 5, blocked: 3, avg: 4.2, segment: 'Heavy Watcher' },
    { id: '192', name: 'Sarah Kim', platform: 'iOS', adsWatchedToday: 2, blocked: 0, avg: 1.8, segment: 'Casual' },
    { id: '881', name: 'Mike Chen', platform: 'Android', adsWatchedToday: 4, blocked: 1, avg: 3.9, segment: 'Heavy Watcher' },
    { id: '445', name: 'Emma Davis', platform: 'Android', adsWatchedToday: 0, blocked: 0, avg: 0.5, segment: 'Inactive' },
    { id: '672', name: 'John Smith', platform: 'iOS', adsWatchedToday: 3, blocked: 0, avg: 2.7, segment: 'Regular' },
  ];

  const dailyCap = 5;

  return (
    <div className="ad-limit-container">
      {/* Header */}
      <div className="header-section">
        <div>
          <h2 className="page-title">
            <Shield className="icon-shield" />
            Daily Ad Limits
          </h2>
          <p className="page-description">Analytics for the 5 ads/day cap per user.</p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary">
            <Clock className="icon-small" /> Today: Oct 24
          </button>
          <button className="btn-secondary">
            <Filter className="icon-small" /> Filters
          </button>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-bg"><Monitor /></div>
          <h3 className="kpi-label">Total Ads Watched</h3>
          <div className="kpi-value">42,592</div>
          <div className="kpi-trend positive">+12% vs yesterday</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-bg success"><CheckCircle /></div>
          <h3 className="kpi-label">Reached Limit ({dailyCap}/{dailyCap})</h3>
          <div className="kpi-value success">4,900</div>
          <div className="kpi-subtitle">11.6% of active users</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-bg info"><Battery /></div>
          <h3 className="kpi-label">Remaining Capacity</h3>
          <div className="kpi-value info">168.4k</div>
          <div className="kpi-subtitle">Potential views left today</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-bg danger"><XOctagon /></div>
          <h3 className="kpi-label">Blocked Attempts</h3>
          <div className="kpi-value danger">1,204</div>
          <div className="kpi-subtitle">Over limit requests</div>
        </div>
      </div>

      {/* KPI Row 2 */}
      <div className="kpi-grid-small">
        <div className="kpi-small">
          <div>
            <div className="kpi-small-label">Avg Ads / User</div>
            <div className="kpi-small-value">2.4</div>
          </div>
          <Smartphone className="icon-medium" />
        </div>
        <div className="kpi-small">
          <div>
            <div className="kpi-small-label">Users Below Limit</div>
            <div className="kpi-small-value">37,600</div>
          </div>
          <Users className="icon-medium" />
        </div>
        <div className="kpi-small">
          <div>
            <div className="kpi-small-label">Heavy Watchers (3-5)</div>
            <div className="kpi-small-value purple">12,600</div>
          </div>
          <Zap className="icon-medium purple" />
        </div>
        <div className="kpi-small">
          <div>
            <div className="kpi-small-label">Low Watchers (0-2)</div>
            <div className="kpi-small-value">23,600</div>
          </div>
          <Battery className="icon-medium" />
        </div>
      </div>

      {/* Charts – aspect bilan */}
      <div className="charts-grid">
        {/* Hourly */}
        <div className="chart-card">
          <h3 className="chart-title">Ads Watched Per Hour</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" aspect={2.8}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">User Distribution</h3>
          <p className="chart-subtitle">Ads watched count per user</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" aspect={2.8}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="ads" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Limit Reach Trend</h3>
              <p className="chart-subtitle">% Users hitting {dailyCap} ads/day</p>
            </div>
            <div className="trend-percent">11.6%</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" aspect={2.8}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="percent" stroke="#10b981" fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Qolgan qismi o‘zgarmagan */}
      <div className="main-grid">
        {/* Table va Sidebar – oldingi kod bilan bir xil */}
        {/* ... (sizning oldingi kodingizdagi table va sidebar qismi) */}
        {/* Men faqat grafik qismini to‘g‘rilagani uchun qolganini qisqartirdim, lekin sizda to‘liq qolsin */}
      </div>
    </div>
  );
};

export default AdLimitAnalytics;