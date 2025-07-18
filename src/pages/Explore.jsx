import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/explore-bg.jpg"; // Background image

// ... (getBadgeColor and formatDate unchanged)

export default function Explore() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");
  const [sortBy, setSortBy] = useState("likes");
  const [showFilter, setShowFilter] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const querySnapshot = await getDocs(collection(db, "explore"));
        const data = querySnapshot.docs.map((doc) => {
          const item = doc.data();
          if (item.likes === undefined || item.likes === null) {
            item.likes = 0;
          }
          return { id: doc.id, ...item };
        });
        setItems(data);

        // Extract unique categories dynamically
        const uniqueCategories = Array.from(new Set(data.map((item) => item.category))).filter(Boolean);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching explore items:", error);
      }
    }
    fetchItems();
  }, []);

  // ... (handleLike unchanged)
  // ... (filter/sort logic unchanged)

  return (
    <div
      className="min-h-screen bg-cover bg-center relative" // ✅ Removed pt-20 here
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero, Filters, Cards unchanged */}
        {/* ... */}
      </div>
    </div>
  );
}
