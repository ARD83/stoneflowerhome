import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import QRCode from "qrcode.react";
import backgroundImage from "../assets/explore-bg.jpg"; // ✅ Added background image

export default function Wifi() {
  const { currentUser } = useAuth();
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  useEffect(() => {
    async function fetchWifi() {
      try {
        const docRef = doc(db, "settings", "wifi");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSsid(data.ssid || "");
          setPassword(data.password || "");
        }
      } catch (error) {
        console.error("Error fetching Wi‑Fi details:", error);
      }
      setLoading(false);
    }
    fetchWifi();
  }, []);

  async function handleSave() {
    try {
      const docRef = doc(db, "settings", "wifi");
      await setDoc(docRef, { ssid, password });
      alert("Wi‑Fi details updated!");
    } catch (error) {
      console.error("Error saving Wi‑Fi details:", error);
    }
  }

  if (loading) return <div className="p-6 text-center">Loading Wi‑Fi details…</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-[100px]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>

      <div className="relative z-10 max-w-md mx-auto p-4">
        {/* QR Code in a white card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-center">
          <QRCode
            value={`WIFI:S:${ssid};T:WPA;P:${password};;`}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
            className="rounded-lg"
          />
        </div>

        {/* Wi‑Fi Details for Guests */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">SSID</p>
            <p className="text-lg font-semibold text-sea">{ssid}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Password</p>
            <p className="text-lg font-semibold text-sea">{password}</p>
          </div>
        </div>

        {/* Admin Edit Form */}
        {currentUser && currentUser.email === ADMIN_EMAIL && (
          <div className="mt-8 bg-sea/10 rounded-xl p-4 shadow border border-sea">
            <h2 className="text-sea font-semibold text-lg mb-4">Edit Wi‑Fi</h2>
            <input
              type="text"
              placeholder="SSID"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="w-full mb-3 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
            />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
            />
            <button
              onClick={handleSave}
              className="w-full bg-sea text-white py-3 rounded-lg hover:bg-sunset transition"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
