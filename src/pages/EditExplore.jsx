import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import backgroundImage from "../assets/explore-bg.jpg"; // ✅ use Explore background

export default function EditExplore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Beaches");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [likes, setLikes] = useState(0);

  const categories = ["Beaches", "Restaurants & Bars", "Tours", "Shops", "Other"];

  useEffect(() => {
    async function fetchItem() {
      try {
        const docRef = doc(db, "explore", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setLink(data.link);
          setImageUrl(data.image || "");
          setLikes(data.likes || 0);
        } else {
          console.error("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    }
    fetchItem();
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload JPG, PNG, or WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Compressing it for upload...");
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

  const handleSave = async (e) => {
    e.preventDefault();
    let updatedImageUrl = imageUrl;

    try {
      if (imageFile) {
        const imageRef = ref(storage, `explore/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        updatedImageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "explore", id), {
        title,
        description,
        category,
        link,
        image: updatedImageUrl,
        likes,
        date: new Date(), // 🆕 update date on edit
      });

      navigate("/explore");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "explore", id));
      navigate("/explore");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-[100px]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 max-w-2xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-white text-center mb-6 drop-shadow">
          Edit Explore Item
        </h1>

        <form
          onSubmit={handleSave}
          className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-4"
        >
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
            ></textarea>
          </div>

          {/* Optional Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Optional Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sea"
            />
          </div>

          {/* Current Image */}
          {imageUrl && (
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Current Image:</p>
              <img
                src={imageUrl}
                alt="Current"
                className="rounded-lg shadow max-h-56 mx-auto"
              />
            </div>
          )}

          {/* Replace Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Replace Image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full text-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-sea text-white py-3 rounded-lg hover:bg-sunset transition"
            >
              💾 Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
            >
              🗑️ Delete Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
