import React, { useState, useMemo } from "react";
import {
  Search,
  Mail,
  CheckCircle,
  XCircle,
  Smartphone,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import "./Users.css";

/* ================= MOCK USERS ================= */

const mockUsers = [
  {
    id: "U001",
    name: "Ali Hassan",
    email: "ali@mail.com",
    phone: "+971501234567",
    status: "Active",
    segment: "Frequent Booker",
    adsWatched: 120,
    totalBookings: 15,
    credits: 340,
    creditsEarned: 500,
    creditsSpent: 160,
    emailVerified: true,
    phoneVerified: false,
    joinDate: "2024-01-12",
    lastActive: "2 days ago",
    subscriptionStatus: "Monthly",
  },
];

/* ================= COMPONENT ================= */

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState("");

  /* ================= FILTER ================= */

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.id.includes(search)
    );
  }, [users, search]);

  /* ================= ACTIONS ================= */

  const addCredits = () => {
    if (!creditAmount || !selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              credits: u.credits + Number(creditAmount),
              creditsEarned: u.creditsEarned + Number(creditAmount),
            }
          : u
      )
    );
    setCreditAmount("");
  };

  const deductCredits = () => {
    if (!creditAmount || !selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              credits: Math.max(0, u.credits - Number(creditAmount)),
              creditsSpent: u.creditsSpent + Number(creditAmount),
            }
          : u
      )
    );
    setCreditAmount("");
  };

  const verifyEmail = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, emailVerified: true } : u
      )
    );
  };

  const verifyPhone = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, phoneVerified: true } : u
      )
    );
  };

  /* ================= UI ================= */

  return (
    <div className="users-page">
      {/* SEARCH */}
      <div className="users-header">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by name, email or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Contact</th>
            <th>Verified</th>
            <th>Ads</th>
            <th>Bookings</th>
            <th>Credits</th>
            <th>Sub</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="8" className="empty">
                No users found
              </td>
            </tr>
          )}

          {filteredUsers.map((user) => (
            <tr key={user.id} onClick={() => setSelectedUser(user)}>
              <td>
                <strong>{user.name}</strong>
                <div className="sub">{user.segment}</div>
              </td>
              <td>
                <div>{user.email}</div>
                <div className="sub">{user.phone}</div>
              </td>
              <td className="center">
                {user.emailVerified ? (
                  <CheckCircle className="ok" size={16} />
                ) : (
                  <XCircle className="bad" size={16} />
                )}
                {user.phoneVerified ? (
                  <Smartphone className="ok" size={16} />
                ) : (
                  <Smartphone className="bad" size={16} />
                )}
              </td>
              <td className="center">{user.adsWatched}</td>
              <td className="center">{user.totalBookings}</td>
              <td className="center">
                <strong>{user.credits} CR</strong>
                <div className="green">+{user.creditsEarned}</div>
                <div className="red">-{user.creditsSpent}</div>
              </td>
              <td>{user.subscriptionStatus}</td>
              <td>{user.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DRAWER */}
      {selectedUser && (
        <div className="drawer" onClick={() => setSelectedUser(null)}>
          <div
            className="drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setSelectedUser(null)}>
              ✕
            </button>

            <h2>{selectedUser.name}</h2>
            <p className="sub">{selectedUser.email}</p>

            <div className="stats">
              <div>
                <span>Balance</span>
                <strong>{selectedUser.credits} CR</strong>
              </div>
              <div>
                <span>Spent</span>
                <strong>{selectedUser.creditsSpent} CR</strong>
              </div>
            </div>

            <div className="credit-actions">
              <input
                type="number"
                placeholder="Credits"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
              <button onClick={addCredits}>
                <PlusCircle size={16} /> Add
              </button>
              <button onClick={deductCredits} className="danger">
                <MinusCircle size={16} /> Deduct
              </button>
            </div>

            <div className="verify">
              {!selectedUser.emailVerified && (
                <button onClick={() => verifyEmail(selectedUser.id)}>
                  <Mail size={14} /> Verify Email
                </button>
              )}
              {!selectedUser.phoneVerified && (
                <button onClick={() => verifyPhone(selectedUser.id)}>
                  <Smartphone size={14} /> Verify Phone
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
