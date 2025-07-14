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

  useEffect(() => {
    async function fetchWifi() {
      const docRef = doc(db, "settings", "wifi");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSsid(data.ssid || "");
        setPassword(data.password || "");
      }
      setLoading(false);
    }
    fetchWifi();
  }, []);

  async function handleSave() {
    const docRef = doc(db, "settings", "wifi");
    await setDoc(docRef, { ssid, password });
    alert("Wi-Fi details updated!");
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Wi‑Fi Information</h1>
      <p className="text-slate-600 mb-2">SSID: <span className="font-semibold">{ssid}</span></p>
      <p className="text-slate-600 mb-4">Password: <span className="font-semibold">{password}</span></p>
      <QRCode value={`WIFI:S:${ssid};T:WPA;P:${password};;`} size={128} />
      {currentUser && (
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
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
