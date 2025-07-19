// src/pages/EditHouseInfo.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function EditHouseInfo() {
  const [info, setInfo] = useState({
    introduction: "",
    rules: "",
    garbage: "",
    pool: "",
    emergency: "",
    services: "",
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  useEffect(() => {
    async function fetchInfo() {
      try {
        const docRef = doc(db, "settings", "houseInfo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching house info:", error);
      }
    }
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "settings", "houseInfo"), info);
      alert("House Information updated!");
      navigate("/house-info");
    } catch (error) {
      console.error("Error saving house info:", error);
    }
  };

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="flex justify-center items-center h-screen bg-sand">
        <p className="text-sea text-lg">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-sea mb-4 text-center">
        Edit House Info
      </h1>
      {Object.keys(info).map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-sm text-gray-600 mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </label>
          <textarea
            name={key}
            value={info[key]}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="w-full bg-sea text-white p-2 rounded hover:bg-sunset"
      >
        Save Changes
      </button>
    </div>
  );
}
