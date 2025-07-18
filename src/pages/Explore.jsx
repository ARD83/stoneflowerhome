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
      return "bg-orange-400 text-white";
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
  const [filteredCategory, setFilteredCategory] = useState("All");
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

        // Sort by likes desc, then date desc
        data.sort((a, b) => {
          if (b.likes !== a.likes) return b.likes - a.likes;
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
        });

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

  const filteredItems =
    filteredCategory === "All"
      ? items
      : items.filter((item) => item.category === filteredCategory);

  const categories = ["All", "Beaches", "Restaurants & Bars", "Tours", "Shops", "Other"];

  return (
    <div className="mt-20 p-4">
      <h1 className="text-3xl font-bold text-sea mb-4 text-center">Explore Sardinia</h1>
      <p className="text-center text-gray-600 mb-6">
        Discover stunning beaches, delicious food, and local gems shared by other guests.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilteredCategory(cat)}
            className={`px-4 py-1 rounded-full border ${
              filteredCategory === cat
                ? "bg-sea text-white border-sea"
                : "bg-white text-sea border-sea"
            } hover:bg-sea hover:text-white transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 relative"
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
              src={item.image}
              alt={item.title}
              className="w-full h-56 object-cover"
            />

            {/* Content */}
            <div className="p-4 flex flex-col justify-between">
              <h2 className="text-xl font-bold text-sea">{item.title}</h2>
              <p className="text-gray-700 mt-1">{item.description}</p>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sea underline mt-2"
                >
                  Visit
                </a>
              )}

              <div className="flex items-center justify-between mt-3">
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
