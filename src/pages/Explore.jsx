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

  // Filter by selected categories
  if (filteredCategories.length > 0) {
    filteredItems = filteredItems.filter((item) =>
      filteredCategories.includes(item.category)
    );
  }

  // Sort
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
    <div className="mt-20 p-4 relative">
      {/* 🌊 Homepage-style Heading */}
      <h1 className="text-5xl font-bold text-sea mb-3 text-center drop-shadow">
        Explore Sardinia
      </h1>
      <p className="text-lg text-sea text-center mb-4 max-w-2xl mx-auto">
        Discover stunning beaches, delicious food, and hidden gems shared by guests.
      </p>

      {/* Admin Add Button */}
      {currentUser?.email === "stoneflowerhome@gmail.com" && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/explore/add")}
            className="bg-sea text-white px-5 py-2 rounded-full shadow hover:bg-sunset transition"
          >
            ➕ Add Explore
          </button>
        </div>
      )}

      {/* Floating Filter & Sort Button */}
      <button
        onClick={() => setShowFilterPanel(true)}
        className="fixed bottom-6 right-6 bg-sea text-white p-3 rounded-full shadow-lg hover:bg-sunset transition z-50"
      >
        🛠 Filter & Sort
      </button>

      {/* Filter & Sort Panel */}
      {showFilterPanel && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold text-sea mb-4">Filter & Sort</h2>

            {/* Categories */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Categories</h3>
              {categories.map((cat) => (
                <div key={cat} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={cat}
                    checked={filteredCategories.includes(cat)}
                    onChange={() =>
                      setFilteredCategories((prev) =>
                        prev.includes(cat)
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat]
                      )
                    }
                    className="mr-2"
                  />
                  <label htmlFor={cat}>{cat}</label>
                </div>
              ))}
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-1 w-full"
              >
                <option value="likes">Most Likes</option>
                <option value="date">Newest First</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={clearAllFilters}
                className="text-red-500 hover:underline"
              >
                Clear All
              </button>
              <button
                onClick={applyFilterSort}
                className="bg-sea text-white px-4 py-1 rounded hover:bg-sunset transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

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
              src={item.image || "/placeholder.jpg"}
              alt={item.title}
              className="w-full h-56 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.jpg";
              }}
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
