import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddExploreForm({ onAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const categories = ["Beaches", "Restaurants & Bars", "Tours", "Shops", "Other"];

  async function handleSubmit(e) {
    e.preventDefault();
    let imageUrl = "";

    try {
      if (imageFile) {
        const imageRef = ref(storage, `explore/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "explore"), {
        title,
        description,
        link,
        category,
        image: imageUrl,
        likes: 0,
      });

      setTitle("");
      setDescription("");
      setLink("");
      setCategory("");
      setImageFile(null);
      setPreviewUrl("");
      onAdded();
    } catch (error) {
      console.error("Error adding explore item:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mt-6 max-w-lg mx-auto"
    >
      <h2 className="text-lg font-semibold text-sea mb-4">Add New Explore Item</h2>

      {/* Category Selector */}
      <label className="block text-sm text-gray-600 mb-1">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Title */}
      <label className="block text-sm text-gray-600 mb-1">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        required
        className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
      />

      {/* Description */}
      <label className="block text-sm text-gray-600 mb-1">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
        required
        className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
        rows="3"
      ></textarea>

      {/* Link */}
      <label className="block text-sm text-gray-600 mb-1">Optional Link</label>
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="https://example.com"
        className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
      />

      {/* Image Upload */}
      <label className="block text-sm text-gray-600 mb-1">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImageFile(e.target.files[0]);
          setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }}
        className="w-full mb-3"
      />
      {previewUrl && (
        <div className="mb-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-lg shadow max-h-48 mx-auto"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-sea text-white p-2 rounded hover:bg-sunset"
      >
        Add Item
      </button>
    </form>
  );
}
