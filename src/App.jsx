import React, { useRef, useEffect, useState } from "react";
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

function Layout({ children }) {
  const location = useLocation();
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // ✅ Get dynamic navbar height
  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [location]);

  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar ref={navbarRef} />}
      <div style={{ paddingTop: !hideNavbar ? `${navbarHeight}px` : "0px" }}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wifi" element={<Wifi />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/gallery" element={<GuestGallery />} />
          <Route path="/admin" element={<AdminLogin />} />
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
      </Layout>
    </Router>
  );
}
