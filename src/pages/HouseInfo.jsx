import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import backgroundImage from "../assets/explore-bg.jpg";

export default function HouseInfo() {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const querySnapshot = await getDocs(collection(db, "houseInfo"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (error) {
        console.error("Error fetching house info:", error);
      }
    }
    fetchInfo();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-[70px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center text-white drop-shadow-lg mb-10">
          House Information
        </h1>

        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow hover:shadow-lg transition transform hover:-translate-y-1 mb-8 flex flex-col md:flex-row"
          >
            {/* Image */}
            {item.image && (
              <div className="md:w-1/3 w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  onClick={() => setSelectedImage(item.image)}
                  className="w-full h-64 object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none cursor-pointer"
                />
              </div>
            )}

            {/* Text Content */}
            <div className="p-6 flex-1">
              <h2 className="text-2xl font-bold text-sea mb-2">{item.title}</h2>
              <p className="text-gray-700 mb-3">{item.description}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sunset underline hover:text-sea transition"
                >
                  More Info
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
