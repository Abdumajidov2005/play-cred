import React, { useState } from "react";
import {
  Users,
  Activity,
  DollarSign,
  Lock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import "./Subscriptions.css";
import StatCard from "../../components/stateCard/StatCard";

const Subscriptions = () => {
  // Mock Data
  const subscriptions = [
    {
      id: 1,
      userName: "Alice",
      plan: "Monthly",
      status: "Active",
      startDate: "2025-01-01",
      nextRenewal: "2025-02-01",
      totalPaid: 100,
    },
    {
      id: 2,
      userName: "Bob",
      plan: "Yearly",
      status: "Active",
      startDate: "2025-01-10",
      nextRenewal: "2026-01-10",
      totalPaid: 1000,
    },
    {
      id: 3,
      userName: "Charlie",
      plan: "Monthly",
      status: "Inactive",
      startDate: "2025-01-05",
      nextRenewal: "2025-02-05",
      totalPaid: 50,
    },
  ];

  const currentAdmin = { role: "Super Admin" }; // Misol

  // Narxlarni state bilan boshqarish (eng muhim tuzatish)
  const [subscriptionPricing, setSubscriptionPricing] = useState({
    monthly: 100,
    yearly: 1000,
  });

  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [tempPricing, setTempPricing] = useState({ ...subscriptionPricing });

  const canManagePricing = ["Founder & CEO", "Super Admin"].includes(
    currentAdmin.role
  );

  // Hisob-kitoblar
  const activeMonthly = subscriptions.filter(
    (s) => s.status === "Active" && s.plan === "Monthly"
  ).length;

  const activeYearly = subscriptions.filter(
    (s) => s.status === "Active" && s.plan === "Yearly"
  ).length;

  const totalRevenue = subscriptions.reduce((acc, s) => acc + s.totalPaid, 0);

  const mrr =
    activeMonthly * subscriptionPricing.monthly +
    (activeYearly * subscriptionPricing.yearly) / 12;

  const arr = mrr * 12;

  const planDistData = [
    { name: "Monthly", value: activeMonthly, color: "#3b82f6" },
    { name: "Yearly", value: activeYearly, color: "#8b5cf6" },
  ];

  // Pricing edit funksiyalari
  const handleSavePricing = () => {
    setSubscriptionPricing({ ...tempPricing });
    setIsEditingPricing(false);
  };

  const handleCancelPricingEdit = () => {
    setTempPricing({ ...subscriptionPricing });
    setIsEditingPricing(false);
  };

  const startEditing = () => {
    setTempPricing({ ...subscriptionPricing });
    setIsEditingPricing(true);
  };

  const renderOverview = () => (
    <div className="overview">
      <div className="kpis">
        <StatCard
          title="Active Monthly"
          value={activeMonthly.toString()}
          trend={8.5}
          icon={<Users size={48} />}
        />
        <StatCard
          title="Active Yearly"
          value={activeYearly.toString()}
          trend={12.2}
          icon={<Users size={48} />}
        />
        <StatCard
          title="MRR"
          value={`AED ${Math.round(mrr)}`}
          trend={15.4}
          icon={<Activity size={48} />}
        />
        <StatCard
          title="Total Revenue"
          value={`AED ${totalRevenue}`}
          trend={5.2}
          icon={<DollarSign size={48} />}
        />
      </div>

      <div className="subscriptions_charts">
        <div className="subscriptions_chart revenue">
          <h3>Revenue Growth (ARR)</h3>
          <div className="subscriptions_chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={[
                  { name: "Jan", val: 20000 },
                  { name: "Feb", val: 25000 },
                  { name: "Mar", val: 40000 },
                ]}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#8b5cf6"
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="subscriptions_chart plan-dist">
          <h3>Plan Distribution</h3>
          <div className="subscriptions_chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="subscriptions_legend">
            <span className="monthly"></span> Monthly
            <span className="yearly"></span> Yearly
          </div>
        </div>
      </div>

      <div className="subscriptions_pricing">
        <div className="subscriptions_pricing-header">
          <h3>Current Pricing</h3>
          {canManagePricing ? (
            isEditingPricing ? (
              <div className="subscriptions_pricing-buttons">
                <button onClick={handleSavePricing} className="subscriptions_save-btn">
                  Save
                </button>
                <button onClick={handleCancelPricingEdit} className="subscriptions_cancel-btn">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={startEditing} className="subscriptions_edit-btn">
                Edit Pricing
              </button>
            )
          ) : (
            <div className="subscriptions_lock-view">
              <Lock size={16} /> View Only
            </div>
          )}
        </div>

        <div className="subscriptions_pricing-cards">
          <div className={`subscriptions_card ${isEditingPricing ? "editing" : ""}`}>
            <div className="subscriptions_card-title">
              <div>Monthly Plan</div>
              <div>Billed every 30 days</div>
            </div>
            {isEditingPricing ? (
              <input
                type="number"
                min="0"
                value={tempPricing.monthly}
                onChange={(e) =>
                  setTempPricing({
                    ...tempPricing,
                    monthly: parseInt(e.target.value) || 0,
                  })
                }
              />
            ) : (
              <div className="subscriptions_price">{subscriptionPricing.monthly} AED</div>
            )}
          </div>

          <div className={`subscriptions_card ${isEditingPricing ? "editing" : ""}`}>
            {!isEditingPricing && (
              <div className="subscriptions_save-tag">
                SAVE
                {Math.max(
                  0,
                  subscriptionPricing.monthly * 12 - subscriptionPricing.yearly
                )}{" "}
                AED
              </div>
            )}
            <div className="subscriptions_card-title">
              <div>Yearly Plan</div>
              <div>Billed every 365 days</div>
            </div>
            {isEditingPricing ? (
              <input
                type="number"
                min="0"
                value={tempPricing.yearly}
                onChange={(e) =>
                  setTempPricing({
                    ...tempPricing,
                    yearly: parseInt(e.target.value) || 0,
                  })
                }
              />
            ) : (
              <div className="subscriptions_price">{subscriptionPricing.yearly} AED</div>
            )}
          </div>
        </div>

        {isEditingPricing && (
          <div className="subscriptions_pricing-note">
            Note: Changing pricing affects future billing cycles only.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="subscriptions">
      <div className="subscriptions_header">
        <h2>Subscriptions</h2>
        <div className="tabs">
          <button
            className={activeTab === "OVERVIEW" ? "active" : ""}
            onClick={() => setActiveTab("OVERVIEW")}
          >
            Overview
          </button>
          <button
            className={activeTab === "LIST" ? "active" : ""}
            onClick={() => setActiveTab("LIST")}
          >
            Subscribers List
          </button>
        </div>
      </div>

      {activeTab === "OVERVIEW" ? (
        renderOverview()
      ) : (
        <div className="subscribers-list">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Start</th>
                <th>Next Renewal</th>
                <th>Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.userName}</td>
                  <td>{sub.plan}</td>
                  <td className={sub.status.toLowerCase()}>{sub.status}</td>
                  <td>{sub.startDate}</td>
                  <td>{sub.nextRenewal}</td>
                  <td>{sub.totalPaid} AED</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;