import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function getBadgeColor(category) {
  switch (category) {
    case "Beaches":
      return "bg-sky-500 text-white";
    case "Restaurants & Bars":
      return "bg-green-500 text-white";
    case "Tours":
      return "bg-orange-500 text-white";
    case "Shops":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function Explore() {
  const [items, setItems] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const querySnapshot = await getDocs(collection(db, "explore"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (error) {
        console.error("Error fetching explore items:", error);
      }
    }
    fetchItems();
  }, []);

  function handleLike(itemId) {
    const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
    if (likedItems.includes(itemId)) {
      alert("You’ve already liked this!");
      return;
    }

    likedItems.push(itemId);
    localStorage.setItem("likedItems", JSON.stringify(likedItems));

    const docRef = doc(db, "explore", itemId);
    updateDoc(docRef, { likes: increment(1) }).then(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, likes: item.likes + 1 } : item
        )
      );
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-400 to-teal-300 text-center py-12">
        <h1 className="text-5xl font-bold text-white drop-shadow">
          Explore Sardinia
        </h1>
        <p className="text-lg text-white mt-3 max-w-xl mx-auto">
          Find breathtaking beaches, hidden gems, and guest-recommended spots.
        </p>

        {/* Filter & Add Buttons */}
        <div className="flex justify-center mt-6 gap-4 flex-wrap">
          <button
            className="flex items-center gap-2 bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition"
          >
            <span>☰</span> Filter & Sort
          </button>

          {currentUser?.email === "stoneflowerhome@gmail.com" && (
            <button
              onClick={() => navigate("/explore/add")}
              className="flex items-center gap-2 bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition"
            >
              <span>➕</span> Add Explore
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow hover:shadow-lg transition transform hover:-translate-y-1 relative"
          >
            {/* Category Badge */}
            <div
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${getBadgeColor(
                item.category
              )}`}
            >
              {item.category}
            </div>

            {/* Image */}
            <img
              src={item.image || "/placeholder.jpg"}
              alt={item.title}
              className="w-full h-60 object-cover rounded-t-3xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.jpg";
              }}
            />

            {/* Content */}
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sea underline inline-block mb-2"
                >
                  Visit
                </a>
              )}

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  Added: {formatDate(item.date)}
                </span>
                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
                >
                  ❤️ <span>{item.likes}</span>
                </button>
              </div>
            </div>

            {/* Admin Edit Button */}
            {currentUser?.email === "stoneflowerhome@gmail.com" && (
              <button
                onClick={() => navigate(`/explore/edit/${item.id}`)}
                className="absolute bottom-3 right-3 bg-sea text-white px-3 py-1 rounded-full text-sm hover:bg-sunset transition"
              >
                ✏️ Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
