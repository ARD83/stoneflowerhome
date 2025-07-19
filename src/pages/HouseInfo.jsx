// src/pages/HouseInfo.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import backgroundImage from "../assets/houseinfo-bg.jpg";

export default function HouseInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const docRef = doc(db, "settings", "houseInfo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo(docSnap.data());
        } else {
          console.log("No House Info found");
        }
      } catch (error) {
        console.error("Error fetching house info:", error);
      }
    }
    fetchInfo();
  }, []);

  if (!info) {
    return (
      <div className="flex justify-center items-center h-screen bg-sand">
        <p className="text-sea text-lg">Loading House Information…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-[100px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-3xl mx-auto bg-white/90 rounded-xl shadow p-6 mt-10">
        <h1 className="text-3xl font-bold text-sea mb-4 text-center">
          Welcome & House Info
        </h1>
        <p className="text-gray-700 mb-4">{info.introduction}</p>

        <h2 className="text-2xl font-semibold text-olive mt-6 mb-2">🏠 House Rules</h2>
        <p className="text-gray-700 mb-4">{info.rules}</p>

        <h2 className="text-2xl font-semibold text-olive mt-6 mb-2">🗑 Garbage Disposal</h2>
        <p className="text-gray-700 mb-4">{info.garbage}</p>

        <h2 className="text-2xl font-semibold text-olive mt-6 mb-2">🏊 Pool Rules</h2>
        <p className="text-gray-700 mb-4">{info.pool}</p>

        <h2 className="text-2xl font-semibold text-olive mt-6 mb-2">🚨 Emergency Numbers</h2>
        <p className="text-gray-700 mb-4">{info.emergency}</p>

        <h2 className="text-2xl font-semibold text-olive mt-6 mb-2">🛒 Nearby Services</h2>
        <p className="text-gray-700 mb-4">{info.services}</p>
      </div>
    </div>
  );
}
