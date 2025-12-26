import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Calendar as CalendarIcon,
  ChevronDown,
  LogOut,
} from "lucide-react";
import "./TopBar.css";
import { IoSearch } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { navItems } from "../../services/app";

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [searchClick, setSearchClick] = useState(false);

  const location = useLocation();

  const currentPage = navItems?.find((item) => item.path === location.pathname);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const dateRef = useRef(null);
  const searchRef = useRef(null);

  const notifications = [{ id: 1, text: "System maintenance scheduled" }];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileMenu(false);
      if (dateRef.current && !dateRef.current.contains(e.target))
        setShowDateFilter(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchClick(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <h1 className="topbar-title">{currentPage?.label || "Page"}</h1>

      <div className="topbar-actions">
        <div
          ref={searchRef}
          onClick={() => {
            setSearchClick(true);
          }}
          className={`topbar_search-box ${searchClick ? "active" : ""}`}
        >
          <IoSearch className="topbar_search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dropdown" ref={dateRef}>
          <button className="date-btn" onClick={() => setShowDateFilter(true)}>
            <CalendarIcon size={14} />
            <span>{dateRange}</span>
            <ChevronDown size={14} />
          </button>

          {
            <div className={`dropdown-menu ${showDateFilter ? "active" : ""}`}>
              {["Today", "Last 7 Days", "Last 30 Days"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setDateRange(r);
                    setShowDateFilter(false);
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          }
        </div>

        <div className="dropdown" ref={notifRef}>
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
          </button>

          {showNotifications && (
            <div className="dropdown-menu wide">
              <div className="dropdown-header">Notifications</div>
              {notifications.map((n) => (
                <div key={n.id} className="notification-item">
                  {n.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dropdown" ref={profileRef}>
          <div
            className="profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-info">
              <div className="name">Admin User</div>
              <div className="role">ADMIN</div>
            </div>
            <div className="avatar">A</div>
          </div>

          {
            <div className={`dropdown-menu ${showProfileMenu ? "active" : ""}`}>
              <button
                className="topbar_logout-btn"
                onClick={() => alert("Logout (frontend only)")}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  );
};

export default TopBar;
