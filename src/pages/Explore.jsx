import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="mt-20 p-4">
      <h1 className="text-2xl font-bold text-sea mb-4 text-center">Explore</h1>

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

      {/* Grid of Explore cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <img
              src={item.image}
              alt={item.title}
              className="rounded-lg mb-3 object-cover h-48 w-full"
            />
            <h2 className="text-xl font-semibold text-sea">{item.title}</h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
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
