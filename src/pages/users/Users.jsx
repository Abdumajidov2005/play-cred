import React, { useState, useMemo, useRef, useEffect } from "react";
import "./Users.css";
import { Search } from "lucide-react";

// Namuna ma'lumotlar
const mockUsers = [
  {
    id: "USR001",
    name: "Ahmed Al-Mansoori",
    email: "ahmed@example.com",
    phone: "+971501234567",
    joinDate: "2024-08-15",
    lastActive: "2 hours ago",
    segment: "Frequent Booker",
    status: "Active",
    emailVerified: true,
    phoneVerified: false,
    adsWatched: 342,
    totalBookings: 18,
    credits: 1250,
    creditsEarned: 2100,
    creditsSpent: 850,
    subscriptionStatus: "Premium",
    rating: 4.8,
    reviewStatus: "Excellent",
    notes: "VIP customer, frequently books premium slots.",
  },
  {
    id: "USR002",
    name: "Sara Khalid",
    email: "sara.k@example.com",
    phone: "+971552345678",
    joinDate: "2025-01-10",
    lastActive: "1 day ago",
    segment: "Ad Watcher",
    status: "Active",
    emailVerified: false,
    phoneVerified: true,
    adsWatched: 890,
    totalBookings: 3,
    credits: 450,
    creditsEarned: 890,
    creditsSpent: 440,
    subscriptionStatus: "None",
    rating: 4.2,
    reviewStatus: "Good",
    notes: "",
  },
  {
    id: "USR003",
    name: "Omar Hassan",
    email: "omar.h@example.com",
    phone: "+971501112233",
    joinDate: "2024-11-20",
    lastActive: "3 days ago",
    segment: "Casual",
    status: "Inactive",
    emailVerified: true,
    phoneVerified: true,
    adsWatched: 120,
    totalBookings: 5,
    credits: 80,
    creditsEarned: 150,
    creditsSpent: 70,
    subscriptionStatus: "None",
    rating: 3.9,
    reviewStatus: "Good",
    notes: "Low activity recently.",
  },
];

const mockCreditBatches = [
  {
    id: "B001",
    userId: "USR001",
    source: "Referral Bonus",
    originalAmount: 500,
    remainingAmount: 300,
    earnedDate: "2024-09-01",
    expiryDate: "2025-03-31",
    status: "Active",
  },
  {
    id: "B002",
    userId: "USR001",
    source: "Ad Watching",
    originalAmount: 800,
    remainingAmount: 800,
    earnedDate: "2025-01-15",
    expiryDate: null,
    status: "Active",
  },
  {
    id: "B003",
    userId: "USR001",
    source: "Welcome Bonus",
    originalAmount: 200,
    remainingAmount: 150,
    earnedDate: "2024-08-15",
    expiryDate: "2025-01-05",
    status: "Active",
  },
  {
    id: "B004",
    userId: "USR002",
    source: "Ad Watching",
    originalAmount: 600,
    remainingAmount: 450,
    earnedDate: "2025-01-20",
    expiryDate: "2025-06-20",
    status: "Active",
  },
];

const currentAdmin = { role: "Founder & CEO" };

