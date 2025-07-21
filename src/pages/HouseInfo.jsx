import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import backgroundImage from "../assets/explore-bg.jpg";

export default function HouseInfo() {
  const [cards, setCards] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const q = query(collection(db, "houseInfo"), orderBy("order"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(data);
      } catch (error) {
        console.error("Error loading house info:", error);
      }
    }
    fetchCards();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-[100px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-sea mb-6 text-center">
          Welcome & House Info
        </h1>

        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col md:flex-row bg-white/90 rounded-xl shadow-md mb-6 overflow-hidden hover:shadow-lg transition"
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.title}
                onClick={() => setModalImage(card.image)}
                className="md:w-1/3 object-cover cursor-pointer hover:scale-105 transition-transform"
              />
            )}
            <div className="p-4 md:w-2/3 flex flex-col justify-between">
              <h2 className="text-2xl font-semibold text-sea mb-2">{card.title}</h2>
              <p className="text-gray-700 mb-3">{card.description}</p>
              {card.link && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-sea text-white px-4 py-2 rounded hover:bg-sunset transition"
                >
                  Learn More
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

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
