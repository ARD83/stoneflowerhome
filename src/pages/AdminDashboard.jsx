import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import backgroundImage from "../assets/explore-bg.jpg"; // same background

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [exploreItems, setExploreItems] = useState([]);
  const [guestGalleryItems, setGuestGalleryItems] = useState([]);
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  useEffect(() => {
    if (currentUser?.email === ADMIN_EMAIL) {
      fetchExplore();
      fetchGuestGallery();
    }
  }, [currentUser]);

  async function fetchExplore() {
    const querySnapshot = await getDocs(collection(db, "explore"));
    setExploreItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  async function fetchGuestGallery() {
    const querySnapshot = await getDocs(collection(db, "guestGallery"));
    setGuestGalleryItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  async function handleDeleteExplore(id, imageUrl) {
    if (!window.confirm("Delete this Explore item?")) return;
    await deleteDoc(doc(db, "explore", id));
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(err => console.log("Image already deleted:", err));
    }
    fetchExplore();
  }

  async function handleDeleteGuestGallery(id, imageUrl) {
    if (!window.confirm("Delete this GuestGallery item?")) return;
    await deleteDoc(doc(db, "guestGallery", id));
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(err => console.log("Image already deleted:", err));
    }
    fetchGuestGallery();
  }

  if (currentUser?.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Access Denied</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-[100px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow">
          Admin Dashboard
        </h1>

        {/* Explore Content Management */}
        <section className="mb-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📂 Manage Explore Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exploreItems.map(item => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <button
                  onClick={() => handleDeleteExplore(item.id, item.image)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* GuestGallery Management */}
        <section className="mb-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📸 Manage Guest Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guestGalleryItems.map(item => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.guestName || "Guest"}</p>
                </div>
                <button
                  onClick={() => handleDeleteGuestGallery(item.id, item.image)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Settings Management */}
        <section className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ⚙️ Edit Wi-Fi Settings
          </h2>
          <p className="text-gray-600">
            To edit Wi-Fi details, go to the{" "}
            <a
              href="/wifi"
              className="text-sea underline hover:text-sunset"
            >
              Wi-Fi page
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
