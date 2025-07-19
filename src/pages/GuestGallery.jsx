import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/explore-bg.jpg"; // same background

export default function GuestGallery() {
  const [items, setItems] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  useEffect(() => {
    async function fetchGallery() {
      try {
        const querySnapshot = await getDocs(collection(db, "guestGallery"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (error) {
        console.error("Error fetching guest gallery:", error);
      }
    }
    fetchGallery();
  }, []);

  const handleLike = async (id) => {
    const likedKey = `guestGallery_liked_${id}`;
    if (localStorage.getItem(likedKey)) {
      alert("You already voted for this memory.");
      return;
    }
    try {
      const itemRef = doc(db, "guestGallery", id);
      const currentLikes = items.find((item) => item.id === id)?.likes || 0;
      await updateDoc(itemRef, { likes: currentLikes + 1 });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: currentLikes + 1 } : item
        )
      );
      localStorage.setItem(likedKey, "true");
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  function formatDate(timestamp) {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-[100px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Title & Add Button */}

          <div className="text-center py-12 text-white">
          <h1 className="text-5xl font-bold drop-shadow-lg">Guest Gallery</h1>
          <p className="text-lg mt-3 max-w-xl mx-auto drop-shadow">
            Share your memory.
          </p>

            {/* Add Button (Admin only) */}
              <button
                onClick={() => navigate("/gallery/add")}
                className="flex items-center gap-2 bg-yellow-200 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition"
              >
                ➕ Add your Memory
              </button>
          </div>
        </div>

        {/* Gallery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow hover:shadow-lg transition transform hover:-translate-y-1 relative flex flex-col"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-60 object-cover rounded-t-3xl"
                />
              ) : (
                <div className="w-full h-60 bg-gray-100 flex items-center justify-center rounded-t-3xl text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  {item.guestName && (
                    <p className="text-sm text-gray-500">
                      Shared by: {item.guestName}
                    </p>
                  )}
                  <span className="text-sm text-gray-500">
                    Added: {formatDate(item.date)}
                  </span>
                </div>

                {/* Buttons Row */}
                <div className="flex justify-end gap-2 mt-4">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(item.id)}
                    className="flex items-center gap-1 text-red-500 hover:scale-105 transition"
                  >
                    ❤️ {item.likes || 0}
                  </button>

                  {/* Edit Button (Admin only) */}
                  {currentUser?.email === ADMIN_EMAIL && (
                    <button
                      onClick={() => navigate(`/gallery/edit/${item.id}`)}
                      className="bg-sea text-white px-3 py-1 rounded-full text-sm hover:bg-sunset transition"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
