import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import backgroundImage from "../assets/explore-bg.jpg";

export default function ManageHouseInfo() {
  const [items, setItems] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "houseInfo"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (err) {
        console.error("Error fetching House Info:", err);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteDoc(doc(db, "houseInfo", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Access Denied</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-[80px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">Manage House Info</h1>
          <button
            onClick={() => navigate("/house-info/add")}
            className="bg-sea text-white px-4 py-2 rounded hover:bg-sunset transition"
          >
            ➕ Add New Info
          </button>
        </div>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full md:w-1/3 object-cover"
                />
              )}
              <div className="p-4 flex-1">
                <h2 className="text-2xl font-bold text-sea">{item.title}</h2>
                <p className="text-gray-700 mb-2">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sunset underline hover:text-sea"
                  >
                    More Info
                  </a>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/house-info/edit/${item.id}`)}
                    className="bg-yellow-300 text-gray-800 px-3 py-1 rounded hover:bg-yellow-400"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-coral text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
