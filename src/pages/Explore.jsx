import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function getBadgeColor(category) {
  switch (category) {
    case "Beaches":
      return "bg-sky-400 text-white";
    case "Restaurants & Bars":
      return "bg-green-400 text-white";
    case "Tours":
      return "bg-orange-400 text-white";
    case "Shops":
      return "bg-purple-400 text-white";
    default:
      return "bg-gray-300 text-white";
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
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortBy, setSortBy] = useState("likes");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const categories = ["Beaches", "Restaurants & Bars", "Tours", "Shops", "Other"];

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

  function applyFilterSort() {
    setShowFilterPanel(false);
  }

  function clearAllFilters() {
    setFilteredCategories([]);
    setSortBy("likes");
    setShowFilterPanel(false);
  }

  let filteredItems = [...items];

  if (filteredCategories.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      filteredCategories.includes(item.category)
    );
  }

  if (sortBy === "likes") {
    filteredItems.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "date") {
    filteredItems.sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateB - dateA;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-300 to-teal-200 text-center py-12">
        <h1 className="text-5xl font-bold text-sea drop-shadow-lg">
          Explore Sardinia
        </h1>
        <p className="text-lg text-sea mt-2 max-w-xl mx-auto">
          Find breathtaking beaches, hidden gems, and guest-recommended spots.
        </p>
      </div>

      <div className="p-4 max-w-5xl mx-auto">
        {/* Filter & Add Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setFilteredCategories((prev) =>
                    prev.includes(cat)
                      ? prev.filter((c) => c !== cat)
                      : [...prev, cat]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filteredCategories.includes(cat)
                    ? "bg-sea text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-sea hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {currentUser?.email === "stoneflowerhome@gmail.com" && (
            <button
              onClick={() => navigate("/explore/add")}
              className="mt-3 sm:mt-0 bg-sea text-white px-4 py-2 rounded-full shadow hover:bg-sunset transition text-sm"
            >
              ➕ Add Explore
            </button>
          )}
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 relative"
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
                className="w-full h-56 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.jpg";
                }}
              />

              {/* Content */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-sea mb-1">{item.title}</h2>
                <p className="text-gray-700 mb-2">{item.description}</p>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sea underline"
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
    </div>
  );
}