const Users = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("All Segments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isEditing, setIsEditing] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("idle");

  const [searchUserAdd, setSearchUserAdd] = useState(false);
  const userRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setSearchUserAdd(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedUser = mockUsers.find((u) => u.id === selectedUserId);
  const userBatches = mockCreditBatches.filter(
    (b) => b.userId === selectedUserId
  );

  const canEditUsers = ["Founder & CEO", "Super Admin"].includes(
    currentAdmin.role
  );
  const canManageCredits = [
    "Founder & CEO",
    "Super Admin",
    "Operations Manager",
  ].includes(currentAdmin.role);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.includes(searchQuery);
      const matchesSegment =
        segmentFilter === "All Segments" || user.segment === segmentFilter;
      const matchesStatus =
        statusFilter === "All Statuses" || user.status === statusFilter;
      return matchesSearch && matchesSegment && matchesStatus;
    });
  }, [searchQuery, segmentFilter, statusFilter]);

  const activeCredits = userBatches
    .filter((b) => b.status === "Active")
    .reduce((sum, b) => sum + b.remainingAmount, 0);
  const creditsExpiringIn7Days = userBatches
    .filter((b) => {
      if (!b.expiryDate || b.status !== "Active") return false;
      const diffDays = Math.ceil(
        (new Date(b.expiryDate).getTime() - Date.now()) / 86400000
      );
      return diffDays >= 0 && diffDays <= 7;
    })
    .reduce((sum, b) => sum + b.remainingAmount, 0);

  const handleEdit = () => {
    if (selectedUser) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSendNotification = () => {
    setNotificationStatus("sending");
    setTimeout(() => {
      setNotificationStatus("sent");
      setTimeout(() => setNotificationStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="users-page">
      {/* Filters */}
      <div className="filters-container">
        <div
          ref={userRef}
          onClick={() => {
            setSearchUserAdd(true);
          }}
          className={`user_search-box ${searchUserAdd ? "active" : ""}`}
        >
          <Search size={22} />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
          >
            <option>All Segments</option>
            <option>Frequent Booker</option>
            <option>High Spender</option>
            <option>Heavy Player</option>
            <option>Ad Watcher</option>
            <option>New</option>
            <option>Casual</option>
            <option>Dormant</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Verified</th>
              <th>Ads</th>
              <th>Bookings</th>
              <th>Credits (+/-)</th>
              <th>Sub</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} onClick={() => setSelectedUserId(user.id)}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{user.name[0]}</div>
                      <div>
                        <div className="name">{user.name}</div>
                        <div className="id-segment">
                          #{user.id} • {user.segment}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact">
                      <div>{user.email}</div>
                      <div>{user.phone}</div>
                    </div>
                  </td>
                  <td className="verified">
                    <span
                      className={
                        user.emailVerified ? "verified-yes" : "verified-no"
                      }
                    >
                      ●
                    </span>
                    <span
                      className={
                        user.phoneVerified ? "verified-yes" : "verified-no"
                      }
                    >
                      ●
                    </span>
                  </td>
                  <td>{user.adsWatched}</td>
                  <td>{user.totalBookings}</td>
                  <td className="credits">
                    <div className="earned">+{user.creditsEarned}</div>
                    <div className="spent">-{user.creditsSpent}</div>
                  </td>
                  <td>
                    {user.subscriptionStatus !== "None" ? (
                      <span className="sub-badge">
                        {user.subscriptionStatus}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{user.lastActive}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedUser && (
        <div className="drawer-overlay" onClick={() => setSelectedUserId(null)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>User Profile</h2>
              <div className="header-actions">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="btn-save">
                      Save
                    </button>
                    <button onClick={handleCancel} className="btn-cancel">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {canEditUsers && (
                      <button onClick={handleEdit} className="btn-edit">
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedUserId(null)}
                      className="btn-close"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="drawer-body">
              <div className="profile-section">
                <div className="profile-avatar">{selectedUser.name[0]}</div>
                <div className="profile-info">
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  <small>Joined {selectedUser.joinDate}</small>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Current Balance</div>
                  <div className="stat-value large green">
                    {selectedUser.credits} CR
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Lifetime Spent</div>
                  <div className="stat-value large red">
                    {selectedUser.creditsSpent} CR
                  </div>
                </div>
              </div>

              <div className="credits-section">
                <h4>Credits & Expiry</h4>
                <div className="expiry-summary">
                  <div className="expiry-item">
                    <div className="label">Active</div>
                    <div className="value">{activeCredits}</div>
                  </div>
                  <div className="expiry-item warning">
                    <div className="label">Exp in 7d</div>
                    <div className="value">{creditsExpiringIn7Days}</div>
                  </div>
                  <div className="expiry-item danger">
                    <div className="label">Expired (30d)</div>
                    <div className="value">0</div>
                  </div>
                </div>

                <div className="batches-table-wrapper">
                  <table className="batches-table">
                    <thead>
                      <tr>
                        <th>Batch ID</th>
                        <th>Source</th>
                        <th>Earned</th>
                        <th>Expiry</th>
                        <th>Remaining</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBatches.map((batch) => (
                        <tr key={batch.id}>
                          <td>{batch.id}</td>
                          <td>{batch.source}</td>
                          <td>{batch.earnedDate}</td>
                          <td>{batch.expiryDate || "Never"}</td>
                          <td>
                            {batch.remainingAmount}/{batch.originalAmount}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${batch.status.toLowerCase()}`}
                            >
                              {batch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {userBatches.length === 0 && (
                        <tr>
                          <td colSpan="6" className="no-batches">
                            No credit history.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {canManageCredits && (
                <div className="credit-management">
                  <h4>Manage Credits</h4>
                  <div className="credit-controls">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                    />
                    <button className="btn-add">+ Add</button>
                    <button className="btn-ded">− Deduct</button>
                  </div>
                </div>
              )}

              <div className="admin-actions">
                <button
                  onClick={handleSendNotification}
                  disabled={notificationStatus !== "idle"}
                  className="btn-notification"
                >
                  {notificationStatus === "sent"
                    ? "Sent ✓"
                    : notificationStatus === "sending"
                    ? "Sending..."
                    : "Send Push Notification"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
