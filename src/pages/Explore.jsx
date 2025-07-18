import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Background image URL
const backgroundImageUrl = "/assets/explore_background.png"; // Add your image to public/images

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
  const [filteredCategory, setFilteredCategory] = useState("");
  const [sortBy, setSortBy] = useState("likes");
  const [showFilter, setShowFilter] = useState(false);
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
          item.id === itemId ? { ...item, likes: (item.likes ?? 0) + 1 } : item
        )
      );
    });
  }

  let displayedItems = [...items];

  if (filteredCategory) {
    displayedItems = displayedItems.filter((item) => item.category === filteredCategory);
  }

  if (sortBy === "likes") {
    displayedItems.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  } else if (sortBy === "date") {
    displayedItems.sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateB - dateA;
    });
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="text-center py-12 text-white">
          <h1 className="text-5xl font-bold drop-shadow-lg">Explore Sardinia</h1>
          <p className="text-lg mt-3 max-w-xl mx-auto drop-shadow">
            Find breathtaking beaches, hidden gems, and guest-recommended spots.
          </p>

          {/* Filter & Add Buttons */}
          <div className="flex justify-center mt-6 gap-4 flex-wrap relative">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition"
            >
              ☰ Filter & Sort
            </button>

            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute top-16 bg-white rounded-xl shadow-lg p-4 w-64 z-10">
                <div className="mb-3">
                  <label className="block text-gray-600 mb-1">Category:</label>
                  <select
                    value={filteredCategory}
                    onChange={(e) => setFilteredCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-gray-600 mb-1">Sort By:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="likes">Most Likes</option>
                    <option value="date">Newest First</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setFilteredCategory("");
                    setSortBy("likes");
                    setShowFilter(false);
                  }}
                  className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Add Button (Admin only) */}
            {currentUser?.email === "stoneflowerhome@gmail.com" && (
              <button
                onClick={() => navigate("/explore/add")}
                className="flex items-center gap-2 bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition"
              >
                ➕ Add Explore
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-8">
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
                    ❤️ <span>{item.likes ?? 0}</span>
                  </button>
                </div>

                {/* Admin Edit */}
                {currentUser?.email === "stoneflowerhome@gmail.com" && (
                  <button
                    onClick={() => navigate(`/explore/edit/${item.id}`)}
                    className="absolute bottom-3 right-3 bg-sea text-white px-3 py-1 rounded-full text-sm hover:bg-sunset transition"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
