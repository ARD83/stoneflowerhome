
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Wifi from './pages/Wifi';
import Explore from './pages/Explore';
import GuestGallery from './pages/GuestGallery';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Wifi from './pages/Wifi';
import Explore from './pages/Explore';
import EditExplore from './pages/EditExplore';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wifi" element={<Wifi />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/gallery" element={<GuestGallery />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/wifi" element={<Wifi />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/edit/:id" element={<EditExplore />} />
      </Routes>
    </Router>
  );
}
