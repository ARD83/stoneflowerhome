import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import backgroundImage from "../assets/explore-bg.jpg";

export default function HouseInfo() {
  const [info, setInfo] = useState(null);
  const [modalImage, setModalImage] = useState(null);

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

  const renderCard = (title, text, image, link) => (
    <div
      key={title}
      className="flex flex-col md:flex-row bg-white/90 rounded-xl shadow-md mb-6 overflow-hidden hover:shadow-lg transition"
    >
      {/* Image */}
      {image ? (
        <img
          src={image}
          alt={title}
          onClick={() => setModalImage(image)}
          className="md:w-1/3 object-cover cursor-pointer hover:scale-105 transition-transform"
        />
      ) : (
        <div className="md:w-1/3 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      )}

      {/* Text Content */}
      <div className="p-4 md:w-2/3 flex flex-col justify-between">
        <h2 className="text-2xl font-semibold text-sea mb-2">{title}</h2>
        <p className="text-gray-700 mb-3">{text}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sea text-white px-4 py-2 rounded hover:bg-sunset transition"
          >
            Learn More
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-[100px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-sea mb-6 text-center">
          Welcome & House Info
        </h1>

        {renderCard("🏠 House Rules", info.rules, info.rulesImage, info.rulesLink)}
        {renderCard("🗑 Garbage Disposal", info.garbage, info.garbageImage, info.garbageLink)}
        {renderCard("🏊 Pool Rules", info.pool, info.poolImage, info.poolLink)}
        {renderCard("🚨 Emergency Numbers", info.emergency, info.emergencyImage, info.emergencyLink)}
        {renderCard("🛒 Nearby Services", info.services, info.servicesImage, info.servicesLink)}
      </div>

      {/* Fullscreen Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Enlarged"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
