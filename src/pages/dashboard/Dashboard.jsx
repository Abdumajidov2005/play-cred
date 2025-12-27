import React from "react";
import { Users, Tv2, CreditCard, DollarSign, MapPin } from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import "./Dashboard.css";
import StatCard from "../../components/stateCard/StatCard";

const dataUserGrowth = [
  { name: "Mon", active: 4000, new: 2400 },
  { name: "Tue", active: 3000, new: 1398 },
  { name: "Wed", active: 2000, new: 9800 },
  { name: "Thu", active: 2780, new: 3908 },
  { name: "Fri", active: 1890, new: 4800 },
  { name: "Sat", active: 2390, new: 3800 },
  { name: "Sun", active: 3490, new: 4300 },
];

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6"];

// MOCK data
const mockUsers = [
  {
    phoneVerified: true,
    emailVerified: true,
    adsWatched: 5,
    creditsEarned: 100,
  },
  {
    phoneVerified: false,
    emailVerified: true,
    adsWatched: 3,
    creditsEarned: 50,
  },
  {
    phoneVerified: true,
    emailVerified: true,
    adsWatched: 10,
    creditsEarned: 200,
  },
];

const mockSubscriptions = [
  { status: "Active", plan: "Monthly", totalPaid: 200 },
  { status: "Active", plan: "Yearly", totalPaid: 2000 },
];

const mockCampaigns = [{ revenue: 500 }, { revenue: 1200 }];

const mockBookings = [{ price: 100 }, { price: 250 }];

const mockFields = [{ occupancy: 80 }, { occupancy: 60 }];

const Dashboard = () => {
  // Dynamic Calculations
  const totalUsers = mockUsers.length;
  const verifiedUsers = mockUsers.filter(
    (u) => u.phoneVerified && u.emailVerified
  ).length;
  const totalAdsWatched = mockUsers.reduce((acc, u) => acc + u.adsWatched, 0);
  const totalRevenue =
    mockCampaigns.reduce((acc, c) => acc + c.revenue, 0) +
    mockSubscriptions.reduce((acc, s) => acc + s.totalPaid, 0);

  // MRR Calc
  const monthlyRevenue =
    mockSubscriptions.filter(
      (s) => s.status === "Active" && s.plan === "Monthly"
    ).length * 200;
  const yearlyRevenueAmortized =
    (mockSubscriptions.filter(
      (s) => s.status === "Active" && s.plan === "Yearly"
    ).length *
      2000) /
    12;
  const mrr = monthlyRevenue + yearlyRevenueAmortized;

  const revenueData = [
    {
      name: "Ads",
      value: mockCampaigns.reduce((acc, c) => acc + c.revenue, 0),
    },
    {
      name: "Bookings",
      value: mockBookings.reduce((acc, b) => acc + b.price, 0) * 0.2,
    },
    {
      name: "Subs",
      value: mockSubscriptions.reduce((acc, s) => acc + s.totalPaid, 0),
    },
  ];

  return (
    <div className="dashboard">
      {/* KPI Grid */}
      <div className="kpi-grid">
        <StatCard
          title="Total Users"
          value={totalUsers}
          trend={12.5}
          icon={<Users size={48} />}
        />
        <StatCard
          title="Verified Users"
          value={verifiedUsers}
          trend={5.2}
          icon={<Users size={48} />}
        />
        <StatCard
          title="MRR"
          value={`AED ${Math.round(mrr)}`}
          trend={8.1}
          icon={<CreditCard size={48} />}
        />
        <StatCard
          title="Ads Watched"
          value={totalAdsWatched}
          trend={-2.4}
          icon={<Tv2 size={48} />}
        />
      </div>

      <div className="dashboard_charts-grid">
        {/* User Growth Chart */}
        <div className="dashboard_chart-card">
          <div className="dash_title">
            <h3>User Growth & Activity</h3>
            <div className="dashboard_legend">
              <span className="dashboard_active">
                <div></div>Active Users
              </span>
              <span className="dashboard_new">
                <div></div>New Users
              </span>
            </div>
          </div>
          <div className="dashboard_chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={dataUserGrowth}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f8fafc",
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorActive)"
                />
                <Area
                  type="monotone"
                  dataKey="new"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorNew)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="dashboard_chart-card">
          <h3>Revenue Breakdown</h3>
          <div className="dashboard_chart-container pie">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="dashboard_pie-center">
              <span>AED {(totalRevenue / 1000).toFixed(1)}k</span>
              <small>Total</small>
            </div>
          </div>
          <div className="dashboard_pie-legend">
            {revenueData.map((item, index) => (
              <div key={item.name}>
                <div className="dashboard_pie-legend_titile">
                  <span style={{ backgroundColor: COLORS[index] }}></span>
                  <span>{item.name}</span>
                </div>
                <strong>AED {(item.value / 1000).toFixed(1)}k</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row 2 */}
      <div className="kpi-grid">
        <div className="stat-card">
          <div>
            <small>Credits Issued</small>
            <h2>{mockUsers.reduce((a, u) => a + u.creditsEarned, 0)}</h2>
          </div>
          <DollarSign className="icon" />
        </div>
        <div className="stat-card">
          <div>
            <small>Field Occupancy</small>
            <h2>
              {Math.round(
                mockFields.reduce((a, f) => a + f.occupancy, 0) /
                  mockFields.length
              )}
              %
            </h2>
          </div>
          <MapPin className="icon" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
