import React, { useState } from "react";
import "./Settings.css";
import {
  AlertCircle,
  AlertCircleIcon,
  Bell,
  Check,
  CheckCheck,
  CheckCircle,
  Droplet,
  Edit,
  FileText,
  Lock,
  Plus,
  Save,
  Shield,
  Trash,
} from "lucide-react";
import { PiProhibitInsetDuotone } from "react-icons/pi";
import { AiOutlineClockCircle } from "react-icons/ai";

// Mock data (real loyihada useData konteksti bilan almashtiriladi)
const useData = () => {
  const currentAdmin = {
    id: "ADM-001",
    name: "John Doe",
    email: "john@playcred.ae",
    role: "Founder & CEO",
  };

  const adminUsers = [
    {
      id: "ADM-001",
      name: "John Doe",
      email: "john@playcred.ae",
      role: "Founder & CEO",
      status: "Active",
      lastLogin: "Today at 14:32",
      avatar: "JD",
    },
    {
      id: "ADM-002",
      name: "Sarah Smith",
      email: "sarah@playcred.ae",
      role: "Super Admin",
      status: "Active",
      lastLogin: "Yesterday",
      avatar: "SS",
    },
    {
      id: "ADM-003",
      name: "Mike Johnson",
      email: "mike@playcred.ae",
      role: "Operations Manager",
      status: "Active",
      lastLogin: "2 days ago",
      avatar: "MJ",
    },
    {
      id: "ADM-004",
      name: "Emma Wilson",
      email: "emma@playcred.ae",
      role: "Finance Manager",
      status: "Suspended",
      lastLogin: "Never",
      avatar: "EW",
    },
    {
      id: "ADM-005",
      name: "David Brown",
      email: "david@investor.com",
      role: "Investor",
      status: "Active",
      lastLogin: "Last week",
      avatar: "DB",
    },
  ];

  const addAdmin = (admin) => console.log("Added admin:", admin);
  const updateAdmin = (admin) => console.log("Updated admin:", admin);
  const deleteAdmin = (id) => console.log("Deleted admin:", id);

  return { currentAdmin, adminUsers, addAdmin, updateAdmin, deleteAdmin };
};

