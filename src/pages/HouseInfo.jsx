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

  const renderSection = (title, text, image, link) => (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-olive mt-6 mb-2">{title}</h2>
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full rounded-lg shadow-md mb-3"
        />
      )}
      <p className="text-gray-700 mb-2">{text}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 bg-sea text-white px-4 py-2 rounded hover:bg-sunset"
        >
          Learn More
        </a>
      )}
    </div>
  );

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

        {renderSection("🏠 House Rules", info.rules, info.rulesImage, info.rulesLink)}
        {renderSection("🗑 Garbage Disposal", info.garbage, info.garbageImage, info.garbageLink)}
        {renderSection("🏊 Pool Rules", info.pool, info.poolImage, info.poolLink)}
        {renderSection("🚨 Emergency Numbers", info.emergency, info.emergencyImage, info.emergencyLink)}
        {renderSection("🛒 Nearby Services", info.services, info.servicesImage, info.servicesLink)}
      </div>
    </div>
  );
}
