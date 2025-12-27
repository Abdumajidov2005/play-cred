import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./AdsRevenue.css"; // CSS faylni import qilyapmiz

// Namuna ma'lumotlar (backend o'rniga)
const campaigns = [
  {
    id: 1,
    name: "Summer Sale Campaign",
    type: "Rewarded Video",
    impressions: 125000,
    revenue: 4500,
    cpm: 36,
    status: "Active",
    thumbnail: "",
  },
  {
    id: 2,
    name: "App Launch Banner",
    type: "Banner Ad",
    impressions: 89000,
    revenue: 2200,
    cpm: 24.7,
    status: "Active",
    thumbnail: "",
  },
  {
    id: 3,
    name: "New Year Splash",
    type: "Splash Screen",
    impressions: 56000,
    revenue: 3100,
    cpm: 55.4,
    status: "Active",
    thumbnail: "",
  },
  {
    id: 4,
    name: "Holiday Rewards",
    type: "Rewarded Video",
    impressions: 98000,
    revenue: 3800,
    cpm: 38.8,
    status: "Paused",
    thumbnail: "",
  },
  {
    id: 5,
    name: "Weekend Promo",
    type: "Banner Ad",
    impressions: 67000,
    revenue: 1800,
    cpm: 26.9,
    status: "Active",
    thumbnail: "",
  },
];

const AdsRevenue = () => {
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const avgCPM =
    campaigns.length > 0
      ? campaigns.reduce((acc, c) => acc + c.cpm, 0) / campaigns.length
      : 0;

  const chartData = [...campaigns]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((c) => ({
      name: c.name.length > 20 ? c.name.substring(0, 20) + "..." : c.name,
      revenue: c.revenue,
    }));

  const revenueByType = [
    {
      name: "Rewarded",
      value: campaigns
        .filter((c) => c.type === "Rewarded Video")
        .reduce((acc, c) => acc + c.revenue, 0),
      color: "#8b5cf6",
    },
    {
      name: "Banner",
      value: campaigns
        .filter((c) => c.type === "Banner Ad")
        .reduce((acc, c) => acc + c.revenue, 0),
      color: "#3b82f6",
    },
    {
      name: "Splash",
      value: campaigns
        .filter((c) => c.type === "Splash Screen")
        .reduce((acc, c) => acc + c.revenue, 0),
      color: "#fbbf24",
    },
  ].filter((i) => i.value > 0);

  return (
    <div className="ads-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Impressions</div>
          <div className="stat-value">
            {(totalImpressions / 1000).toFixed(1)}k
          </div>
          <div className="stat-trend up">↑ 5.4% from last period</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Avg eCPM</div>
          <div className="stat-value">AED {avgCPM.toFixed(2)}</div>
          <div className="stat-trend up">↑ 1.2% from last period</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value green">
            AED {totalRevenue.toLocaleString()}
          </div>
          <div className="stat-trend up">↑ 8.4% from last period</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Revenue Breakdown</h3>
          <p className="chart-subtitle">Distribution by Ad Format</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => `AED ${value.toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Top Campaigns by Revenue</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                  }}
                  formatter={(value) => `AED ${value.toLocaleString()}`}
                />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[0, 8, 8, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="campaigns-card">
        <h3 className="chart-title">Active Campaigns List</h3>
        <div className="campaigns-list">
          {campaigns.filter((c) => c.status === "Active").length === 0 ? (
            <div className="no-campaigns">No active campaigns.</div>
          ) : (
            campaigns
              .filter((c) => c.status === "Active")
              .map((camp) => (
                <div key={camp.id} className="campaign-item">
                  <div className="campaign-info">
                    <div className="campaign-thumbnail"></div>
                    <div>
                      <div className="campaign-name">{camp.name}</div>
                      <div className="campaign-details">
                        {camp.type === "Rewarded Video"
                          ? "Video"
                          : camp.type === "Splash Screen"
                          ? "Splash"
                          : "Banner"}{" "}
                        • CPM AED {camp.cpm}
                      </div>
                    </div>
                  </div>
                  <div className="campaign-stats">
                    <div className="campaign-revenue">
                      AED {camp.revenue.toLocaleString()}
                    </div>
                    <div className="campaign-views">
                      {camp.impressions.toLocaleString()} views
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsRevenue;
