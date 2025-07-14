import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditExplore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

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
        } else {
          console.error("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    }
    fetchItem();
  }, [id]);

  async function handleSave(e) {
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
        likes: 0
      });

      navigate("/explore");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  }

  async function handleDelete() {
    try {
      await deleteDoc(doc(db, "explore", id));
      navigate("/explore");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto mt-20">
      <h1 className="text-2xl font-bold text-sea mb-4 text-center">Edit Explore Item</h1>
      <form onSubmit={handleSave} className="bg-white p-4 rounded-lg shadow-md">
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

        {imageUrl && (
          <div className="mb-3">
            <img src={imageUrl} alt="Current" className="rounded-lg shadow max-h-48 mx-auto" />
          </div>
        )}

        <label className="block text-sm text-gray-600 mb-1">Replace Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full mb-3"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-sea text-white p-2 rounded hover:bg-sunset"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-coral text-white p-2 rounded hover:bg-red-700"
          >
            Delete Item
          </button>
        </div>
      </form>
    </div>
  );
}
