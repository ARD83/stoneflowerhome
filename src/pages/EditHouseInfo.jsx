import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditHouseInfo() {
  const [cards, setCards] = useState([]);
  const [category, setCategory] = useState("House Rules");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  const categories = [
    "House Rules",
    "Garbage",
    "Pool Rules",
    "Emergency Info",
    "Nearby Services",
    "Other",
  ];

  useEffect(() => {
    async function fetchCards() {
      try {
        const q = query(
          collection(db, "houseInfo"),
          where("category", "==", category),
          orderBy("order")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading cards:", error);
      }
    }
    fetchCards();
  }, [category]);

  const handleInputChange = (id, field, value) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const handleImageUpload = async (file, id) => {
    const imageRef = ref(storage, `houseInfo/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    handleInputChange(id, "image", url);
  };

  const handleSave = async (id) => {
    const card = cards.find((c) => c.id === id);
    try {
      await updateDoc(doc(db, "houseInfo", id), card);
      alert("Card updated!");
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  const handleAddCard = async () => {
    try {
      const docRef = await addDoc(collection(db, "houseInfo"), {
        title: "",
        description: "",
        link: "",
        image: "",
        order: cards.length + 1,
        category: category,
      });
      setCards((prev) => [
        ...prev,
        { id: docRef.id, title: "", description: "", link: "", image: "" },
      ]);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "houseInfo", id));
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="flex justify-center items-center h-screen bg-sand">
        <p className="text-sea text-lg">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-sea mb-6 text-center">
        Edit House Info
      </h1>

      {/* Category Selector */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-sea"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow p-4 mb-4"
            >
              <input
                type="text"
                value={card.title}
                onChange={(e) =>
                  handleInputChange(card.id, "title", e.target.value)
                }
                placeholder="Title"
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                value={card.description}
                onChange={(e) =>
                  handleInputChange(card.id, "description", e.target.value)
                }
                placeholder="Description"
                className="w-full mb-2 p-2 border rounded"
                rows="3"
              />
              <input
                type="url"
                value={card.link}
                onChange={(e) =>
                  handleInputChange(card.id, "link", e.target.value)
                }
                placeholder="Optional Link"
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e.target.files[0], card.id)
                }
                className="w-full mb-2"
              />
              {card.image && (
                <img
                  src={card.image}
                  alt="Preview"
                  className="rounded-lg mb-2 max-h-48"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(card.id)}
                  className="flex-1 bg-sea text-white p-2 rounded hover:bg-sunset"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="flex-1 bg-coral text-white p-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddCard}
            className="w-full bg-yellow-300 text-gray-800 p-2 rounded hover:bg-yellow-400"
          >
            ➕ Add New Card
          </button>
        </>
      )}
    </div>
  );
}
