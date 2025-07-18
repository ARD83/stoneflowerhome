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
  const [filteredCategory, setFilteredCategory] = useState("");
  const [sortBy, setSortBy] = useState("likes");
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

  let displayedItems = [...items];

  // Filter by category
  if (filteredCategory) {
    displayedItems = displayedItems.filter((item) => item.category === filteredCategory);
  }

  // Sort
  if (sortBy === "likes") {
    displayedItems.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "date") {
    displayedItems.sort((a, b) => {
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
          Discover breathtaking beaches, charming restaurants, and hidden gems shared by other guests.
        </p>
      </div>

      {/* Filter & Sort Row */}
      <div className="max-w-6xl mx-auto px-4 mt-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Category Dropdown */}
        <select
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring focus:border-sea w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring focus:border-sea w-full sm:w-auto"
        >
          <option value="likes">Most Likes</option>
          <option value="date">Newest First</option>
        </select>

        {/* Admin Add Button */}
        {currentUser?.email === "stoneflowerhome@gmail.com" && (
          <button
            onClick={() => navigate("/explore/add")}
            className="bg-sea text-white px-5 py-2 rounded-full shadow hover:bg-sunset transition w-full sm:w-auto"
          >
            ➕ Add Explore
          </button>
        )}
      </div>

      {/* Grid of cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {displayedItems.map((item) => (
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
              <h2 className="text-2xl font-bold text-sea mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sea underline mt-2 inline-block"
                >
                  Visit
                </a>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">
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
