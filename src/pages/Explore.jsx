import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function getBadgeColor(category) {
  switch (category) {
    case "Beaches":
      return "bg-blue-500 text-white";
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
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [sortBy, setSortBy] = useState("likes"); // 🆕 Default sorting
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
      alert("You have already liked this item!");
      return;
    }

    likedItems.push(itemId);
    localStorage.setItem("likedItems", JSON.stringify(likedItems));

    const docRef = doc(db, "explore", itemId);
    updateDoc(docRef, { likes: increment(1) })
      .then(() => {
        setItems((prev) =>
          prev
            .map((item) =>
              item.id === itemId ? { ...item, likes: item.likes + 1 } : item
            )
        );
      })
      .catch((err) => console.error("Error liking item:", err));
  }

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "likes") {
      if (b.likes !== a.likes) return b.likes - a.likes;
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateB - dateA; // Secondary: newest first
    } else if (sortBy === "date") {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateB - dateA;
    }
    return 0;
  });

  const filteredItems =
    filteredCategory === "All"
      ? sortedItems
      : sortedItems.filter((item) => item.category === filteredCategory);

  const categories = ["All", "Beaches", "Restaurants & Bars", "Tours", "Shops", "Other"];

  return (
    <div className="mt-20 p-4">
      <h1 className="text-2xl font-bold text-sea mb-2 text-center">Explore</h1>
      <p className="text-center text-gray-600 mb-6">
        Discover our favorite spots in Sardinia, from hidden beaches to lively restaurants and tours. 
        Filter by category or vote for the places you loved the most!
      </p>

      {/* Add Explore button (Admin only) */}
      {currentUser?.email === "stoneflowerhome@gmail.com" && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => navigate("/explore/add")}
            className="bg-sea text-white px-4 py-2 rounded hover:bg-sunset transition-colors"
          >
            ➕ Add Explore
          </button>
        </div>
      )}

      {/* Category Filter & Sort Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilteredCategory(cat)}
              className={`px-3 py-1 rounded-full border ${
                filteredCategory === cat
                  ? "bg-sea text-white border-sea"
                  : "bg-white text-sea border-sea"
              } hover:bg-sea hover:text-white transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-center md:justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-olive rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-sea"
          >
            <option value="likes">Sort by Likes</option>
            <option value="date">Sort by Date (Newest)</option>
          </select>
        </div>
      </div>

      {/* Grid of Explore cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between relative"
          >
            {/* Category Badge */}
            <div
              className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full shadow ${getBadgeColor(item.category)}`}
            >
              {item.category}
            </div>

            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="rounded-lg mb-3 object-cover h-48 w-full"
            />

            {/* Title */}
            <h2 className="text-xl font-semibold text-sea">{item.title}</h2>

            {/* Date */}
            <p className="text-sm text-gray-500 mb-2">
              Added on: {formatDate(item.date)}
            </p>

            {/* Description */}
            <p className="text-gray-700 mb-2">{item.description}</p>

            {/* Optional link */}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sea underline mb-2"
              >
                Visit
              </a>
            )}

            {/* Like Button */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handleLike(item.id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-700"
              >
                ❤️
              </button>
              <span className="text-gray-600 text-sm">{item.likes} likes</span>
            </div>

            {/* Edit button (Admin only) */}
            {currentUser?.email === "stoneflowerhome@gmail.com" && (
              <button
                onClick={() => navigate(`/explore/edit/${item.id}`)}
                className="mt-3 bg-sea text-white px-3 py-1 rounded hover:bg-sunset"
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
