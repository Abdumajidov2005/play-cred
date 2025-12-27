import React from "react";
import "./Sidebar.css";
import { Link, NavLink, useLocation } from "react-router-dom";

import { FaChevronLeft } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { Trophy } from "lucide-react";
import { navItems } from "../../services/app";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const currentAdmin = {
    name: "John Doe",
    role: "Super Admin",
    avatar: "JD",
  };

  return (
    <div className={`sidebar-container ${!isOpen ? "collapsed" : ""}`}>
      {/* Logo va Toggle */}
      <div className="sidebar-header">
        <Link to={"/"} className={isOpen ? "logo-full" : "logo-collapsed"}>
          {isOpen ? (
            <>
              <Trophy className="logo-icon" />
              <span className="logo-text">
                <span className="logo-play">Play</span>
                <span className="logo-cred">Cred</span>
              </span>
            </>
          ) : (
            <Trophy className="logo-icon" />
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className={`toggle-button ${isOpen ? "" : "active"}`}
        >
          <FaChevronLeft className="toggle_left" />
          <FaBarsStaggered className="toggle_bars" />
        </button>
      </div>

      {/* Navigatsiya */}
      <nav className="sidebar-nav">
        {navItems?.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
           
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon
                className={`nav-icon ${!isOpen ? "centered" : ""} ${
                  isActive ? "active-icon" : ""
                }`}
              />
              {isOpen && <span className="nav-label">{item.label}</span>}
              {!isOpen && <div className="nav-tooltip">{item.label}</div>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="sidebar-footer">
        <div className={isOpen ? "user-info-full" : "user-info-collapsed"}>
          <div className="user-avatar">
            {currentAdmin.avatar || currentAdmin.name.charAt(0)}
          </div>
          {isOpen && (
            <div className="user-details">
              <p className="user-name">{currentAdmin.name}</p>
              <p className="user-role">{currentAdmin.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
