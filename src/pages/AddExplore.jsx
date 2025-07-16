import React, { useState } from "react";
import { db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";

export default function AddExplore() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Beaches");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const categories = ["Beaches", "Restaurants & Bars", "Tours", "Shops", "Other"];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type check
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload JPG, PNG, or WebP.");
      return;
    }

    // File size check
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("Image too large. Compressing it for upload...");
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1.5, // Compress to ~1.5MB
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    try {
      const imageRef = ref(storage, `explore/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "explore"), {
        title,
        description,
        category,
        link,
        image: imageUrl,
        likes: 0,
      });

      navigate("/explore");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto mt-20">
      <h1 className="text-2xl font-bold text-sea mb-4 text-center">Add Explore Item</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm text-gray-600 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="block text-sm text-gray-600 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
        />

        <label className="block text-sm text-gray-600 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
          rows="3"
        ></textarea>

        <label className="block text-sm text-gray-600 mb-1">Optional Link</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
        />

        <label className="block text-sm text-gray-600 mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="w-full mb-3"
        />

        <button
          type="submit"
          className="w-full bg-sea text-white p-2 rounded hover:bg-sunset"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
