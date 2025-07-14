
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

  const ADMIN_EMAIL = "stoneflowerhome@gmail.com"; // Replace with your admin email

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
        console.error("Error fetching Wi-Fi details:", error);
      }
      setLoading(false);
    }
    fetchWifi();
  }, []);

  async function handleSave() {
    try {
      const docRef = doc(db, "settings", "wifi");
      await setDoc(docRef, { ssid, password });
      alert("Wi-Fi details updated!");
    } catch (error) {
      console.error("Error saving Wi-Fi details:", error);
    }
  }

  if (loading) return <div className="p-6">Loading Wi‑Fi details...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Wi‑Fi Information</h1>
      <p className="text-slate-600 mb-2">SSID: <span className="font-semibold">{ssid}</span></p>
      <p className="text-slate-600 mb-4">Password: <span className="font-semibold">{password}</span></p>
      <QRCode value={`WIFI:S:${ssid};T:WPA;P:${password};;`} size={128} />

      {currentUser && currentUser.email === ADMIN_EMAIL ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Edit Wi‑Fi</h2>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="SSID"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="bg-sea text-white px-4 py-2 rounded hover:bg-sunset"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="mt-4 text-slate-500">
          {currentUser ? "You are not authorized to edit Wi‑Fi details." : "Login as admin to edit Wi‑Fi details."}
        </p>
      )}
    </div>
  );
}
