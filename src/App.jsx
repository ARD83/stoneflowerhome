import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Wifi from "./pages/Wifi";
import Explore from "./pages/Explore";
import EditExplore from "./pages/EditExplore";
import GuestGallery from "./pages/GuestGallery";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20"> {/* Add padding for fixed navbar */}
        <Routes>
          <Route path="/" element={<Wifi />} />
          <Route path="/wifi" element={<Wifi />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/edit/:id" element={
            <PrivateRoute>
              <EditExplore />
            </PrivateRoute>
          } />
          <Route path="/gallery" element={<GuestGallery />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}
