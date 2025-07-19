import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/explore-bg.jpg"; // reuse explore background

export default function GuestGallery() {
  const [items, setItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [guestName, setGuestName] = useState("");
  const [imageFile, setImageFile] = useState(null);
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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (imageFile) {
        const imageRef = ref(storage, `guestGallery/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "guestGallery"), {
        title,
        description,
        guestName,
        image: imageUrl, // ✅ Optional image
        date: new Date(),
      });

      setAdding(false);
      setTitle("");
      setDescription("");
      setGuestName("");
      setImageFile(null);

      // Refresh gallery
      const querySnapshot = await getDocs(collection(db, "guestGallery"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    } catch (error) {
      console.error("Error adding gallery item:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload JPG, PNG, or WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Compressing it...");
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 4.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        setImageFile(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    } else {
      setImageFile(file);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deleteDoc(doc(db, "guestGallery", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
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
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-6 drop-shadow">
          Guest Gallery
        </h1>

        {/* Add Memory Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setAdding(!adding)}
            className="bg-yellow-200 text-gray-800 px-5 py-2 rounded-full shadow hover:bg-yellow-300 transition"
          >
            📸 Add Your Memory
          </button>
        </div>

        {/* Add Form */}
        {adding && (
          <form
            onSubmit={handleAdd}
            className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-4 max-w-xl mx-auto mb-8"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="3"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Image (Optional)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="w-full text-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sea text-white py-3 rounded-lg hover:bg-sunset transition"
            >
              ✅ Save
            </button>
          </form>
        )}

        {/* Gallery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow hover:shadow-lg transition transform hover:-translate-y-1 relative"
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
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                {item.guestName && (
                  <p className="text-sm text-gray-500">Shared by: {item.guestName}</p>
                )}
                <span className="text-sm text-gray-500">
                  Added: {formatDate(item.date)}
                </span>

                {/* Edit button (Admin only) */}
                {currentUser?.email === ADMIN_EMAIL && (
                  <button
                    onClick={() => navigate(`/gallery/edit/${item.id}`)}
                    className="absolute top-3 right-3 bg-sea text-white px-3 py-1 rounded-full text-sm hover:bg-sunset transition"
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
