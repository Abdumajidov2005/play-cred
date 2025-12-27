import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdLimitAnalytics from "../pages/adminAnalistics/AdLimitAnalytics";
import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topBar/TopBar";
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/users/Users";
import Subscriptions from "../pages/subscriptions/Subscriptions";
import Bookings from "../pages/bookings/Bookings";
import AdsRevenue from "../pages/adventures/AdsRevenue";
import Fields from "../pages/fields/Fields";
import SlotManagement from "../pages/slotManagment/SlotManagement";
import Credits from "../pages/credits/Credits";
import Referrals from "../pages/referals/Referrals";
import Partners from "../pages/partners/Partners";
import Reports from "../pages/reports/Reports";
import LoadAds from "../pages/loads/LoadAds";
import Settings from "../pages/settings/Settings";

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
                <Route path="/fields" element={<Fields />} />
                <Route path="/slotManagement" element={<SlotManagement />} />
                <Route path="/revenue" element={<AdsRevenue />} />
                <Route path="/load-ads" element={<LoadAds />} />
                <Route path="/ad-limits" element={<AdLimitAnalytics />} />
                <Route path="/credits-rewards" element={<Credits />} />
                <Route path="/referrals-growth" element={<Referrals />} />
                <Route path="/partners-sponsors" element={<Partners />} />
                <Route path="/reports-export" element={<Reports />} />
                <Route path="/settings-admins" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default RouterDom;
