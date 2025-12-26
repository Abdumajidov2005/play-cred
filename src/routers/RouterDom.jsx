import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdLimitAnalytics from "../pages/adminAnalistics/AdLimitAnalytics";
import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topBar/TopBar";
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/users/Users";
import Subscriptions from "../pages/subscriptions/Subscriptions";
import Bookings from "../pages/bookings/Bookings";

function RouterDom() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <div className="content-layout">
            <TopBar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/ad-limits" element={<AdLimitAnalytics />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default RouterDom;
