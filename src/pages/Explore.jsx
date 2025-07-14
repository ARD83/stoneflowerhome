
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function Explore() {
  const { currentUser } = useAuth();
  const [exploreItems, setExploreItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "stoneflowerhome@gmail.com"; // Replace with your admin email

  useEffect(() => {
    async function fetchExplore() {
      try {
        const querySnapshot = await getDocs(collection(db, "explore"));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExploreItems(items);
      } catch (error) {
        console.error("Error fetching Explore items:", error);
      }
      setLoading(false);
    }
    fetchExplore();
  }, []);

  async function handleAddItem(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, "explore"), { title, description });
      setExploreItems([...exploreItems, { title, description }]);
      setTitle("");
      setDescription("");
      alert("Explore item added!");
    } catch (error) {
      console.error("Error adding Explore item:", error);
    }
  }

  if (loading) return <div className="p-6">Loading Explore items...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Explore Sardinia</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {exploreItems.map((item, index) => (
          <div key={index} className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-slate-700">{item.description}</p>
          </div>
        ))}
      </div>

      {currentUser && currentUser.email === ADMIN_EMAIL ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Add Explore Item</h2>
          <form onSubmit={handleAddItem} className="space-y-2">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-sea text-white px-4 py-2 rounded hover:bg-sunset"
            >
              Add
            </button>
          </form>
        </div>
      ) : (
        <p className="mt-4 text-slate-500">
          {currentUser ? "You are not authorized to edit Explore items." : "Login as admin to edit Explore items."}
        </p>
      )}
    </div>
  );
}