const Settings = () => {
  const { currentAdmin, adminUsers, addAdmin, updateAdmin, deleteAdmin } =
    useData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [error, setError] = useState(null);

  // Permissions
  const canCreate = ["Founder & CEO", "Super Admin"].includes(
    currentAdmin.role
  );

  const canEdit = (target) => {
    if (currentAdmin.role === "Founder & CEO") return true;
    if (currentAdmin.role === "Super Admin")
      return target.role !== "Founder & CEO";
    return false;
  };

  const canDelete = (target) => {
    if (currentAdmin.id === target.id) return false;
    if (currentAdmin.role === "Founder & CEO") return true;
    if (currentAdmin.role === "Super Admin")
      return target.role !== "Founder & CEO";
    return false;
  };

  const getAssignableRoles = () => {
    const allRoles = [
      "Super Admin",
      "Operations Manager",
      "Finance Manager",
      "Investor",
    ];
    if (currentAdmin.role === "Founder & CEO")
      return ["Founder & CEO", ...allRoles];
    if (currentAdmin.role === "Super Admin") return allRoles;
    return [];
  };

  const handleCreate = () => {
    setEditingAdmin({
      name: "",
      email: "",
      role: "Operations Manager",
      status: "Active",
    });
    setError(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (admin) => {
    if (!canEdit(admin)) return;
    setEditingAdmin({ ...admin });
    setError(null);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!editingAdmin?.name || !editingAdmin?.email) {
      setError("Name and Email are required.");
      return;
    }

    if (editingAdmin.id) {
      updateAdmin(editingAdmin);
    } else {
      const newId = `ADM-${Math.floor(Math.random() * 10000)}`;
      addAdmin({
        ...editingAdmin,
        id: newId,
        lastLogin: "Never",
        avatar: editingAdmin.name?.substring(0, 2).toUpperCase(),
      });
    }
    setIsDrawerOpen(false);
    setEditingAdmin(null);
  };

  const handleDelete = (admin) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${admin.name}? This cannot be undone.`
      )
    ) {
      deleteAdmin(admin.id);
    }
  };

  return (
    <div className="settings-container">
      {/* Admin Users Section */}
      <section className="admins-section">
        <div className="section-header">
          <div>
            <h3>
              <Shield /> Admin Users
            </h3>
            <p>Manage team access and permissions.</p>
          </div>
          {canCreate && (
            <button onClick={handleCreate} className="add-admin-btn">
              <Plus /> Add New Admin
            </button>
          )}
        </div>

        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="user-info">
                      <div className="avatar">{admin.avatar}</div>
                      <div>
                        <div className="user-name">
                          {admin.name}
                          {admin.role === "Founder & CEO" && (
                            <span className="lock-icon">🔒</span>
                          )}
                          {admin.id === currentAdmin.id && (
                            <span className="you-badge">YOU</span>
                          )}
                        </div>
                        <div className="user-email">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`role-badge ${admin.role
                        .replace(/ & /g, "-")
                        .toLowerCase()}`}
                    >
                      {admin.role}
                    </span>
                  </td>
                  <td>
                    {admin.status === "Active" ? (
                      <span className="settings_status-active">
                        <Check /> Active
                      </span>
                    ) : (
                      <span className="settings_status-suspended">
                        <PiProhibitInsetDuotone size={20} /> Suspended
                      </span>
                    )}
                  </td>
                  <td>{admin.lastLogin}</td>
                  <td className="actions">
                    {canEdit(admin) && (
                      <button
                        onClick={() => handleEdit(admin)}
                        className="action-btn edit"
                      >
                        <Edit />
                      </button>
                    )}
                    {canDelete(admin) && (
                      <button
                        onClick={() => handleDelete(admin)}
                        className="action-btn delete"
                      >
                        <Trash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Permissions Overview */}
      <section className="permissions-overview">
        <h4>Permissions Overview</h4>
        <div className="permissions-grid">
          <div className="perm-card founder">
            <div>Founder & CEO</div>
            <p>Full system access. Cannot be deleted. Can manage all admins.</p>
          </div>
          <div className="perm-card super">
            <div>Super Admin</div>
            <p>
              Full access except Founder management. Can manage ads, users,
              fields.
            </p>
          </div>
          <div className="perm-card ops">
            <div>Ops Manager</div>
            <p>
              Manage fields, bookings, users. No access to ads config, finance,
              or admin roles.
            </p>
          </div>
          <div className="perm-card finance">
            <div>Finance Manager</div>
            <p>
              Access subscriptions, payments, reports. Read-only for operations.
            </p>
          </div>
          <div className="perm-card investor">
            <div>Investor</div>
            <p>
              Read-only dashboards. PII (phone/email) hidden. No edit
              capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Credit Expiration Rules */}
      <section className="credit-rules">
        <h3>
          <AiOutlineClockCircle size={24} /> Credit Expiration Rules
        </h3>
        <div className="rules-grid">
          <div>
            <span className="rule-icon">
              <FileText color="blue" />
            </span>
            <div>
              <div>Earned Credits</div>
              <div className="rule-value">Expire in 30 Days</div>
              <p>Rolling expiration based on earn date.</p>
            </div>
          </div>
          <div>
            <span className="rule-icon">
              <CheckCircle color="green" />
            </span>
            <div>
              <div>Purchased Credits</div>
              <div className="rule-value">Never Expire</div>
              <p>Paid credits remain valid indefinitely.</p>
            </div>
          </div>
          <div>
            <span className="rule-icon">
              <AlertCircle color="orange" />
            </span>
            <div>
              <div>Usage Order</div>
              <div className="rule-value">FIFO Logic</div>
              <p>Oldest/Nearest expiry credits used first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications & Economy Rules (visual only) */}
      <section className="notifications-section">
        <h3>
          <Bell /> Notifications
        </h3>
        <div className="notifications-list">
          <div className="notif-item">
            <div>
              <div>Low Field Occupancy Alert</div>
              <p>Notify when average occupancy drops below 30%</p>
            </div>
            <div className="toggle on"></div>
          </div>
          <div className="notif-item">
            <div>
              <div>New Sponsor Signup</div>
              <p>Email alert for new high-value accounts</p>
            </div>
            <div className="toggle on"></div>
          </div>
        </div>
      </section>

      <section className="economy-rules">
        <h3>
          <Lock /> Economy Rules
        </h3>
        <div className="economy-grid">
          <div>
            <label>Credits per Ad View</label>
            <input type="number" value={1} readOnly />
          </div>
          <div>
            <label>Booking Cost (1 Hour)</label>
            <input type="number" value={3} readOnly />
          </div>
          <div>
            <label>Referral Bonus</label>
            <input type="number" value={50} readOnly />
          </div>
        </div>
      </section>

      {/* Edit Drawer Modal */}
      {isDrawerOpen && editingAdmin && (
        <div
          className="settings_drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div className="settings_drawer" onClick={(e) => e.stopPropagation()}>
            <div className="settings_drawer-header">
              <h3>{editingAdmin.id ? "Edit Admin" : "Add New Admin"}</h3>
              <button onClick={() => setIsDrawerOpen(false)}>✖</button>
            </div>
            <div className="settings_drawer-body">
              <div className="settings_form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingAdmin.name || ""}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, name: e.target.value })
                  }
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div className="settings_form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={editingAdmin.email || ""}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, email: e.target.value })
                  }
                  placeholder="e.g. jane@playcred.ae"
                />
              </div>
              <div className="settings_form-group">
                <label>Role</label>
                <select
                  value={editingAdmin.role || ""}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, role: e.target.value })
                  }
                >
                  {getAssignableRoles().map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <p className="settings_role-note">
                  {editingAdmin.role === "Super Admin" &&
                    "Can manage everything except Founder."}
                  {editingAdmin.role === "Operations Manager" &&
                    "Can manage fields, bookings, users. No ads/finance."}
                  {editingAdmin.role === "Finance Manager" &&
                    "Can manage subs, view reports. No ops/ads."}
                  {editingAdmin.role === "Investor" &&
                    "Read-only access. Masked user data."}
                </p>
              </div>
              <div className="settings_form-group">
                <label>Account Status</label>
                <select
                  value={editingAdmin.status || "Active"}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {error && (
                <div className="settings_error-alert">
                  <AlertCircleIcon /> {error}
                </div>
              )}
            </div>
            <div className="settings_drawer-footer">
              <button className="settings_cancel" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
              <button onClick={handleSave} className="settings_save-btn">
                <Save size={24}/> Save Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
