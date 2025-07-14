import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import QRCode from "qrcode.react";

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
    <div className="p-4 max-w-md mx-auto mt-20">
      {/* QR Code in a white box */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-center">
        <QRCode
          value={`WIFI:S:${ssid};T:WPA;P:${password};;`}
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      {/* Wi-Fi Details */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <p className="text-sm text-gray-500">SSID</p>
        <p className="text-lg font-medium text-gray-800">{ssid}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <p className="text-sm text-gray-500">Password</p>
        <p className="text-lg font-medium text-gray-800">{password}</p>
      </div>

      {/* Admin Edit Form */}
      {currentUser && currentUser.email === ADMIN_EMAIL && (
        <div className="bg-sand rounded-lg p-4 shadow">
          <h2 className="text-sea font-semibold mb-2">Edit Wi‑Fi</h2>
          <input
            type="text"
            placeholder="SSID"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            className="w-full mb-2 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
          />
          <button
            onClick={handleSave}
            className="w-full bg-sea text-white p-2 rounded hover:bg-sunset"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
