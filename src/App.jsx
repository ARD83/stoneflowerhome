import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Wifi from "./pages/Wifi";
import Explore from "./pages/Explore";
import AddExplore from "./pages/AddExplore";
import EditExplore from "./pages/EditExplore";
import GuestGallery from "./pages/GuestGallery";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";

function AppContent() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <>
      {/* ✅ Show Navbar only if NOT on Home */}
      {!isHome && <Navbar />}

      <div className={isHome ? "" : "pt-20"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/wifi" element={<Wifi />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/gallery" element={<GuestGallery />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin-only Routes */}
          <Route
            path="/explore/add"
            element={
              <PrivateRoute>
                <AddExplore />
              </PrivateRoute>
            }
          />
          <Route
            path="/explore/edit/:id"
            element={
              <PrivateRoute>
                <EditExplore />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
