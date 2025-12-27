import React, { useState } from "react";
import "./Credits.css";
import {
  Activity,
  AlertTriangle,
  Coins,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

// Mock useData — real loyihada o'zgartiriladi
const useData = () => {
  const users = [
    {
      id: "U101",
      name: "Alice Johnson",
      status: "Active",
      creditsEarned: 150,
      creditsSpent: 90,
      lastActive: "2025-12-27",
    },
    {
      id: "U102",
      name: "Bob Smith",
      status: "Active",
      creditsEarned: 200,
      creditsSpent: 180,
      lastActive: "2025-12-26",
    },
    {
      id: "U103",
      name: "Charlie Brown",
      status: "Inactive",
      creditsEarned: 50,
      creditsSpent: 30,
      lastActive: "2025-12-20",
    },
  ];

  const creditBatches = [
    {
      id: "B001",
      userId: "U101",
      remainingAmount: 20,
      expiryDate: "2025-12-30",
      source: "Ad Rewards",
      status: "Active",
    },
    {
      id: "B002",
      userId: "U102",
      remainingAmount: 15,
      expiryDate: "2025-12-29",
      source: "Referral Bonus",
      status: "Active",
    },
    {
      id: "B003",
      userId: "U101",
      remainingAmount: 10,
      expiryDate: "2025-12-31",
      source: "Promo Code",
      status: "Active",
    },
  ];

  const transactions = [
    {
      id: "TX001",
      userName: "Alice Johnson",
      type: "EARN",
      source: "Ad Rewards",
      amount: 10,
      timestamp: "2025-12-28 14:30",
    },
    {
      id: "TX002",
      userName: "Bob Smith",
      type: "SPEND",
      source: "Field Booking",
      amount: 3,
      timestamp: "2025-12-28 20:00",
    },
    {
      id: "TX003",
      userName: "Charlie Brown",
      type: "EARN",
      source: "Referral",
      amount: 20,
      timestamp: "2025-12-27 10:15",
    },
  ];

  return { transactions, users, creditBatches };
};

const Credits = () => {
  const { transactions, users, creditBatches } = useData();
  const [expiryFilter, setExpiryFilter] = useState("7");

  // Metrics
  const totalIssued = users.reduce((acc, u) => acc + u.creditsEarned, 0);
  const totalSpent = users.reduce((acc, u) => acc + u.creditsSpent, 0);
  const circulation = totalIssued - totalSpent;
  const activeUserCount = users.filter((u) => u.status === "Active").length;
  const avgPerUser = activeUserCount
    ? Math.round(circulation / activeUserCount)
    : 0;

  // Expiring Batches Filter
  const expiringBatches = creditBatches
    .filter((batch) => {
      if (batch.status !== "Active" || !batch.expiryDate) return false;
      const today = new Date("2025-12-28"); // Fixed current date
      const expiry = new Date(batch.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= parseInt(expiryFilter);
    })
    .sort(
      (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );

  return (
    <div className="credits-container">
      {/* Stat Cards */}
      <div className="credits_stats-grid">
        <div className="credits_stat-card">
          <div className="credits_stat-icon up">
            <TrendingUp size={63} />
          </div>
          <div className="credits_stat-info">
            <div className="credits_stat-title">Total Issued</div>
            <div className="credits_stat-value">{totalIssued.toLocaleString()}</div>
            <div className="credits_stat-trend positive">+8.5% vs previous period</div>
          </div>
        </div>
        <div className="credits_stat-card">
          <div className="credits_stat-icon down">
            <TrendingDown size={63} />
          </div>
          <div className="credits_stat-info">
            <div className="credits_stat-title">Total Spent</div>
            <div className="credits_stat-value">{totalSpent.toLocaleString()}</div>
            <div className="credits_stat-trend positive">+12.0% vs previous period</div>
          </div>
        </div>
        <div className="credits_stat-card">
          <div className="credits_stat-icon neutral">
            <Coins size={62} />
          </div>
          <div className="credits_stat-info">
            <div className="credits_stat-title">In Circulation</div>
            <div className="credits_stat-value">{circulation.toLocaleString()}</div>
            <div className="credits_stat-trend negative">-2.0% vs previous period</div>
          </div>
        </div>
        <div className="credits_stat-card">
          <div className="credits_stat-icon activity">
            <Activity size={55} />
          </div>
          <div className="credits_stat-info">
            <div className="credits_stat-title">Avg / Active User</div>
            <div className="credits_stat-value">{avgPerUser.toLocaleString()}</div>
            <div className="credits_stat-trend positive">+1.5% vs previous period</div>
          </div>
        </div>
      </div>

      {/* Expiring Credits Alert */}
      <div className="expiring-panel">
        <div className="expiring-header">
          <h3>
            <AlertTriangle /> Credits Expiring Soon
          </h3>
          <div className="expiry-filters">
            <button
              onClick={() => setExpiryFilter("1")}
              className={expiryFilter === "1" ? "active" : ""}
            >
              Today
            </button>
            <button
              onClick={() => setExpiryFilter("3")}
              className={expiryFilter === "3" ? "active" : ""}
            >
              3 Days
            </button>
            <button
              onClick={() => setExpiryFilter("7")}
              className={expiryFilter === "7" ? "active" : ""}
            >
              7 Days
            </button>
          </div>
        </div>

        {expiringBatches.length === 0 ? (
          <div className="empty-message">
            No credits expiring within this timeframe.
          </div>
        ) : (
          <table className="expiring-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Credits Expiring</th>
                <th>Expiry Date</th>
                <th>Batch Source</th>
                <th>Last Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expiringBatches.map((batch) => {
                const user = users.find((u) => u.id === batch.userId);
                return (
                  <tr key={batch.id}>
                    <td>
                      <div className="user-name">
                        {user ? user.name : batch.userId}
                      </div>
                      <div className="user-id">ID: {batch.userId}</div>
                    </td>
                    <td className="expiring-amount">
                      {batch.remainingAmount} CR
                    </td>
                    <td className="expiry-date">{batch.expiryDate}</td>
                    <td>{batch.source}</td>
                    <td>{user ? user.lastActive : "-"}</td>
                    <td>
                      <button className="action-btn">View User</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Sources & Spending Breakdown */}
      <div className="breakdown-grid">
        <div className="breakdown-card">
          <h3>Earned Sources</h3>
          <div className="breakdown-item">
            <span>Ad Rewards</span>
            <span className="positive">75%</span>
          </div>
          <div className="breakdown-item">
            <span>Referrals</span>
            <span className="positive">15%</span>
          </div>
          <div className="breakdown-item">
            <span>Promo Codes</span>
            <span className="positive">10%</span>
          </div>
        </div>

        <div className="breakdown-card">
          <h3>Spending Breakdown</h3>
          <div className="breakdown-item">
            <span>Field Bookings</span>
            <span className="negative">90%</span>
          </div>
          <div className="breakdown-item">
            <span>Subscriptions</span>
            <span className="negative">8%</span>
          </div>
          <div className="breakdown-item">
            <span>Other</span>
            <span className="negative">2%</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-panel">
        <div className="transactions-header">
          <h3>Recent Transactions Log</h3>
        </div>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="tx-id">{tx.id}</td>
                <td className="user-name">{tx.userName}</td>
                <td>
                  <span
                    className={`tx-type ${
                      tx.type === "EARN" ? "earn" : "spend"
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td>{tx.source}</td>
                <td
                  className={`tx-amount ${
                    tx.type === "EARN" ? "positive" : "negative"
                  }`}
                >
                  {tx.type === "EARN" ? "+" : "-"} {tx.amount}
                </td>
                <td className="tx-time">{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Credits;
