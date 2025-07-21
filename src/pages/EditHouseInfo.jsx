import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function EditHouseInfo() {
  const [info, setInfo] = useState({
    introduction: "",
    rules: "",
    rulesImage: "",
    rulesLink: "",
    garbage: "",
    garbageImage: "",
    garbageLink: "",
    pool: "",
    poolImage: "",
    poolLink: "",
    emergency: "",
    emergencyImage: "",
    emergencyLink: "",
    services: "",
    servicesImage: "",
    servicesLink: "",
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

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageRef = ref(storage, `houseInfo/${field}-${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    setInfo({ ...info, [field]: url });
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

      {["rules", "garbage", "pool", "emergency", "services"].map((section) => (
        <div key={section} className="mb-6">
          <h2 className="text-xl font-semibold text-olive mb-2 capitalize">{section}</h2>
          <textarea
            name={section}
            value={info[section]}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea mb-2"
          />
          <label className="block text-sm text-gray-600 mb-1">Optional Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, `${section}Image`)}
            className="mb-2"
          />
          {info[`${section}Image`] && (
            <img
              src={info[`${section}Image`]}
              alt={`${section} preview`}
              className="rounded-lg shadow mb-2 max-h-48"
            />
          )}
          <label className="block text-sm text-gray-600 mb-1">Optional Link</label>
          <input
            type="url"
            name={`${section}Link`}
            value={info[`${section}Link`]}
            onChange={handleChange}
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
