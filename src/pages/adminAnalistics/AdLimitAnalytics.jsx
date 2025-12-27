import React, { useState, useEffect } from "react";
import "./AdLimitAnalytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Shield,
  Clock,
  Filter,
  Search,
  Monitor,
  CheckCircle,
  Battery,
  XOctagon,
  Smartphone,
  Users,
  Zap,
  TrendingUp,
  Ban,
  Edit2,
  Save,
  X,
  Lock,
  AlertCircle,
} from "lucide-react";
import { FiCheckCircle, FiMonitor, FiXOctagon } from "react-icons/fi";
import { IoBatteryDeadOutline } from "react-icons/io5";

const AdLimitAnalytics = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState("");

  // Mock admin role — real appda contextdan olinadi
  const currentAdminRole = "Super Admin"; // "Founder & CEO", "Super Admin" yoki boshqa
  const canEditRules = ["Founder & CEO", "Super Admin"].includes(
    currentAdminRole
  );

  // Limit qoidalari
  const [limitRules, setLimitRules] = useState({
    dailyCap: 5,
    rewardPerAd: 1,
    cooldown: 0,
    resetTime: "00:00",
  });

  // Real-time countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const [h, m] = limitRules.resetTime.split(":").map(Number);
      let target = new Date(now);
      target.setHours(h, m, 0, 0);

      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [limitRules.resetTime]);

  // Mock data
  const hourlyData = [
    { time: "00:00", views: 120 },
    { time: "02:00", views: 80 },
    { time: "04:00", views: 40 },
    { time: "06:00", views: 150 },
    { time: "08:00", views: 450 },
    { time: "10:00", views: 890 },
    { time: "12:00", views: 1200 },
    { time: "14:00", views: 1450 },
    { time: "16:00", views: 1300 },
    { time: "18:00", views: 1800 },
    { time: "20:00", views: 2100 },
    { time: "22:00", views: 900 },
  ];

  const distributionData = [
    { ads: "0 Ads", users: 15400, color: "#475569" },
    { ads: "1 Ad", users: 8200, color: "#64748b" },
    { ads: "2 Ads", users: 6100, color: "#94a3b8" },
    { ads: "3 Ads", users: 4500, color: "#3b82f6" },
    { ads: "4 Ads", users: 3200, color: "#8b5cf6" },
    { ads: "5 Ads (Max)", users: 4900, color: "#10b981" },
  ];

  const trendData = [
    { day: "1 Oct", percent: 8 },
    { day: "5 Oct", percent: 9 },
    { day: "10 Oct", percent: 12 },
    { day: "15 Oct", percent: 11 },
    { day: "20 Oct", percent: 14 },
    { day: "24 Oct", percent: 11.6 },
  ];

  const logs = [
    {
      time: "14:32:05",
      event: "Limit Reached - View Blocked",
      user: "User #103",
      device: "Android / Samsung S21",
    },
    {
      time: "14:31:55",
      event: "Ad Watched - Success (5/5)",
      user: "User #103",
      device: "Android / Samsung S21",
    },
    {
      time: "14:30:12",
      event: "Ad Watched - Success (2/5)",
      user: "User #192",
      device: "iOS / iPhone 13",
    },
    {
      time: "14:28:45",
      event: "Cooldown Active - Request Denied",
      user: "User #881",
      device: "Android / Pixel 6",
    },
  ];

  const users = [
    {
      id: "103",
      name: "Alex Johnson",
      platform: "Android",
      adsWatchedToday: 5,
      blocked: 3,
      avg: 4.2,
      segment: "Heavy Watcher",
    },
    {
      id: "192",
      name: "Sarah Kim",
      platform: "iOS",
      adsWatchedToday: 2,
      blocked: 0,
      avg: 1.8,
      segment: "Casual",
    },
    {
      id: "881",
      name: "Mike Chen",
      platform: "Android",
      adsWatchedToday: 4,
      blocked: 1,
      avg: 3.9,
      segment: "Heavy Watcher",
    },
    {
      id: "445",
      name: "Emma Davis",
      platform: "Android",
      adsWatchedToday: 0,
      blocked: 0,
      avg: 0.5,
      segment: "Inactive",
    },
    {
      id: "672",
      name: "John Smith",
      platform: "iOS",
      adsWatchedToday: 3,
      blocked: 0,
      avg: 2.7,
      segment: "Regular",
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Real ilovada API chaqiriladi
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="ad-limit-container">
      {/* Header */}
      <div className="header-section">
        <div>
          <h2 className="page-title">
            <Shield className="icon-shield" />
            Daily Ad Limits
          </h2>
          <p className="page-description">
            Analytics for the {limitRules.dailyCap} ads/day cap per user.
          </p>
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

      {/* KPI Row 1 - Yangi dizayn */}
      <div className="limits_kpi-grid">
        <div className="limits_kpi-card">
          <div className="limits_kpi-icon-bg">
            <FiMonitor />
          </div>
          <h3 className="limits_kpi-label">Total Ads Watched</h3>
          <div className="limits_kpi-value">42,592</div>
          <div className="limits_kpi-trend positive">
            <TrendingUp className="limits_icon-inline" /> +12% vs yesterday
          </div>
        </div>
        <div className="limits_kpi-card">
          <div className="limits_kpi-icon-bg success">
            <FiCheckCircle />
          </div>
          <h3 className="limits_kpi-label">
            Reached Limit ({limitRules.dailyCap}/{limitRules.dailyCap})
          </h3>
          <div className="limits_kpi-value success">4,900</div>
          <div className="limits_kpi-subtitle">11.6% of active users</div>
        </div>
        <div className="limits_kpi-card">
          <div className="limits_kpi-icon-bg info">
            <IoBatteryDeadOutline />
          </div>
          <h3 className="limits_kpi-label">Remaining Capacity</h3>
          <div className="limits_kpi-value info">168.4k</div>
          <div className="limits_kpi-subtitle">Potential views left today</div>
        </div>
        <div className="limits_kpi-card">
          <div className="limits_kpi-icon-bg danger">
            <FiXOctagon />
          </div>
          <h3 className="limits_kpi-label">Blocked Attempts</h3>
          <div className="limits_kpi-value danger">1,204</div>
          <div className="limits_kpi-subtitle">Over limit requests</div>
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
            <div className="kpi-small-label">
              Heavy Watchers (3-{limitRules.dailyCap})
            </div>
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

      {/* Charts */}
      <div className="limits_charts-grid">
        <div className="limits_chart-card">
          <h3 className="limits_chart-title">Ads Watched Per Hour</h3>
          <div className="limits_chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={hourlyData}
                margin={{ top: 10, right: 20, left: -10, bottom: -10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f8fafc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="limits_chart-card">
          <h3 className="limits_chart-title">User Distribution</h3>
          <p className="limits_chart-subtitle">Ads watched count per user</p>
          <div className="limits_chart-container">
            <ResponsiveContainer width="100%" height={225}>
              <BarChart
                data={distributionData}
                margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="ads"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="limits_chart-card">
          <div className="limits_chart-header">
            <div>
              <h3 className="limits_chart-title">Limit Reach Trend</h3>
              <p className="limits_chart-subtitle">
                % Users hitting {limitRules.dailyCap} ads/day
              </p>
            </div>
            <div className="limits_trend-percent">11.6%</div>
          </div>
          <div className="limits_chart-container">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f8fafc",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percent"
                  stroke="#10b981"
                  fill="url(#colorTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid: Table + Sidebar */}
      <div className="main-grid">
        {/* User Table */}
        <div className="table-section">
          <div className="table-controls">
            <div className="limits_search-box">
              <Search className="search-icon" />
              <input type="text" placeholder="Search user ID or name..." />
            </div>
            <select className="filter-select">
              <option>All Segments</option>
              <option>Heavy Watchers</option>
              <option>Limit Reachers</option>
            </select>
          </div>

          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Platform</th>
                  <th className="text-center">Ads Today</th>
                  <th className="text-center">Remaining</th>
                  <th className="text-center">Blocked</th>
                  <th className="text-right">Avg (7d)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={
                      selectedUser?.id === user.id ? "selected-row" : ""
                    }
                  >
                    <td>
                      <div className="user-name">{user.name}</div>
                      <div className="user-id">
                        ID: #{user.id} • {user.segment}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`platform-dot ${user.platform.toLowerCase()}`}
                      ></span>
                      {user.platform}
                    </td>
                    <td className="text-center">
                      <div className="ad-bars">
                        {[...Array(limitRules.dailyCap)].map((_, i) => (
                          <div
                            key={i}
                            className={`bar ${
                              i < user.adsWatchedToday ? "filled" : ""
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div
                        className={`ad-count ${
                          user.adsWatchedToday >= limitRules.dailyCap
                            ? "max"
                            : ""
                        }`}
                      >
                        {user.adsWatchedToday} / {limitRules.dailyCap}
                      </div>
                    </td>
                    <td className="text-center remaining">
                      {Math.max(0, limitRules.dailyCap - user.adsWatchedToday)}
                    </td>
                    <td className="text-center">
                      {user.blocked > 0 ? (
                        <span className="blocked-count">
                          {user.blocked} <Ban size={14} />
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="text-right avg">{user.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Limit Status */}
          <div className="sidebar-card">
            <h3>Ad Limit Status</h3>
            <div className="status-item">
              <div>
                <span className="dot reached"></span> Reached Limit
              </div>
              <strong>11.6%</strong>
            </div>
            <div className="status-item">
              <div>
                <span className="dot below"></span> Below Limit
              </div>
              <strong>88.4%</strong>
            </div>
            <div className="progress-bar">
              <div className="fill" style={{ width: "11.6%" }}></div>
            </div>
          </div>

          {/* Live Logs */}
          <div className="sidebar-card logs">
            <div className="logs-header">
              <h3>Live Activity Log</h3>
              <div className="pulse-dot"></div>
            </div>
            <div className="logs-list">
              {logs.map((log, i) => (
                <div key={i} className="log-entry">
                  <span className="log-time">{log.time}</span>
                  <div>
                    <div
                      className={`log-event ${
                        log.event.includes("Blocked")
                          ? "blocked"
                          : log.event.includes("Cooldown")
                          ? "cooldown"
                          : "success"
                      }`}
                    >
                      {log.event}
                    </div>
                    <div className="log-detail">
                      {log.user} • {log.device}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="sidebar-card settings">
            <div className="settings-header">
              <h3 className="settings-header_title">Limit Rules</h3>
              {canEditRules ? (
                isEditing ? (
                  <div className="edit-buttons">
                    <button onClick={handleSave} className="btn-save">
                      <Save size={14} /> Save
                    </button>
                    <button onClick={handleCancel} className="btn-cancel">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-edit"
                  >
                    <Edit2 size={14} /> Edit limites rule
                  </button>
                )
              ) : (
                <span className="view-only">
                  <Lock size={14} /> View Only
                </span>
              )}
            </div>

            <div className="rule-item">
              <span>Daily Cap</span>
              {isEditing ? (
                <input
                  type="number"
                  value={limitRules.dailyCap}
                  onChange={(e) =>
                    setLimitRules({ ...limitRules, dailyCap: +e.target.value })
                  }
                />
              ) : (
                <strong>{limitRules.dailyCap} Ads / User</strong>
              )}
            </div>
            <div className="rule-item">
              <span>Reward</span>
              {isEditing ? (
                <input
                  type="number"
                  value={limitRules.rewardPerAd}
                  onChange={(e) =>
                    setLimitRules({
                      ...limitRules,
                      rewardPerAd: +e.target.value,
                    })
                  }
                />
              ) : (
                <strong>{limitRules.rewardPerAd} Credit / Ad</strong>
              )}
            </div>
            <div className="rule-item">
              <span>Cooldown</span>
              {isEditing ? (
                <input
                  type="number"
                  value={limitRules.cooldown}
                  onChange={(e) =>
                    setLimitRules({ ...limitRules, cooldown: +e.target.value })
                  }
                />
              ) : (
                <strong>
                  {limitRules.cooldown > 0
                    ? `${limitRules.cooldown} Mins`
                    : "None"}
                </strong>
              )}
            </div>
            <div className="rule-item reset-time">
              <span>Reset Time</span>
              <div className="reset-info">
                {isEditing ? (
                  <input
                    type="time"
                    value={limitRules.resetTime}
                    onChange={(e) =>
                      setLimitRules({
                        ...limitRules,
                        resetTime: e.target.value,
                      })
                    }
                  />
                ) : (
                  <>
                    <strong>{limitRules.resetTime}</strong>
                    <small>Resets in: {timeUntilReset}</small>
                  </>
                )}
                <span>local time</span>
              </div>
            </div>
          </div>

          {/* Alert */}
          <div className="sidebar-card alert">
            <h3>
              <AlertCircle size={16} /> Active Alerts
            </h3>
            <div className="alert-item">
              <strong>Spike Detected:</strong> 120 users hit limit in last 10
              mins.
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-user-info">
                <div className="avatar">{selectedUser.name[0]}</div>
                <div>
                  <h3>{selectedUser.name}</h3>
                  <p>
                    ID: #{selectedUser.id} • {selectedUser.platform}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)}>Close</button>
            </div>
            {/* Modal content qisqartirilgan, kerak bo'lsa to'liq qo'shsa bo'ladi */}
            <div className="modal-body">
              <p>User details modal content...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdLimitAnalytics;
